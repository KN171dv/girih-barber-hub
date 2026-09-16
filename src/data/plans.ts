import type { Plan } from "@/lib/site-content";

/**
 * Planos & assinaturas — a tabela `plans` (Supabase) estava vazia em
 * 2026-09-16 (nenhum plano foi cadastrado no painel antes de ele ser
 * removido). Por isso este array começa vazio — não inventamos planos.
 *
 * As seções de planos no site (home e /planos) ficam ocultas automaticamente
 * enquanto este array estiver vazio. Para publicar um plano, adicione um
 * objeto aqui seguindo o formato do tipo `Plan`.
 */
export const plans: Plan[] = [];
