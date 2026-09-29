import { CONTENT_KINDS, DEFAULT_CONTENT, type ContentKind, type SiteSettingsDto } from "@odonto/shared";

/**
 * Demo answers for /content/:kind and /settings. Content starts with the same
 * FAQ, services and obras sociales the real database was loaded with, so the
 * dashboard shows what the public site shows. In-memory only, like the rest of the demo.
 */

type Row = { id: string; order: number } & Record<string, unknown>;

const seed = (kind: ContentKind): Row[] =>
  DEFAULT_CONTENT[kind].map((item, i) => ({ ...item, id: `demo-${kind}-${i}` }) as Row);

const content: Record<ContentKind, Row[]> = { faqs: seed("faqs"), services: seed("services"), insurances: seed("insurances") };
let settings: SiteSettingsDto = { consultationPrice: 0 };

const isKind = (value: string): value is ContentKind => (CONTENT_KINDS as readonly string[]).includes(value);

/** The response for a content/settings request, or `NOT_MINE` for any other route. */
export const NOT_MINE = Symbol("not-mine");

export function handleDemoContent(method: string, route: string, body: unknown): unknown {
  if (route === "/settings") {
    if (method === "PUT") settings = { ...settings, ...(body as Partial<SiteSettingsDto>) };
    return settings;
  }

  const match = route.match(/^\/content\/([^/]+)(?:\/([^/]+))?$/);
  if (!match || !isKind(match[1])) return NOT_MINE;
  const [, kind, id] = match as unknown as [string, ContentKind, string | undefined];

  if (!id) {
    if (method === "POST") {
      const created = { order: 0, ...(body as object), id: `demo-${kind}-${Date.now()}-${content[kind].length}` } as Row;
      content[kind] = [...content[kind], created];
      return created;
    }
    return { items: [...content[kind]].sort((a, b) => a.order - b.order) };
  }

  if (method === "DELETE") {
    content[kind] = content[kind].filter((row) => row.id !== id);
    return undefined;
  }
  content[kind] = content[kind].map((row) => (row.id === id ? { ...row, ...(body as object) } : row));
  return content[kind].find((row) => row.id === id);
}
