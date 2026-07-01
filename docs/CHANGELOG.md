# Changelog / Bitácora

Registro de avance por fase. Al cerrar cada fase, agregar una entrada con fecha, qué se hizo y cómo se verificó.

Formato: `## [Fase X] AAAA-MM-DD — Título`

---

## [Fase 2] 2026-07-01 — DB + Auth + RBAC
- Deps: `@clerk/nextjs` (v7), `@clerk/localizations`, `prisma` (v7),
  `@prisma/client`, `@prisma/adapter-pg`, `dotenv`.
- **Prisma 7**: URL fuera del schema → `prisma.config.ts` (`datasource.url =
  env("DIRECT_URL")` para migraciones); runtime con driver adapter
  `@prisma/adapter-pg` sobre `DATABASE_URL` (pooler) en `lib/db.ts`.
- `prisma/schema.prisma`: enum Role + User, ClientProfile, SiteSetting,
  Category, Tag. Migración `init` aplicada en Neon.
- `lib/auth.ts`: `getCurrentUser` (lazy-sync Clerk→DB, primer login crea User;
  rol ADMIN si el email está en `ADMIN_EMAILS`), `requireRole`, `hasRole`.
- Clerk: `app/(auth)/sign-in` y `/sign-up` (rutas catch-all), `ClerkProvider`
  con localización esES en root layout, `useUser`/`UserButton` en navbar.
- `proxy.ts` (ex middleware, renombrado por deprecación Next 16): `clerkMiddleware`
  protege `/admin` y `/cliente`.
- Panel admin: `components/admin/admin-shell.tsx` (sidebar+drawer, dashboard-first)
  + `admin-nav.ts` (links por rol), `app/admin/layout.tsx` (requireRole ADMIN/EDITOR)
  y `app/admin/page.tsx` (KPIs).
- **Verificado:** `npm run build` y `npm run lint` sin errores.
- **Nota:** para ser ADMIN, agregar `ADMIN_EMAILS` en `.env` antes del primer login.
  **Siguiente:** Fase 3 — Módulo Noticias (CRUD end-to-end).

## [Fase 1] 2026-07-01 — Landing pública
- Contenido seed en `lib/landing-data.ts` (noticias, eventos, paquetes,
  servicios, sponsors, testimonios, FAQ, stats).
- Primitivos `components/glass/`: `MediaPlaceholder` (portadas por gradiente,
  sin assets externos), `Waveform` (barras CSS), `Reveal` (fade+rise scroll con
  framer-motion, respeta reduced-motion).
- 15 secciones en `components/sections/`: Hero (mini player "al aire"), Stats,
  About, RadioPlayer (play/pausa visual), Streaming (embed YouTube), LatestNews,
  UpcomingEvents (estados), Sports, ServicesPricing (servicios + 3 paquetes,
  medio destacado), Sponsors (marquee), Gallery (bento), Videos, Testimonials,
  Faq (details nativo), ContactMap (form con estado local, mapa placeholder).
- Keyframe `marquee` agregado a `globals.css`.
- `app/(public)/page.tsx` compone todas las secciones.
- **Verificado:** `npm run build` y `npm run lint` sin errores.
- **Nota:** rutas internas (/noticias, /eventos, /radio, /publicidad) 404 hasta
  su fase. **Siguiente:** Fase 2 — DB (Prisma+Neon) + Auth (Clerk) + RBAC.

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
