const dateFmt = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return dateFmt.format(new Date(date));
}

/** Hue estable (0-359) derivado de un string, para placeholders de color. */
export function hueFrom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}
