/** Word count used by the length limits on free-text fields. */
export function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
}

/** Lowercases and strips accents so search matches "cirugia" against "cirugía". */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export interface TextSegment {
  text: string;
  match: boolean;
}

/** Splits `text` around every occurrence of `query`, for highlighted results. */
export function splitOnMatch(text: string, query: string): TextSegment[] {
  const needle = normalizeText(query);
  if (!needle) return [{ text, match: false }];

  const haystack = normalizeText(text);
  const segments: TextSegment[] = [];
  let cursor = 0;

  for (let at = haystack.indexOf(needle, cursor); at !== -1; at = haystack.indexOf(needle, cursor)) {
    if (at > cursor) segments.push({ text: text.slice(cursor, at), match: false });
    segments.push({ text: text.slice(at, at + needle.length), match: true });
    cursor = at + needle.length;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor), match: false });
  return segments;
}

/** "Ana María Pérez" -> "AP" */
export function initials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** "LIMPIEZA DENTAL" → "Limpieza dental", for data written in capitals. */
export const toSentenceCase = (text: string): string =>
  text.charAt(0).toLocaleUpperCase("es") + text.slice(1).toLocaleLowerCase("es");
