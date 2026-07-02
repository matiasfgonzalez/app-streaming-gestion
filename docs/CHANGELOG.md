# Changelog / Bitácora

Registro de avance por fase. Al cerrar cada fase, agregar una entrada con fecha, qué se hizo y cómo se verificó.

Formato: `## [Fase X] AAAA-MM-DD — Título`

---

## [Fase 5.1] 2026-07-02 — Mejoras publicidad (feedback)
- Vigencia: `computeEndDate` (día/semana/mes) en `lib/ads.ts`; se setea `endDate`
  al activar (aprobar pago, admin cambia a ACTIVE, admin crea ACTIVE).
- Vigencia visible: detalle y dashboard del cliente + lista y detalle admin.
- Carga de imágenes arreglada: `CreativesUploader` reutilizable con `UploadButton`
  múltiple (reemplaza el dropzone) + sugerencias de tamaño (`IMAGE_HINTS`).
- Editar creatividades post-creación: acción `updateContractCreatives` (dueño o
  admin) + `EditCreatives` en el detalle del cliente.
- Detalle admin de contrato `/admin/publicidad/[id]`: datos, cliente, vigencia,
  creatividades y pagos con comprobante + aprobar/rechazar; lista enlaza al detalle.
- **Verificado:** `npm run build` OK, `npm run lint` 0 errores.

## [Fase 5] 2026-07-01 — Publicidad: paquetes, contratación, pagos
- Schema: enums `ContractStatus`, `BillingCycle`, `PaymentMethod`, `PaymentStatus`,
  `CreativeType`; modelos `Package`, `AdContract`, `Creative`, `Payment`.
  Migración `ads_payments` + `prisma generate`.
- UploadThing: rutas `adCreative` (logo/imágenes, cliente) y `paymentProof`
  (imagen/PDF, cliente). `newsImage` sigue restringida a staff.
- `lib/ads.ts` (labels + `priceForCycle`), `lib/format.ts` (`formatMoney`),
  `lib/validations/ads.ts` (package/contract/payment; números con `z.number()`).
- Actions: `packages.ts` (CRUD), `contracts.ts` (cliente contrata, admin crea sin
  cliente, cambiar estado), `payments.ts` (informar pago, aprobar/rechazar →
  activa contrato + email). Emails: `newContractEmail`, `paymentResultEmail`.
- Admin: `/admin/paquetes` (CRUD), `/admin/publicidad` (contratos + `ContractStatusSelect`
  + crear sin cliente), `/admin/pagos` (`PaymentReview`). Nav ya incluía los ítems.
- Cliente (grupo `(public)`): `/cliente` (mis contrataciones), `/cliente/contratar`
  (elegir paquete), `/cliente/contratar/[packageId]` (form con creatividades),
  `/cliente/contrataciones/[id]` (detalle + informar pago). Navbar con "Mi cuenta".
- Landing `ServicesPricing` conectada a DB (fallback a seed); links de contratar
  apuntan a `/cliente/contratar`; `Publicidad` del menú → ancla `/#publicidad`.
- **Verificado:** `npm run build` OK, `npm run lint` 0 errores.
- **Siguiente:** Fase 6 — Sponsors + Banners.

## [Fase 4] 2026-07-01 — Eventos + Presupuestos + Resend
- Dep: `resend`. Agregada `RESEND_API_KEY` (y opcional `EMAIL_FROM`) al `.env`.
- Schema: enums `EventStatus`, `QuoteStatus`, `QuoteService`; modelos `Event`
  (portada, lugar/dirección, lat/lng, inicio/fin, estado, artistas/hosts, views)
  y `QuoteRequest` (servicios[], contacto, lugar/días/horarios, detalles, estado,
  evento opcional). Migración `events_quotes`.
- Constantes `lib/events.ts` (labels de servicios/estados, `mapEmbedUrl`),
  validaciones `lib/validations/{event,quote}.ts`.
- Emails: `server/emails/resend.ts` (`sendEmailSafe` tolerante a fallos) +
  `templates.ts` (email de nueva solicitud al admin).
- Queries/actions: `server/{queries,actions}/{events,quotes}.ts` (CRUD eventos,
  crear presupuesto público + email, cambiar estado).
- Admin: `/admin/eventos` (lista/nuevo/editar con `EventForm`), `/admin/presupuestos`
  (bandeja con `QuoteStatusSelect`). Nav actualizado. Dashboard con conteos reales.
- Público: `/eventos` (en vivo/próximos/finalizados + sección presupuesto),
  `/eventos/[slug]` (mapa embed, SEO, vistas). `EventCard` + `QuoteForm`
  reutilizables. Landing `UpcomingEvents` conectada a DB.
- **Verificado:** `npm run build` OK (con `prisma generate` posterior a migrar),
  `npm run lint` 0 errores. **Siguiente:** Fase 5 — Paquetes + contratación + pagos.

## [Fase 3] 2026-07-01 — Módulo Noticias (CRUD end-to-end)
- Deps: `uploadthing`, `@uploadthing/react`, `zod`, `react-hook-form`,
  `@hookform/resolvers`. Creado `.env.example`.
- Schema: enum `ContentStatus` + modelo `News` (portada, video, podcast, estado,
  featured/breaking, views, publishedAt, autor, categorías/tags M:N). Migración
  `news` aplicada. Back-relations en User/Category/Tag.
- UploadThing: `app/api/uploadthing/core.ts` (route `newsImage`, solo ADMIN/EDITOR)
  + `route.ts` + helpers cliente `lib/uploadthing.ts`. `next.config.ts` con
  remotePatterns (`**.ufs.sh`, `utfs.io`).
- Utils: `lib/slug.ts` (slugify + parseCsv), `lib/format.ts` (fecha es-AR, hue),
  `lib/validations/news.ts` (zod v4, `z.url()`).
- Server: `server/queries/news.ts` (publicadas, breaking, por slug, relacionadas,
  admin, por id) + `server/actions/news.ts` (create/update/delete con slug único,
  connectOrCreate de taxonomías, revalidatePath).
- Admin: `/admin/noticias` (lista + borrar), `/admin/noticias/nueva`,
  `/admin/noticias/[id]/editar`; `components/admin/news-form.tsx` (RHF+zod+UploadButton)
  y `delete-news-button.tsx`.
- Público: `app/(public)/noticias` (listado) y `/noticias/[slug]` (detalle con
  SEO/OpenGraph, contador de vistas, relacionadas). `components/news/news-card.tsx`
  reutilizable; landing `LatestNews` conectada a DB (fallback a seed si vacío).
- **Verificado:** `npm run build` OK, `npm run lint` 0 errores.
- **Nota:** tabla admin simple (no TanStack aún); solo portada (galería luego).
  **Siguiente:** Fase 4 — Eventos + solicitud de presupuesto (Resend).

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
