import type { Barber } from "@/lib/site-content";

/**
 * Equipe — migrado 1:1 da tabela `barbers` (Supabase) em 2026-09-16, antes
 * editada pelo painel administrativo (agora removido). Para adicionar,
 * remover ou reordenar barbeiros, edite este arquivo.
 *
 * `photo_url` foi atualizado para as fotos reais enviadas em
 * /public/upload/ (o registro no banco ainda aponta para o placeholder
 * antigo do Lovable Cloud — não foi alterado lá, só aqui no estático).
 */
export const barbers: Barber[] = [
  {
    id: "9cdf892a-f447-4b93-83d7-6ac322cb93f9",
    slug: "yuri",
    name: "Yuri",
    role_title: "Barbeiro",
    bio: "Precisão, técnica e atenção aos detalhes para entregar um corte que combine com o seu estilo.",
    specialties: [],
    photo_url: "/upload/Yuri.png",
    whatsapp: "",
    instagram: "",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "3e25f299-ffcb-4341-aa15-eaf79c89bdaf",
    slug: "ithalo",
    name: "Ithalo",
    role_title: "Barbeiro",
    bio: "Olhar apurado para acabamentos limpos e cortes atuais, sempre respeitando a personalidade de cada cliente.",
    specialties: [],
    photo_url: "/upload/Ithalo.png",
    whatsapp: "",
    instagram: "",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "e1b1de13-11c7-4490-8867-1b88c5ddc0d8",
    slug: "yago",
    name: "Yago",
    role_title: "Barbeiro",
    bio: "Criatividade e domínio de estilo para transformar referências em cortes marcantes e bem executados.",
    specialties: [],
    photo_url: "/upload/Yago.png",
    whatsapp: "",
    instagram: "",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "d1abdeed-4fbc-4232-87e7-68ba7e27d9fe",
    slug: "carlos",
    name: "Carlos",
    role_title: "Barbeiro",
    bio: "Experiência e cuidado em cada etapa, com foco em conforto, confiança e um resultado impecável.",
    specialties: [],
    photo_url: "/upload/Carlos.png",
    whatsapp: "",
    instagram: "",
    sort_order: 4,
    is_active: true,
  },
];
