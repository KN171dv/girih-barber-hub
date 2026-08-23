import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSaveSetting } from "@/lib/admin";

type SimpleField = { name: string; label: string; type: "text" | "textarea" | "number" | "boolean" | "list" };
type ListField = { name: string; label: string; itemFields: { name: string; label: string; long?: boolean }[] };

export function SettingsPanel({
  settingKey,
  title,
  description,
  value,
  fields = [],
  listFields = [],
}: {
  settingKey: string;
  title: string;
  description?: string;
  value: Record<string, unknown>;
  fields?: SimpleField[];
  listFields?: ListField[];
}) {
  const [draft, setDraft] = useState<Record<string, unknown>>(value);
  const save = useSaveSetting();

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function set(name: string, raw: unknown) {
    setDraft((current) => ({ ...current, [name]: raw }));
  }

  function listOf(name: string) {
    const list = draft[name];
    return Array.isArray(list) ? (list as Record<string, string>[]) : [];
  }

  return (
    <form
      className="space-y-6 rounded-xl border border-border bg-surface/40 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        save.mutate({ key: settingKey, value: draft });
      }}
    >
      <div>
        <h3 className="text-2xl">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const current = draft[field.name];
          const id = `${settingKey}-${field.name}`;
          return (
            <div
              key={field.name}
              className={field.type === "textarea" ? "sm:col-span-2 space-y-2" : "space-y-2"}
            >
              <Label htmlFor={id}>{field.label}</Label>
              {field.type === "boolean" ? (
                <div className="pt-1">
                  <Switch
                    id={id}
                    checked={Boolean(current)}
                    onCheckedChange={(checked) => set(field.name, checked)}
                  />
                </div>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={id}
                  rows={4}
                  value={String(current ?? "")}
                  onChange={(event) => set(field.name, event.target.value)}
                />
              ) : (
                <Input
                  id={id}
                  type={field.type === "number" ? "number" : "text"}
                  value={
                    field.type === "list"
                      ? (Array.isArray(current) ? current.join(", ") : "")
                      : String(current ?? "")
                  }
                  onChange={(event) => {
                    const raw = event.target.value;
                    if (field.type === "number") set(field.name, raw === "" ? 0 : Number(raw));
                    else if (field.type === "list")
                      set(
                        field.name,
                        raw.split(",").map((item) => item.trim()).filter(Boolean),
                      );
                    else set(field.name, raw);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {listFields.map((listField) => (
        <div key={listField.name} className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>{listField.label}</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                set(listField.name, [
                  ...listOf(listField.name),
                  Object.fromEntries(listField.itemFields.map((f) => [f.name, ""])),
                ])
              }
            >
              <Plus className="h-4 w-4" aria-hidden="true" /> Adicionar
            </Button>
          </div>
          {listOf(listField.name).map((item, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-lg border border-border/70 bg-background/40 p-4 sm:grid-cols-[1fr_auto]"
            >
              <div className="grid gap-3">
                {listField.itemFields.map((itemField) =>
                  itemField.long ? (
                    <Textarea
                      key={itemField.name}
                      rows={3}
                      placeholder={itemField.label}
                      value={item[itemField.name] ?? ""}
                      onChange={(event) => {
                        const list = [...listOf(listField.name)];
                        list[index] = { ...item, [itemField.name]: event.target.value };
                        set(listField.name, list);
                      }}
                    />
                  ) : (
                    <Input
                      key={itemField.name}
                      placeholder={itemField.label}
                      value={item[itemField.name] ?? ""}
                      onChange={(event) => {
                        const list = [...listOf(listField.name)];
                        list[index] = { ...item, [itemField.name]: event.target.value };
                        set(listField.name, list);
                      }}
                    />
                  ),
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                aria-label="Remover item"
                onClick={() =>
                  set(
                    listField.name,
                    listOf(listField.name).filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      ))}

      <Button type="submit" variant="gold" disabled={save.isPending}>
        <Save aria-hidden="true" /> Salvar
      </Button>
    </form>
  );
}
