# Changelog / Bitácora

Registro de avance por fase. Al cerrar cada fase, agregar una entrada con fecha, qué se hizo y cómo se verificó.

Formato: `## [Fase X] AAAA-MM-DD — Título`

---

## [Fase 0] 2026-06-30 — Fundaciones
- Dependencias: `next-themes`, `framer-motion`, `class-variance-authority`,
  `clsx`, `tailwind-merge`, `lucide-react`, `tw-animate-css`,
  `@icons-pack/react-simple-icons`.
- Design tokens en `app/globals.css` (glass, neumorphism, aurora, glow) con
  modo claro/oscuro (`.dark` + `@custom-variant`), mapeados en `@theme inline`.
- ShadCN listo: `components.json` + `lib/utils.ts` (`cn`). Componentes se agregan
  on-demand (no se corrió init interactivo).
- Root layout en español, anti-flash con `next-themes`, fuentes Space Grotesk
  (display) + Inter (texto), metadata + viewport (safe-area).
- Componentes base: `components/glass/*` (GlassCard, NeuButton, AuroraBackground,
  Section/Container/SectionHeading), `theme-provider`, `theme-toggle`,
  `components/layout/*` (Navbar, BottomNav, MobileDrawer, Footer, nav-links).
- Route group `app/(public)/` con layout y home demo (hero + stats + preview del
  design system).
- Estructura a nivel raíz (`lib/`, `components/`) por alias `@/*` → `./*`.
- **Verificado:** `npm run build` y `npm run lint` sin errores.
- **Siguiente:** Fase 1 — Landing pública completa (todas las secciones con seed).

## [Entregable 0] 2026-06-30 — Documentación inicial
- Creada la guía del proyecto en `docs/`:
  - `00-overview.md`, `01-vision-y-prompt.md`, `02-arquitectura.md`,
    `03-modelo-de-datos.md`, `04-design-system.md`, `05-roadmap.md`,
    `06-modulos.md`, `CHANGELOG.md`.
- Decisiones baseline registradas (MVP landing primero, tema fijo inicial,
  solo español, UploadThing, pagos manuales, tienda preparada e inactiva).
- **Siguiente:** Fase 0 — Fundaciones (tokens, ShadCN, theme provider, componentes base).
