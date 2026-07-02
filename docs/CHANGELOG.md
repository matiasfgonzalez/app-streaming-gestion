# Changelog / Bitácora

Registro de avance por fase. Al cerrar cada fase, agregar una entrada con fecha, qué se hizo y cómo se verificó.

Formato: `## [Fase X] AAAA-MM-DD — Título`

---

## [Fase 10.2] 2026-07-02 — Usuarios / Roles
- Backend: `lib/users.ts` (`ROLE_LABEL`/`ROLE_CLS`/`ROLES`), `lib/validations/users.ts`
  (rol + perfil de cliente), `server/queries/users.ts` (`getAllUsers` con `_count`
  news/contracts, `getUserById` con contratos) y `server/actions/users.ts`
  (`updateUserRole`, `updateClientProfile`) con `logAudit`.
- Admin `/admin/usuarios`: lista con `UserRoleSelect` (cambia rol inline vía
  `useTransition`, revierte en error) + empresa/conteos. `/admin/usuarios/[id]`:
  header con rol, `ClientProfileForm` (empresa/teléfono/CUIT/notas) y lista de
  contrataciones enlazadas a `/admin/publicidad/[id]`.
- Seguridad: `updateUserRole` bloquea el auto-cambio de rol del ADMIN actual y el
  select se deshabilita para "Vos".
- **Verificado:** `npm run build` OK (rutas `/admin/usuarios` y `/admin/usuarios/[id]`
  presentes), `npm run lint` 0 errores (warnings RHF `watch`).
- **Nota:** módulo que faltaba (la nav apuntaba a `/admin/usuarios` sin página).
  Altas por Clerk (lazy-sync); sin borrado manual.

## [Fase 10.1] 2026-07-02 — Galería / Videos (módulo Media)
- Modelo `MediaItem` (enum `MediaType`): imágenes de galería y videos de YouTube
  reutilizables (url, youtubeId, title, caption, featured, order). Migración
  `media_items`.
- `lib/validations/media.ts` (refine: IMAGE exige url, VIDEO exige youtubeId);
  `server/queries/media.ts` (`getGalleryImages`, `getVideos`, admin, byId);
  `server/actions/media.ts` (create/update/delete con `logAudit`).
- Admin `/admin/media` (grilla con thumbnails — para VIDEO usa
  `img.youtube.com/vi/<id>/hqdefault.jpg`) + nuevo/editar con `MediaForm`
  (conmuta imagen/YouTube, vista previa) y `DeleteMediaButton`.
- Público: `/galeria` (masonry de fotos + embeds de video); secciones `Gallery`
  y `Videos` de la landing ahora async y conectadas a DB con fallback a los
  placeholders seed; `/galeria` agregada a `NAV_LINKS` (navbar/drawer/bottom-nav/footer).
- **Verificado:** `npm run build` OK (rutas `/admin/media` y `/galeria` presentes),
  `npm run lint` 0 errores (warnings RHF `watch`).
- **Nota:** módulo que faltaba en el roadmap (la nav apuntaba a `/admin/media` sin
  página). Asociar media a noticias/eventos queda en backlog.

## [Fase 10] 2026-07-02 — Analytics + Auditoría + PWA
- Modelo `AuditLog` (action/entity/entityId/summary/userId/userEmail). Migración
  `audit_log`. `lib/audit.ts` (`logAudit`, tolerante a fallos) + `lib/logger.ts`
  (logger mínimo sin dependencias).
- Auditoría wired: `createPayment`/`reviewPayment` (pagos) y `updateSiteConfig`/
  `updateSectionFlags`/`updateTheme` (configuración) registran la acción.
- `server/queries/analytics.ts`: `getDashboardData` (conteos, ingresos aprobados,
  CTR banners/sponsors, top noticias/eventos por vistas, quotes/contratos por estado)
  y `getAuditLogs`.
- Dashboard `/admin` reescrito con KPIs reales, tarjetas CTR y `BarList`
  (`components/admin/bar-list.tsx`, barras horizontales en CSS puro, sin librería).
- `/admin/auditoria` (ADMIN) muestra el registro; ítem agregado a `admin-nav.ts`.
- PWA: `app/manifest.ts`, `public/sw.js` (fallback offline solo en navegaciones,
  no cachea chunks), `public/offline.html`, `public/icon.svg`,
  `components/pwa/sw-register.tsx` (registro en producción) + `appleWebApp` en el
  `generateMetadata` del root.
- **Verificado:** `npm run build` OK (rutas `/admin/auditoria` y
  `/manifest.webmanifest` presentes), `npm run lint` 0 errores (warnings RHF `watch`).
- **Siguiente:** Fase 11 — Tienda (preparada, inactiva).

## [Fase 9] 2026-07-02 — Theme Engine
- `lib/theme.ts`: `ThemeConfig` (paleta claro/oscuro, radius, fuentes, animaciones),
  `DEFAULT_THEME`, `mergeTheme`, `fontStack`, `googleFontsHref`, `themeCss`
  (genera el override de vars). `lib/validations/theme.ts` (colores HEX, radius 0–2,
  fuentes de una lista de 10).
