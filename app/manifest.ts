import type { MetadataRoute } from "next";

/** Manifest PWA (Fase 10). Los datos de marca son estáticos (build-time). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Viva La Mañana",
    short_name: "Viva La Mañana",
    description:
      "Radio, streaming, cobertura de eventos y publicidad. Todo en un solo lugar.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0f1a",
    theme_color: "#f4813a",
    lang: "es",
    // PNG 192/512 son requisito de instalabilidad en Chrome/Android; los
    // maskable llevan margen extra (safe zone). Regenerar: node scripts/gen-icons.mjs
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
