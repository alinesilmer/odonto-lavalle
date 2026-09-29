import { useState } from "react";
import type { ContentInput, ContentKind, ContentMap } from "@odonto/shared";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import Alert from "@/components/UI/Alert/Alert";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import Button from "@/components/UI/Button/Button";
import { useConfirm } from "@/components/UI/Confirm/confirmContext";
import IconButton from "@/components/UI/IconButton/IconButton";
import ItemList from "@/components/UI/ItemList/ItemList";
import Panel from "@/components/UI/Panel/Panel";
import Tabs from "@/components/UI/Tabs/Tabs";
import { CONTENT_CONFIG, CONTENT_TABS } from "./contentConfig";
import ContentFormModal from "./ContentFormModal";
import PriceSettings from "./PriceSettings";
import { useContentAdmin } from "./useContentAdmin";
import styles from "./AdminContent.module.scss";

type Item = ContentMap[ContentKind];
/** `item` undefined = creating a new one. */
type Editing = { item?: Item } | null;

const ICON = { size: 16, strokeWidth: 1.8, "aria-hidden": true } as const;

/** Dashboard CMS: FAQ, services, obras sociales and the consultation price. */
const AdminContent = () => {
  const [kind, setKind] = useState<ContentKind>("faqs");
  const [editing, setEditing] = useState<Editing>(null);
  const content = useContentAdmin(kind);
  const confirm = useConfirm();
  // Each kind has its own typed config; the screen handles them uniformly.
  const config = CONTENT_CONFIG[kind] as unknown as (typeof CONTENT_CONFIG)["faqs"];
  const asFaq = (item: Item) => item as ContentMap["faqs"];

  const openEditor = (next: Editing) => {
    content.setActionError(null);
    setEditing(next);
  };

  const submit = async (values: Record<string, string | number>) => {
    const { id: _id, ...input } = { ...config.empty, ...values } as ContentMap["faqs"];
    const ok = await content.save(input as ContentInput<typeof kind>, editing?.item?.id);
    if (ok) setEditing(null);
  };

  const remove = async (item: Item) => {
    const accepted = await confirm({
      title: `¿Eliminar "${config.title(asFaq(item))}"?`,
      message: "Se va a quitar del sitio y no se puede recuperar.",
      confirmLabel: "Eliminar",
      tone: "danger",
    });
    if (accepted) void content.remove(item.id);
  };

  const importDefaults = async () => {
    const accepted = await confirm({
      title: "¿Cargar el contenido actual?",
      message: `Copiamos lo que hoy se ve en el sitio en ${config.label.toLowerCase()} para que puedas editarlo desde acá.`,
      confirmLabel: "Cargar",
    });
    if (accepted) void content.importDefaults();
  };

  const last = content.items.length - 1;

  return (
    <section className={styles.section}>
      <PriceSettings />

      <Panel
        eyebrow="Sitio público"
        title={config.label}
        action={
          <Button size="small" onClick={() => openEditor({})} icon={<Plus {...ICON} />}>
            Agregar {config.noun}
          </Button>
        }
      >
        <Tabs items={CONTENT_TABS} active={kind} onChange={setKind} label="Tipo de contenido" variant="underline" />
        {content.actionError && !editing ? <Alert>{content.actionError}</Alert> : null}

        <AsyncBoundary loading={content.loading} error={content.error} onRetry={content.reload}>
          {content.items.length === 0 ? (
            <div className={styles.empty}>
              <p>
                Todavía no cargaste {config.label.toLowerCase()} desde el panel, así que el sitio muestra el contenido
                original. Podés copiarlo acá para editarlo o empezar de cero.
              </p>
              <Button variant="secondary" size="small" loading={content.saving} onClick={() => void importDefaults()}>
                Cargar el contenido actual
              </Button>
            </div>
          ) : (
            <ItemList
              items={content.items.map((item, index) => ({
                key: item.id,
                leading: <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>,
                title: config.title(asFaq(item)),
                meta: config.meta(asFaq(item)),
                trailing: (
                  <span className={styles.actions}>
                    {index > 0 ? (
                      <IconButton label="Subir" onClick={() => content.move(index, -1)}>
                        <ArrowUp {...ICON} />
                      </IconButton>
                    ) : null}
                    {index < last ? (
                      <IconButton label="Bajar" onClick={() => content.move(index, 1)}>
                        <ArrowDown {...ICON} />
                      </IconButton>
                    ) : null}
                    <IconButton label="Editar" onClick={() => openEditor({ item })}>
                      <Pencil {...ICON} />
                    </IconButton>
                    <IconButton label="Eliminar" tone="danger" onClick={() => void remove(item)}>
                      <Trash2 {...ICON} />
                    </IconButton>
                  </span>
                ),
              }))}
            />
          )}
        </AsyncBoundary>
      </Panel>

      {editing ? (
        <ContentFormModal
          key={editing.item?.id ?? `new-${kind}`}
          open
          onClose={() => setEditing(null)}
          title={editing.item ? `Editar ${config.noun}` : config.newTitle}
          fields={config.fields}
          initial={{ ...config.empty, ...(editing.item ?? {}) }}
          busy={content.saving}
          error={content.actionError}
          onSubmit={(values) => void submit(values)}
        />
      ) : null}
    </section>
  );
};

export default AdminContent;
