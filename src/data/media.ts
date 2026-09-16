import type { MediaItem } from "@/lib/site-content";

/**
 * Mídia do site (galeria, antes/depois, portfólio dos barbeiros) — antes
 * editada pelo painel administrativo (agora removido).
 *
 * A coleção "galeria" NÃO foi migrada 1:1 do banco: lá ainda estavam as 7
 * fotos de espaço-reservado do Lovable Cloud. Nas fotos reais da barbearia
 * enviadas para /public/upload/ (pedido em turno anterior), já tínhamos
 * decidido usar essas 5 fotos na galeria — então é isso que vira o
 * conteúdo estático definitivo aqui, no lugar dos placeholders antigos.
 *
 * Não existem itens em "portfolio" (trabalhos por barbeiro) nem em
 * "antes_depois" ainda — os arrays ficam vazios até termos fotos reais
 * para essas coleções.
 */
export const mediaItems: MediaItem[] = [
  {
    id: "galeria-fachada",
    collection: "galeria",
    barber_id: null,
    media_type: "image",
    url: "/upload/shop-facade.png",
    thumbnail_url: "",
    title: "Fachada",
    caption: "",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "galeria-salao",
    collection: "galeria",
    barber_id: null,
    media_type: "image",
    url: "/upload/shop-salon-wide.png",
    thumbnail_url: "",
    title: "Salão",
    caption: "",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "galeria-cadeiras",
    collection: "galeria",
    barber_id: null,
    media_type: "image",
    url: "/upload/shop-salon-chairs.png",
    thumbnail_url: "",
    title: "Cadeiras",
    caption: "",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "galeria-recepcao",
    collection: "galeria",
    barber_id: null,
    media_type: "image",
    url: "/upload/shop-waiting-area.png",
    thumbnail_url: "",
    title: "Recepção",
    caption: "",
    sort_order: 4,
    is_active: true,
  },
  {
    id: "galeria-bancada",
    collection: "galeria",
    barber_id: null,
    media_type: "image",
    url: "/upload/shop-bench-tools.png",
    thumbnail_url: "",
    title: "Bancada",
    caption: "",
    sort_order: 5,
    is_active: true,
  },
];
