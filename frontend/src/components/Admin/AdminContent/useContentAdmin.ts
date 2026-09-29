import { useCallback, useMemo } from "react";
import { DEFAULT_CONTENT, type ContentInput, type ContentKind } from "@odonto/shared";
import { useApi } from "@/hooks/useApi";
import { useWriteAction } from "@/hooks/useWriteAction";
import { contentApi } from "@/services";

/** List + create/update/delete/reorder for one kind of site content. */
export function useContentAdmin<K extends ContentKind>(kind: K) {
  // Each response is tagged with its kind: right after switching tabs the
  // previous tab's items are still in `data`, and rendering FAQs with the
  // services layout (or vice versa) used to crash the screen.
  const { data, loading, error, reload } = useApi(
    () => contentApi.list(kind).then((res) => ({ kind, items: res.items })),
    [kind],
  );
  const { saving, actionError, setActionError, runWrite } = useWriteAction(reload);
  const current = data?.kind === kind ? data : null;

  const items = useMemo(
    () => [...(current?.items ?? [])].sort((a, b) => a.order - b.order),
    [current],
  );

  const save = useCallback(
    (input: ContentInput<K>, id?: string) =>
      runWrite(
        () =>
          id
            ? contentApi.update(kind, id, input)
            : contentApi.create(kind, { ...input, order: items.length }),
        "No pudimos guardar los cambios",
      ),
    [kind, items.length, runWrite],
  );

  const remove = useCallback(
    (id: string) => runWrite(() => contentApi.remove(kind, id), "No pudimos eliminarlo"),
    [kind, runWrite],
  );

  /** Swaps an item with its neighbour and renumbers both. */
  const move = useCallback(
    (index: number, step: -1 | 1) => {
      const other = items[index + step];
      const item = items[index];
      if (!item || !other) return;
      void runWrite(
        () =>
          Promise.all([
            contentApi.update(kind, item.id, { order: index + step } as Partial<ContentInput<K>>),
            contentApi.update(kind, other.id, { order: index } as Partial<ContentInput<K>>),
          ]),
        "No pudimos cambiar el orden",
      );
    },
    [items, kind, runWrite],
  );

  /** Copies the site's original content into the database, to edit from there. */
  const importDefaults = useCallback(
    () =>
      runWrite(async () => {
        // One at a time, so the saved order matches the original.
        for (const item of DEFAULT_CONTENT[kind] as ContentInput<K>[]) {
          await contentApi.create(kind, item);
        }
      }, "No pudimos cargar el contenido actual"),
    [kind, runWrite],
  );

  return { items, loading: !error && (loading || !current), error, reload, saving, actionError, setActionError, save, remove, move, importDefaults };
}
