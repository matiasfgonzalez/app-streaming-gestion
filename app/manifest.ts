import type { MetadataRoute } from "next";

/** Manifest PWA (Fase 10). Los datos de marca son estáticos (build-time). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Viva La Mañana",
    short_name: "Viva La Mañana",
    description:
      "Radio, streaming, cobertura de eventos y publicidad. Todo en un solo lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f1a",
    theme_color: "#f4813a",
    lang: "es",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
