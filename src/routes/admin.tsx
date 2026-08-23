import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { RecordEditor } from "@/components/admin/RecordEditor";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  useBarbers,
  useMedia,
  usePlans,
  useServices,
  useSiteSettings,
  type Subscription,
} from "@/lib/site-content";
import { daysUntil, formatDate, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Girih Barbearia" },
      {
        name: "description",
        content:
          "Painel administrativo da Girih Barbearia: conteúdo do site, serviços, barbeiros, planos, mídias e assinaturas.",
      },
      { property: "og:title", content: "Painel administrativo — Girih Barbearia" },
      { property: "og:description", content: "Gestão de conteúdo e assinaturas." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const { data: settings } = useSiteSettings();
  const { data: services = [] } = useServices(false);
  const { data: barbers = [] } = useBarbers(false);
  const { data: plans = [] } = usePlans(false);
  const { data: media = [] } = useMedia();

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscriptions"],
    enabled: isAdmin,
    queryFn: async (): Promise<Subscription[]> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("expires_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Subscription[];
    },
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/entrar" });
  }, [loading, user, navigate]);

  if (!loading && user && !isAdmin) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-4xl">Acesso restrito</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sua conta não tem permissão de administrador.
          </p>
          <Button asChild variant="outlineGold" className="mt-6">
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const active = subscriptions.filter((item) => item.status === "ativa");
  const expiring = active.filter((item) => {
    const days = daysUntil(item.expires_at);
    return days !== null && days >= 0 && days <= 15;
  });
  const expired = subscriptions.filter((item) => {
    const days = daysUntil(item.expires_at);
    return days !== null && days < 0;
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="eyebrow">Administração</p>
        <h1 className="mt-2 text-5xl">Painel Girih</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Atualize mídias, serviços, barbeiros, planos, clientes, assinaturas, localização,
          horários, redes sociais e o link do panorama 360°.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <SummaryCard label="Assinaturas ativas" value={active.length} />
          <SummaryCard label="Vencem em 15 dias" value={expiring.length} />
          <SummaryCard label="Expiradas" value={expired.length} />
          <SummaryCard label="Planos publicados" value={plans.filter((p) => p.is_active).length} />
        </div>

        <Tabs defaultValue="conteudo" className="mt-10">
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
            <TabsTrigger value="barbeiros">Barbeiros</TabsTrigger>
            <TabsTrigger value="planos">Planos</TabsTrigger>
            <TabsTrigger value="midias">Mídias</TabsTrigger>
            <TabsTrigger value="assinaturas">Clientes e assinaturas</TabsTrigger>
          </TabsList>

          <TabsContent value="conteudo" className="mt-8 space-y-8">
            <SettingsPanel
              settingKey="brand"
              title="Marca e textos"
              value={(settings?.brand ?? {}) as unknown as Record<string, unknown>}
              fields={[
                { name: "name", label: "Nome", type: "text" },
                { name: "tagline", label: "Slogan", type: "text" },
                { name: "logo_url", label: "URL do logo", type: "text" },
                { name: "hero_title", label: "Título do hero", type: "text" },
                { name: "hero_subtitle", label: "Subtítulo do hero", type: "text" },
                { name: "hero_media_url", label: "Imagem/vídeo do hero (URL)", type: "text" },
                { name: "about_title", label: "Título institucional", type: "text" },
                { name: "about_text", label: "Texto institucional", type: "textarea" },
              ]}
            />
            <SettingsPanel
              settingKey="contact"
              title="Contato e redes sociais"
              value={(settings?.contact ?? {}) as unknown as Record<string, unknown>}
              fields={[
                { name: "whatsapp", label: "WhatsApp (somente números)", type: "text" },
                { name: "phone", label: "Telefone", type: "text" },
                { name: "email", label: "E-mail", type: "text" },
                { name: "instagram", label: "Instagram (URL)", type: "text" },
                { name: "facebook", label: "Facebook (URL)", type: "text" },
                { name: "tiktok", label: "TikTok (URL)", type: "text" },
                { name: "booking_url", label: "Link externo de agendamento", type: "text" },
              ]}
            />
            <SettingsPanel
              settingKey="location"
              title="Localização, mapa e panorama 360°"
              value={(settings?.location ?? {}) as unknown as Record<string, unknown>}
              fields={[
                { name: "address", label: "Endereço", type: "text" },
                { name: "city", label: "Cidade", type: "text" },
                { name: "state", label: "Estado", type: "text" },
                { name: "zip", label: "CEP", type: "text" },
                { name: "latitude", label: "Latitude", type: "text" },
                { name: "longitude", label: "Longitude", type: "text" },
                { name: "map_embed_url", label: "URL do mapa incorporado", type: "text" },
                { name: "directions_url", label: "URL da rota (Como chegar)", type: "text" },
                { name: "panorama_360_url", label: "URL do panorama 360°", type: "text" },
              ]}
            />
            <SettingsPanel
              settingKey="hours"
              title="Horários de atendimento"
              description="Horário informativo — confira com a equipe antes de divulgar."
              value={(settings?.hours ?? {}) as unknown as Record<string, unknown>}
              fields={[{ name: "note", label: "Observação interna", type: "text" }]}
              listFields={[
                {
                  name: "items",
                  label: "Dias e horários",
                  itemFields: [
                    { name: "day", label: "Dia" },
                    { name: "hours", label: "Horário" },
                  ],
                },
              ]}
            />
            <SettingsPanel
              settingKey="experience"
              title="A experiência Girih"
              value={(settings?.experience ?? {}) as unknown as Record<string, unknown>}
              fields={[
                { name: "title", label: "Título", type: "text" },
                { name: "subtitle", label: "Subtítulo", type: "text" },
              ]}
              listFields={[
                {
                  name: "items",
                  label: "Itens da experiência",
                  itemFields: [
                    { name: "icon", label: "Ícone (snowflake, music, sofa, coffee)" },
                    { name: "title", label: "Título" },
                    { name: "text", label: "Descrição", long: true },
                  ],
                },
              ]}
            />
            <SettingsPanel
              settingKey="faq"
              title="Perguntas frequentes"
              value={(settings?.faq ?? {}) as unknown as Record<string, unknown>}
              listFields={[
                {
                  name: "items",
                  label: "Perguntas e respostas",
                  itemFields: [
                    { name: "question", label: "Pergunta" },
                    { name: "answer", label: "Resposta", long: true },
                  ],
                },
              ]}
            />
            <SettingsPanel
              settingKey="notifications"
              title="Avisos de renovação e vencimento"
              description="Canais, prazos e mensagens configuráveis."
              value={(settings?.notifications ?? {}) as unknown as Record<string, unknown>}
              fields={[
                { name: "enabled", label: "Avisos ativos", type: "boolean" },
                { name: "channels", label: "Canais (separados por vírgula)", type: "list" },
                { name: "renewal_days_before", label: "Avisar X dias antes", type: "number" },
                { name: "expiry_days_after", label: "Cobrar X dias após vencer", type: "number" },
                { name: "renewal_message", label: "Mensagem de renovação", type: "textarea" },
                { name: "expiry_message", label: "Mensagem de vencimento", type: "textarea" },
              ]}
            />
            <SettingsPanel
              settingKey="payments"
              title="Pagamento online"
              description="Provedor ainda não definido."
              value={(settings?.payments ?? {}) as unknown as Record<string, unknown>}
              fields={[
                { name: "provider", label: "Provedor", type: "text" },
                { name: "enabled", label: "Pagamento online ativo", type: "boolean" },
                { name: "instructions", label: "Instruções ao cliente", type: "textarea" },
              ]}
            />
          </TabsContent>

          <TabsContent value="servicos" className="mt-8">
            <RecordEditor
              table="services"
              title="Serviços"
              rows={services as unknown as Record<string, unknown>[]}
              fields={[
                { name: "name", label: "Nome", type: "text" },
                { name: "description", label: "Descrição", type: "textarea" },
                { name: "duration_minutes", label: "Duração (min)", type: "number" },
                { name: "price_cents", label: "Preço (centavos)", type: "number" },
                { name: "price_label", label: "Rótulo de preço", type: "text" },
                { name: "image_url", label: "Foto (URL)", type: "text" },
                { name: "whatsapp_override", label: "WhatsApp específico", type: "text" },
                { name: "sort_order", label: "Ordem", type: "number" },
                { name: "is_active", label: "Ativo", type: "boolean" },
              ]}
            />
          </TabsContent>

          <TabsContent value="barbeiros" className="mt-8">
            <RecordEditor
              table="barbers"
              title="Barbeiros"
              description="Cada barbeiro tem nome, foto de perfil, especialidades, descrição e WhatsApp próprios. A galeria de trabalhos é cadastrada na aba Mídias, vinculando o ID do barbeiro."
              rows={barbers as unknown as Record<string, unknown>[]}
              fields={[
                { name: "name", label: "Nome", type: "text" },
                { name: "slug", label: "Slug (URL)", type: "text" },
                { name: "role_title", label: "Função", type: "text" },
                { name: "bio", label: "Apresentação", type: "textarea" },
                { name: "specialties", label: "Especialidades (vírgula)", type: "list" },
                { name: "photo_url", label: "Foto (URL)", type: "text" },
                { name: "whatsapp", label: "WhatsApp", type: "text" },
                { name: "instagram", label: "Instagram (URL)", type: "text" },
                { name: "sort_order", label: "Ordem", type: "number" },
                { name: "is_active", label: "Ativo", type: "boolean" },
              ]}
            />
          </TabsContent>

          <TabsContent value="planos" className="mt-8">
            <RecordEditor
              table="plans"
              title="Planos e assinaturas"
              rows={plans as unknown as Record<string, unknown>[]}
              fields={[
                { name: "name", label: "Nome", type: "text" },
                { name: "summary", label: "Resumo", type: "textarea" },
                { name: "price_cents", label: "Valor mensal (centavos)", type: "number" },
                { name: "price_label", label: "Rótulo de preço", type: "text" },
                { name: "billing_period", label: "Período", type: "text" },
                { name: "credits", label: "Créditos inclusos", type: "number" },
                { name: "benefits", label: "Benefícios (vírgula)", type: "list" },
                { name: "included_services", label: "Serviços inclusos (vírgula)", type: "list" },
                { name: "rules", label: "Regras", type: "textarea" },
                { name: "highlight", label: "Destaque", type: "boolean" },
                { name: "sort_order", label: "Ordem", type: "number" },
                { name: "is_active", label: "Ativo", type: "boolean" },
              ]}
            />
          </TabsContent>

          <TabsContent value="midias" className="mt-8">
            <RecordEditor
              table="media_items"
              title="Fotos e vídeos"
              description="Use a coleção 'galeria' para a home ou vincule ao barbeiro pelo ID."
              labelKey="title"
              rows={media as unknown as Record<string, unknown>[]}
              fields={[
                { name: "title", label: "Título", type: "text" },
                { name: "collection", label: "Coleção", type: "text" },
                { name: "media_type", label: "Tipo (image/video)", type: "text" },
                { name: "url", label: "URL", type: "text" },
                { name: "thumbnail_url", label: "Miniatura (URL)", type: "text" },
                { name: "barber_id", label: "ID do barbeiro (portfólio)", type: "text" },
                { name: "caption", label: "Legenda", type: "textarea" },
                { name: "sort_order", label: "Ordem", type: "number" },
                { name: "is_active", label: "Ativo", type: "boolean" },
              ]}
            />
          </TabsContent>

          <TabsContent value="assinaturas" className="mt-8 space-y-10">
            <RecordEditor
              table="subscriptions"
              title="Clientes e assinaturas"
              description="Controle status, validade e créditos utilizados."
              labelKey="customer_name"
              rows={subscriptions as unknown as Record<string, unknown>[]}
              fields={[
                { name: "customer_name", label: "Cliente", type: "text" },
                { name: "customer_phone", label: "Telefone", type: "text" },
                { name: "plan_id", label: "ID do plano", type: "text" },
                { name: "status", label: "Status (ativa, pendente, expirada)", type: "text" },
                { name: "started_at", label: "Início (AAAA-MM-DD)", type: "text" },
                { name: "expires_at", label: "Validade (AAAA-MM-DD)", type: "text" },
                { name: "credits_total", label: "Créditos totais", type: "number" },
                { name: "credits_used", label: "Créditos usados", type: "number" },
                { name: "notes", label: "Observações", type: "textarea" },
              ]}
            />

            <div>
              <h3 className="text-2xl">Próximos vencimentos</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {expiring.length === 0 && (
                  <li className="text-muted-foreground">Nenhum vencimento nos próximos 15 dias.</li>
                )}
                {expiring.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between rounded-lg border border-border bg-surface/40 px-4 py-3"
                  >
                    <span>{item.customer_name}</span>
                    <span className="text-primary">{formatDate(item.expires_at)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl">Planos e valores</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {plans.map((plan) => (
                  <li key={plan.id} className="flex justify-between">
                    <span>{plan.name}</span>
                    <span>{formatPrice(plan.price_cents, plan.price_label) ?? "—"}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface/40 p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-4xl text-primary">{value}</p>
    </div>
  );
}
