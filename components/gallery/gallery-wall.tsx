"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon, Play, Video, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  id: string;
  type: "IMAGE" | "VIDEO";
  title: string | null;
  caption: string | null;
  /** IMAGE: url de la foto. VIDEO: thumbnail (o null → se deriva de youtubeId). */
  url: string | null;
  youtubeId: string | null;
  featured: boolean;
};

type Filter = "all" | "IMAGE" | "VIDEO";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "IMAGE", label: "Fotos" },
  { key: "VIDEO", label: "Videos" },
];

function thumbOf(item: GalleryItem): string | null {
  if (item.url) return item.url;
  if (item.youtubeId) return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
  return null;
}

/**
 * Muro multimedia unificado: mosaico bento (destacados en 2×2), filtros por tipo
 * y lightbox propio (imagen grande / YouTube on-demand, teclado ← → Esc).
 * Los videos muestran thumbnail: el iframe solo se monta al abrir el lightbox.
 */
export function GalleryWall({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.type === filter)),
    [items, filter],
  );
  const current = openIndex != null ? visible[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((i) =>
        i == null ? i : (i + dir + visible.length) % visible.length,
      );
    },
    [visible.length],
  );

  // Teclado + scroll-lock del documento mientras el lightbox está abierto.
  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [openIndex, close, step]);

  const counts = useMemo(
    () => ({
      IMAGE: items.filter((i) => i.type === "IMAGE").length,
      VIDEO: items.filter((i) => i.type === "VIDEO").length,
    }),
    [items],
  );

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          const count =
            key === "all" ? items.length : key === "IMAGE" ? counts.IMAGE : counts.VIDEO;
          if (key !== "all" && count === 0) return null;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key);
                setOpenIndex(null);
              }}
              aria-pressed={active}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "surface text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              <span
                className={cn(
                  "tnum rounded-full px-2 py-0.5 text-xs",
                  active ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mosaico bento */}
      <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((item, i) => {
          const thumb = thumbOf(item);
          const big = item.featured;
          return (
            <motion.button
              key={item.id}
              type="button"
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : Math.min(i * 0.04, 0.4) }}
              onClick={() => setOpenIndex(i)}
              aria-label={item.title ?? (item.type === "VIDEO" ? "Ver video" : "Ver foto")}
              className={cn(
                "group relative overflow-hidden rounded-xl text-left",
                big && "col-span-2 row-span-2",
              )}
            >
              {thumb ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={thumb}
                  alt={item.title ?? ""}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              ) : (
                <span className="surface-muted flex size-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-6" />
                </span>
              )}

              {/* Overlay: gradiente + título al hover (siempre visible en touch) */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-80 transition-opacity group-hover:opacity-100" />
              {(item.title || item.type === "VIDEO") && (
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                  <span className="min-w-0">
                    {item.title && (
                      <span className="line-clamp-2 font-display text-sm font-semibold text-white drop-shadow">
                        {item.title}
                      </span>
                    )}
                  </span>
                  {item.type === "VIDEO" && (
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                      <Video className="size-4" />
                    </span>
                  )}
                </span>
              )}

              {/* Play central para videos */}
              {item.type === "VIDEO" && (
                <span className="ring-glow absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-transform group-hover:scale-110">
                  <Play className="size-5 translate-x-0.5" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {current && openIndex != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={current.title ?? "Contenido de la galería"}
            onClick={close}
          >
            {/* Barra superior */}
            <div className="flex items-center justify-between p-4">
              <span className="tnum text-sm text-white/70">
                {openIndex + 1} / {visible.length}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Contenido */}
            <div
              className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex max-h-full w-full max-w-5xl flex-col items-center"
              >
                {current.type === "VIDEO" && current.youtubeId ? (
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                    <iframe
                      className="size-full"
                      src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?autoplay=1`}
                      title={current.title ?? "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={thumbOf(current) ?? ""}
                    alt={current.title ?? ""}
                    className="max-h-[75dvh] w-auto max-w-full rounded-xl object-contain"
                  />
                )}
                {(current.title || current.caption) && (
                  <div className="mt-3 max-w-2xl text-center">
                    {current.title && (
                      <p className="font-display font-semibold text-white">{current.title}</p>
                    )}
                    {current.caption && (
                      <p className="mt-0.5 text-sm text-white/70">{current.caption}</p>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Navegación */}
            {visible.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Anterior"
                  className="absolute left-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Siguiente"
                  className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
