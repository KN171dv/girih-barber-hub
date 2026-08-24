import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordEditor } from "@/components/admin/RecordEditor";
import { useBarbers, useMedia } from "@/lib/site-content";

export const Route = createFileRoute("/admin/equipe")({
  component: TeamAdminPage,
});

function TeamAdminPage() {
  const { data: barbers = [] } = useBarbers(false);
  const { data: portfolio = [] } = useMedia("portfolio");

  return (
    <AdminShell title="Equipe" subtitle="Barbeiros, especialidades, contato e portfólio.">
      <RecordEditor
        table="barbers"
        title="Barbeiros"
        description="Cada barbeiro tem foto, descrição, especialidades e WhatsApp próprios."
        rows={barbers}
        fields={[
          { name: "name", label: "Nome", type: "text" },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Ex.: yuri" },
          { name: "role_title", label: "Título", type: "text" },
          { name: "photo_url", label: "Foto de perfil (URL)", type: "text" },
          { name: "whatsapp", label: "WhatsApp", type: "text", help: "Somente números, com DDD" },
          { name: "instagram", label: "Instagram", type: "text" },
          { name: "specialties", label: "Especialidades", type: "list", help: "Separe por vírgulas" },
          { name: "sort_order", label: "Ordem", type: "number" },
          { name: "is_active", label: "Ativo", type: "boolean" },
          { name: "bio", label: "Descrição", type: "textarea" },
        ]}
      />

      <div className="mt-12">
        <RecordEditor
          table="media_items"
          title="Portfólio de trabalhos"
          description="Adicione imagens vinculando ao barbeiro pelo campo de identificação."
          labelKey="title"
          rows={portfolio}
          fields={[
            { name: "title", label: "Título", type: "text" },
            { name: "collection", label: "Coleção", type: "text", help: "Use: portfolio" },
            { name: "barber_id", label: "ID do barbeiro", type: "text" },
            { name: "url", label: "Imagem/vídeo (URL)", type: "text" },
            { name: "thumbnail_url", label: "Miniatura (URL)", type: "text" },
            { name: "media_type", label: "Tipo", type: "text", help: "image ou video" },
            { name: "sort_order", label: "Ordem", type: "number" },
            { name: "is_active", label: "Ativo", type: "boolean" },
            { name: "caption", label: "Legenda", type: "textarea" },
          ]}
        />
        <div className="mt-4 rounded-lg border border-border bg-surface/40 p-4 text-xs text-muted-foreground">
          <p className="mb-2">Identificadores dos barbeiros (copie para o campo acima):</p>
          <ul className="space-y-1">
            {barbers.map((barber) => (
              <li key={barber.id}>
                <span className="text-foreground">{barber.name}</span> — {barber.id}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
