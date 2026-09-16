import type { SiteSettings } from "@/lib/site-content";

/**
 * Conteúdo estático do site — antes vinha da tabela `site_settings` (Supabase),
 * editada pelo painel administrativo. O painel foi removido; a partir de agora
 * esses valores só mudam por edição direta deste arquivo (commit no GitHub).
 *
 * Migrado 1:1 dos valores que estavam salvos no banco em 2026-09-16.
 */
export const siteSettings: SiteSettings = {
  brand: {
    name: "Gireh Barber Shop",
    tagline: "Barbearia em Rio das Ostras — RJ",
    // Logo real (fundo preto removido, PNG com transparência) — usada no
    // header, no rodapé e como selo na seção de CTA final.
    logo_url: "/upload/logo.png",
    hero_title: "SEU ESTILO. SUA IDENTIDADE.",
    hero_subtitle:
      "Mais do que um corte. Uma experiência feita para quem valoriza estilo, presença e cuidado.",
    // Não é mais usado pelo hero (que agora sempre usa /upload/hero-video.mp4),
    // mantido só pelo valor histórico.
    hero_media_url: "/__l5e/assets-v1/f5716d88-2e85-41de-8470-d7e809ca9e0c/image-7.png",
    about_title: "A Barbearia",
    about_text:
      "Na Gireh Barber, cada detalhe importa. Do ambiente ao acabamento final, nossa proposta é proporcionar uma experiência completa para quem busca cuidar do visual com estilo, personalidade e qualidade.",
  },
  contact: {
    whatsapp: "5522998367510",
    phone: "(22) 99836-7510",
    email: "",
    instagram: "https://www.instagram.com/girehbarber/",
    facebook: "",
    tiktok: "",
    booking_url: "",
  },
  location: {
    address: "Alameda Campomar, 49 — Jardim Campomar",
    city: "Rio das Ostras",
    state: "RJ",
    zip: "28890-281",
    latitude: "-22.5573108",
    longitude: "-41.9796738",
    map_embed_url: "https://www.google.com/maps?q=-22.5573108,-41.9796738&z=18&output=embed",
    directions_url: "https://www.google.com/maps/dir/?api=1&destination=-22.5573108,-41.9796738",
    panorama_360_url:
      "https://www.google.com/maps?q=&layer=c&cbll=-22.5573108,-41.9796738&hl=pt-BR&output=svembed",
  },
  hours: {
    note: "Horário informativo — confira e ajuste com a equipe antes de divulgar.",
    items: [
      { day: "Segunda a sexta", hours: "09h às 20h" },
      { day: "Sábado", hours: "09h às 20h" },
      { day: "Domingo", hours: "Fechado" },
    ],
  },
  experience: {
    title: "A EXPERIÊNCIA GIREH",
    subtitle:
      "Um espaço pensado para você desacelerar, cuidar da aparência e sair daqui com a sensação de estar no seu melhor.",
    items: [
      {
        icon: "sparkles",
        title: "ESTILO",
        text: "Cortes pensados para valorizar seus traços e o visual que combina com você.",
      },
      {
        icon: "sofa",
        title: "AMBIENTE",
        text: "Um espaço confortável e climatizado, feito para você aguardar e relaxar.",
      },
      {
        icon: "music",
        title: "EXPERIÊNCIA",
        text: "Atendimento com calma, atenção e som ambiente do começo ao fim.",
      },
      {
        icon: "snowflake",
        title: "ACABAMENTO",
        text: "Cuidado nos detalhes finais, que fazem toda a diferença no resultado.",
      },
    ],
  },
  faq: {
    items: [
      {
        question: "Como faço para agendar um horário?",
        answer:
          "O agendamento é feito pelo WhatsApp. Use os botões de agendamento do site para falar com a barbearia ou diretamente com o barbeiro de sua preferência.",
      },
      {
        question: "Posso escolher com qual barbeiro quero ser atendido?",
        answer:
          "Sim. Na página Nossos Barbeiros você conhece cada profissional e pode iniciar a conversa já indicando o nome dele e o serviço desejado.",
      },
      {
        question: "Preciso agendar ou posso ir sem horário marcado?",
        answer:
          "O agendamento é recomendado para garantir o melhor horário para você. Consulte a disponibilidade pelo WhatsApp.",
      },
      {
        question: "Como funcionam os planos e assinaturas?",
        answer:
          "Cada plano reúne serviços e créditos mensais com regras próprias, descritas no cartão do plano. Após escolher, a equipe confirma os detalhes com você.",
      },
      {
        question: "Quais são as formas de pagamento?",
        answer:
          "As formas de pagamento aceitas são informadas no atendimento. O pagamento online das assinaturas será habilitado em breve.",
      },
      {
        question: "Onde fica a barbearia?",
        answer:
          "Estamos na Alameda Campomar, 49, bairro Cidade Praiana, em Rio das Ostras (RJ). Use o botão Como chegar para traçar a rota.",
      },
    ],
  },
  notifications: {
    enabled: false,
    channels: [],
    renewal_days_before: 0,
    expiry_days_after: 0,
    renewal_message: "",
    expiry_message: "",
  },
  payments: {
    provider: "",
    enabled: false,
    instructions: "",
  },
};
