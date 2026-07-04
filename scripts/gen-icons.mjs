// Genera los íconos PWA desde public/icon.svg (glifo negro → blanco, fondo naranja marca).
// Correr con: node scripts/gen-icons.mjs  (requiere devDependency `sharp`)
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BG = "#f4813a"; // --primary (naranja amanecer)

const svg = readFileSync(path.join(root, "public/icon.svg"), "utf8").replace(
  'fill="#000000"',
  'fill="#ffffff"',
);

/** Ícono cuadrado: glifo centrado sobre fondo de marca. `pad` = fracción de margen. */
async function make(size, pad, out) {
  const inner = Math.round(size * (1 - pad * 2));
  const glyph = await sharp(Buffer.from(svg)).resize(inner, inner).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([{ input: glyph, gravity: "center" }])
    .png()
    .toFile(path.join(root, "public", out));
  console.log("ok", out);
}

await make(192, 0.12, "icon-192.png");
await make(512, 0.12, "icon-512.png");
// Maskable: safe zone del 80% → más padding.
await make(192, 0.2, "icon-maskable-192.png");
await make(512, 0.2, "icon-maskable-512.png");
// iOS home screen.
await make(180, 0.12, "apple-touch-icon.png");
