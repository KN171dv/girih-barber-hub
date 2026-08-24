import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { RecordEditor } from "@/components/admin/RecordEditor";
import { defaultSettings, useMedia, usePlans, useSiteSettings } from "@/lib/site-content";

export const Route = createFileRoute("/admin/conteudo")({
  component: ContentAdminPage,
});

function ContentAdminPage() {
  const { data: settings = defaultSettings } = useSiteSettings();
  const { data: gallery = [] } = useMedia("galeria");
  const { data: plans = [] } = usePlans(false);

  return (
    <AdminShell title="Conteúdo do site" subtitle="Textos, contato, localização, galeria e planos.">
      <div className="space-y-8">
        <SettingsPanel
          settingKey="brand"
          title="Marca e hero"
          description="Nome, logo, título e textos da página inicial."
          value={settings.brand as unknown as Record<string, unknown>}
          fields={[
            { name: "name", label: "Nome", type: "text" },
            { name: "tagline", label: "Slogan", type: "text" },
            { name: "logo_url", label: "Logo (URL)", type: "text" },
            { name: "hero_title", label: "Título do hero", type: "text" },
            { name: "hero_media_url", label: "Imagem/vídeo do hero (URL)", type: "text" },
            { name: "hero_subtitle", label: "Subtítulo do hero", type: "textarea" },
            { name: "about_title", label: "Título — A Barbearia", type: "text" },
            { name: "about_text", label: "Texto — A Barbearia", type: "textarea" },
          ]}
        />

        <SettingsPanel
          settingKey="contact"
          title="Contato e redes"
          value={settings.contact as unknown as Record<string, unknown>}
          fields={[
            { name: "whatsapp", label: "WhatsApp", type: "text" },
            { name: "phone", label: "Telefone", type: "text" },
            { name: "email", label: "E-mail", type: "text" },
            { name: "instagram", label: "Instagram", type: "text" },
            { name: "facebook", label: "Facebook", type: "text" },
            { name: "tiktok", label: "TikTok", type: "text" },
            { name: "booking_url", label: "Link externo de agendamento", type: "text" },
          ]}
        />

        <SettingsPanel
          settingKey="location"
          title="Localização"
          value={settings.location as unknown as Record<string, unknown>}
          fields={[
            { name: "address", label: "Endereço", type: "text" },
            { name: "city", label: "Cidade", type: "text" },
            { name: "state", label: "Estado", type: "text" },
            { name: "zip", label: "CEP", type: "text" },
            { name: "latitude", label: "Latitude", type: "text" },
            { name: "longitude", label: "Longitude", type: "text" },
            { name: "map_embed_url", label: "Mapa (embed)", type: "textarea" },
            { name: "directions_url", label: "Link de rota", type: "textarea" },
            { name: "panorama_360_url", label: "Panorama 360° (embed)", type: "textarea" },
          ]}
        />

        <SettingsPanel
          settingKey="experience"
          title="A experiência Gireh"
          value={settings.experience as unknown as Record<string, unknown>}
          fields={[
            { name: "title", label: "Título", type: "text" },
            { name: "subtitle", label: "Subtítulo", type: "textarea" },
          ]}
          listFields={[
            {
              name: "items",
              label: "Itens",
              itemFields: [
                { name: "icon", label: "Ícone" },
                { name: "title", label: "Título" },
                { name: "text", label: "Texto", long: true },
              ],
            },
          ]}
        />

        <SettingsPanel
          settingKey="faq"
          title="Perguntas frequentes"
          value={settings.faq as unknown as Record<string, unknown>}
          listFields={[
            {
              name: "items",
              label: "Perguntas",
              itemFields: [
                { name: "question", label: "Pergunta" },
                { name: "answer", label: "Resposta", long: true },
              ],
            },
          ]}
        />

        <RecordEditor
          table="media_items"
          title="Galeria"
          labelKey="title"
          description="Fotos e vídeos exibidos na galeria do site."
          rows={gallery}
          fields={[
            { name: "title", label: "Título", type: "text" },
            { name: "collection", label: "Coleção", type: "text", help: "Use: galeria" },
            { name: "url", label: "Imagem/vídeo (URL)", type: "text" },
            { name: "thumbnail_url", label: "Miniatura (URL)", type: "text" },
            { name: "media_type", label: "Tipo", type: "text", help: "image ou video" },
            { name: "sort_order", label: "Ordem", type: "number" },
            { name: "is_active", label: "Ativo", type: "boolean" },
            { name: "caption", label: "Legenda", type: "textarea" },
          ]}
        />

        <RecordEditor
          table="plans"
          title="Planos de assinatura"
          description="Planos exibidos na página de planos."
          rows={plans}
          fields={[
            { name: "name", label: "Nome", type: "text" },
            { name: "summary", label: "Resumo", type: "text" },
            { name: "price_cents", label: "Preço (centavos)", type: "number" },
            { name: "price_label", label: "Preço (texto)", type: "text" },
            { name: "billing_period", label: "Periodicidade", type: "text" },
            { name: "credits", label: "Créditos", type: "number" },
            { name: "benefits", label: "Benefícios", type: "list" },
            { name: "included_services", label: "Serviços inclusos", type: "list" },
            { name: "highlight", label: "Destaque", type: "boolean" },
            { name: "sort_order", label: "Ordem", type: "number" },
            { name: "is_active", label: "Ativo", type: "boolean" },
            { name: "rules", label: "Regras", type: "textarea" },
          ]}
        />
      </div>
    </AdminShell>
  );
}
