import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useDeleteRecord, useSaveRecord, type AdminTable } from "@/lib/admin";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "list";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
};

type Row = Record<string, unknown>;

function emptyRecord(fields: FieldDef[]): Row {
  const record: Row = {};
  for (const field of fields) {
    record[field.name] =
      field.type === "boolean" ? true : field.type === "list" ? [] : field.type === "number" ? null : "";
  }
  return record;
}

function toInputValue(value: unknown, type: FieldType) {
  if (type === "list") return Array.isArray(value) ? value.join(", ") : "";
  if (value === null || value === undefined) return "";
  return String(value);
}

export function RecordEditor({
  table,
  fields,
  rows,
  title,
  description,
  labelKey = "name",
}: {
  table: AdminTable;
  fields: FieldDef[];
  rows: Row[];
  title: string;
  description?: string;
  labelKey?: string;
}) {
  const [editing, setEditing] = useState<Row | null>(null);
  const save = useSaveRecord(table);
  const remove = useDeleteRecord(table);

  function update(name: string, raw: string | boolean, type: FieldType) {
    setEditing((current) => {
      if (!current) return current;
      let value: unknown = raw;
      if (type === "number") value = raw === "" ? null : Number(raw);
      if (type === "list")
        value = String(raw)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      return { ...current, [name]: value };
    });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button variant="gold" onClick={() => setEditing(emptyRecord(fields))}>
          <Plus aria-hidden="true" /> Novo
        </Button>
      </div>

      <div className="grid gap-3">
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum registro cadastrado ainda.</p>
        )}
        {rows.map((row) => (
          <div
            key={String(row["id"])}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface/40 px-4 py-3"
          >
            <span className="text-sm text-foreground">
              {String(row[labelKey] || "(sem nome)")}
              {row["is_active"] === false && (
                <span className="ml-2 text-xs text-muted-foreground">(inativo)</span>
              )}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing({ ...row })}>
                Editar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                aria-label="Remover"
                onClick={() => remove.mutate(String(row["id"]))}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <form
          className="space-y-4 rounded-xl border border-primary/30 bg-surface/60 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate(editing, { onSuccess: () => setEditing(null) });
          }}
        >
          <p className="eyebrow">{editing["id"] ? "Editar registro" : "Novo registro"}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "sm:col-span-2 space-y-2" : "space-y-2"}
              >
                <Label htmlFor={`${table}-${field.name}`}>{field.label}</Label>
                {field.type === "boolean" ? (
                  <div className="pt-1">
                    <Switch
                      id={`${table}-${field.name}`}
                      checked={Boolean(editing[field.name])}
                      onCheckedChange={(checked) => update(field.name, checked, field.type)}
                    />
                  </div>
                ) : field.type === "textarea" ? (
                  <Textarea
                    id={`${table}-${field.name}`}
                    rows={4}
                    value={toInputValue(editing[field.name], field.type)}
                    onChange={(event) => update(field.name, event.target.value, field.type)}
                  />
                ) : (
                  <Input
                    id={`${table}-${field.name}`}
                    type={field.type === "number" ? "number" : "text"}
                    value={toInputValue(editing[field.name], field.type)}
                    onChange={(event) => update(field.name, event.target.value, field.type)}
                  />
                )}
                {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="gold" disabled={save.isPending}>
              <Save aria-hidden="true" /> Salvar
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
