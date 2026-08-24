import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordEditor } from "@/components/admin/RecordEditor";
import { useServices } from "@/lib/site-content";

export const Route = createFileRoute("/admin/servicos")({
  component: ServicesAdminPage,
});

function ServicesAdminPage() {
  const { data: services = [] } = useServices(false);

  return (
    <AdminShell
      title="Serviços"
      subtitle="Cadastro de serviços, duração, preço e ordem de exibição."
    >
      <RecordEditor
        table="services"
        title="Catálogo de serviços"
        description="Tudo o que for salvo aqui aparece no site e na agenda."
        rows={services}
        fields={[
          { name: "name", label: "Nome", type: "text" },
          { name: "duration_minutes", label: "Duração (minutos)", type: "number" },
          { name: "price_cents", label: "Preço (centavos)", type: "number", help: "Ex.: 5000 = R$ 50,00" },
          { name: "price_label", label: "Preço (texto alternativo)", type: "text" },
          { name: "image_url", label: "Foto (URL)", type: "text" },
          { name: "whatsapp_override", label: "WhatsApp específico", type: "text" },
          { name: "highlight", label: "Destaque visual", type: "boolean" },
          { name: "highlight_label", label: "Selo do destaque", type: "text", help: "Ex.: COMPLETO" },
          { name: "sort_order", label: "Ordem", type: "number" },
          { name: "is_active", label: "Ativo", type: "boolean" },
          { name: "description", label: "Descrição", type: "textarea" },
        ]}
      />
    </AdminShell>
  );
}