- Persistencia en `SiteSetting["theme"]`: `getThemeConfig` (query) y `updateTheme`
  (action con `revalidatePath("/", "layout")`).
- `components/theme/theme-style.tsx` (server) en el root `<body>`: inyecta
  `<style>` con `:root`/`.dark` (primary/secondary/accent/ring/glow/radius/fuentes)
  y `<link>` a Google Fonts; apaga `.animate-aurora` si las animaciones están off.
  El `<style>` plano queda inline tras los globals → gana la cascada.
- Admin: `/admin/configuracion/tema` (tab en Configuración) con `ThemeForm`
  (color pickers claro/oscuro, selects de tipografía, radius, toggle de animaciones,
  botón "Restaurar por defecto").
- **Verificado:** `npm run build` OK, `npm run lint` 0 errores (warnings RHF `watch`);
  el HTML prerenderizado del home incluye el override de vars, el link de fonts y la
  regla de animaciones.
- **Siguiente:** Fase 10 — Analytics + Auditoría + PWA.

## [Fase 8] 2026-07-02 — CMS Landing + Configuración
- Config global en `SiteSetting["site"]`: `lib/site-config.ts` (`SiteConfig`,
  `DEFAULT_SITE_CONFIG`, `mergeSiteConfig`) — identidad, contacto (+ Maps embed),
  redes, SEO. Toggles en `SiteSetting["sections"]`: `lib/sections.ts`
  (`LANDING_SECTIONS`, `SectionFlags`, `mergeSectionFlags`).
- `lib/validations/settings.ts`; queries/actions `server/{queries,actions}/settings.ts`
  (`getSiteConfig`/`getSectionFlags`, `updateSiteConfig`/`updateSectionFlags` con
  `revalidatePath("/", "layout")`).
- Admin: `/admin/configuracion` (form general con identidad/contacto/redes/SEO) y
  `/admin/configuracion/secciones` (toggles) con `SettingsTabs`; forms
  `SiteConfigForm`, `SectionsForm`.
- Wiring landing: home renderiza secciones según flags y pasa contacto a `ContactMap`
  (con embed de Maps o placeholder); `Footer` async lee marca/contacto/redes (oculta
  redes sin URL); `generateMetadata` en el root layout usa el SEO configurado.
- **Verificado:** `npm run build` OK, `npm run lint` 0 errores (warnings RHF `watch`).
- **Siguiente:** Fase 9 — Theme Engine.

## [Fase 7] 2026-07-02 — Radio + Streaming
- Schema: enum `Weekday`; modelos `RadioProgram` (conductores/invitados como
  `String[]`, portada, activo, orden), `RadioSchedule` (día + horario + repetición,
  `onDelete: Cascade`) y `Podcast` (audio propio o `youtubeId`, programa opcional).
  Migración `radio_streaming`.
- `lib/radio.ts` (labels de días, WEEKDAYS, `StreamingConfig`/`DEFAULT_STREAMING`),
  `lib/validations/radio.ts` (programa con horarios anidados, podcast, streaming).
- Queries/actions `server/{queries,actions}/radio.ts`: CRUD de programas (horarios
  por reemplazo transaccional), podcasts, grilla semanal (`getWeeklyGrid`),
  streaming en `SiteSetting["streaming"]` (`getStreamingConfig`/`updateStreaming`).
- UploadThing: endpoint `podcastAudio` (audio 32MB, staff).
- Admin: `/admin/radio` (programas), `/admin/radio/podcasts`, `/admin/radio/streaming`
  con `RadioTabs`; forms `RadioProgramForm` (`useFieldArray` para horarios),
  `PodcastForm`, `StreamingForm` (vista previa del embed).
- Público: `/radio` (grilla lun–dom, programas+conductores, programas anteriores);
  sección `Streaming` de la landing lee el ID configurado (fallback demo); link
  "Ver programación" desde el reproductor.
- **Verificado:** `npm run build` OK, `npm run lint` 0 errores (warnings RHF `watch`).
- **Siguiente:** Fase 8 — CMS Landing + Configuración.

## [Fase 6] 2026-07-02 — Sponsors + Banners
- Schema: enums `SponsorStatus`, `BannerPlacement`; modelos `Sponsor` (logo,
  web, redes, estado, clicks/impresiones, orden) y `Banner` (imagen, link,
  ubicación, activo, clicks/impresiones, orden). Migración `sponsors_banners`.
- `lib/banners.ts` (labels), `lib/validations/banners.ts`.
- Queries/actions `server/{queries,actions}/banners.ts` (CRUD sponsors y banners).
- Tracking: `app/api/track/[kind]/[id]/route.ts` (incrementa clicks y redirige).
- Admin: `/admin/sponsors` y `/admin/banners` (lista/nuevo/editar/borrar) con
  `SponsorForm`/`BannerForm` (UploadThing `newsImage`); nav actualizado.
- Público: `/sponsors` (grilla + click tracking + bump impresiones), sección
  `Sponsors` de la landing conectada a DB (marquee con logos, fallback seed),
  `BannerSlot` en la landing (placement HOME).
- **Verificado:** `npm run build` OK, `npm run lint` 0 errores.
- **Siguiente:** Fase 7 — Radio + Streaming.

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
