import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AdminRow = {
  id: string;
  username: string;
  display_name: string;
  access_level: string;
  auth_email: string;
  auth_user_id: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

function randomPassword() {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
}

/**
 * Login do painel por usuário + senha.
 * A senha é verificada no banco (hash bcrypt) e, em caso de sucesso, o servidor
 * emite um token de sessão para o usuário administrativo correspondente.
 * Estruturado para múltiplos administradores e níveis de acesso.
 */
export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: { username: string; password: string }) => ({
    username: String(input.username ?? "").trim().slice(0, 60),
    password: String(input.password ?? "").slice(0, 200),
  }))
  .handler(async ({ data }) => {
    if (!data.username || !data.password) {
      throw new Error("Informe usuário e senha.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    const { data: rows, error } = await admin.rpc("verify_admin_login", {
      _username: data.username,
      _password: data.password,
    });
    if (error) throw new Error("Não foi possível validar o acesso.");
    const row = (rows as AdminRow[] | null)?.[0];
    if (!row) throw new Error("Usuário ou senha inválidos.");

    let authUserId = row.auth_user_id;
    if (!authUserId) {
      const created = await admin.auth.admin.createUser({
        email: row.auth_email,
        password: randomPassword(),
        email_confirm: true,
        user_metadata: { full_name: row.display_name || row.username, panel_user: true },
      });
      if (created.error || !created.data?.user) {
        const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const found = list.data?.users?.find(
          (u: { email?: string }) => u.email?.toLowerCase() === row.auth_email.toLowerCase(),
        );
        if (!found) throw new Error("Não foi possível preparar o acesso administrativo.");
        authUserId = found.id;
      } else {
        authUserId = created.data.user.id;
      }
      await admin.from("admin_users").update({ auth_user_id: authUserId }).eq("id", row.id);
    }

    await admin
      .from("user_roles")
      .upsert({ user_id: authUserId, role: "admin" }, { onConflict: "user_id,role" });

    const link = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: row.auth_email,
    });
    const tokenHash = link.data?.properties?.hashed_token;
    if (link.error || !tokenHash) throw new Error("Não foi possível iniciar a sessão.");

    await admin
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", row.id);

    return {
      tokenHash: tokenHash as string,
      displayName: row.display_name || row.username,
      accessLevel: row.access_level,
    };
  });

/** Dados do administrador logado (para o cabeçalho e configurações). */
export const getAdminProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roles) throw new Error("Acesso restrito.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await (supabaseAdmin as any)
      .from("admin_users")
      .select("id, username, display_name, access_level, last_login_at")
      .eq("auth_user_id", context.userId)
      .maybeSingle();
    return (data ?? null) as {
      id: string;
      username: string;
      display_name: string;
      access_level: string;
      last_login_at: string | null;
    } | null;
  });

/** Alteração de usuário/senha do painel (senha nunca é exibida em texto aberto). */
export const updateAdminCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      currentPassword: string;
      username?: string;
      newPassword?: string;
      displayName?: string;
    }) => ({
      currentPassword: String(input.currentPassword ?? ""),
      username: String(input.username ?? "").trim().slice(0, 60),
      newPassword: String(input.newPassword ?? "").slice(0, 200),
      displayName: String(input.displayName ?? "").trim().slice(0, 80),
    }),
  )
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roles) throw new Error("Acesso restrito.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    const { data: current } = await admin
      .from("admin_users")
      .select("id, username")
      .eq("auth_user_id", context.userId)
      .maybeSingle();
    if (!current) throw new Error("Usuário do painel não encontrado.");

    const { data: verified } = await admin.rpc("verify_admin_login", {
      _username: current.username,
      _password: data.currentPassword,
    });
    if (!(verified as AdminRow[] | null)?.length) throw new Error("Senha atual incorreta.");

    if (data.newPassword && data.newPassword.length < 6) {
      throw new Error("A nova senha deve ter ao menos 6 caracteres.");
    }

    await admin.rpc("set_admin_password", {
      _id: current.id,
      _username: data.username,
      _password: data.newPassword,
    });

    if (data.displayName) {
      await admin.from("admin_users").update({ display_name: data.displayName }).eq("id", current.id);
    }

    return { ok: true };
  });
