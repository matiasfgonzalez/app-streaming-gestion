/** Convierte texto a slug URL-friendly (sin acentos, minúsculas, guiones). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // diacríticos combinados (acentos)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Parsea "uno, dos , tres" -> ["uno","dos","tres"] (sin vacíos, sin duplicados). */
export function parseCsv(input: string | undefined | null): string[] {
  if (!input) return [];
  return Array.from(
    new Set(
      input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}
