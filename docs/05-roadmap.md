# Roadmap por fases

> Cada fase entrega un **MVP demostrable**. Regla de cierre de fase: `npm run build` y `npm run lint` sin errores, algo visible funcionando, y actualizar este archivo + [CHANGELOG.md](CHANGELOG.md).
>
> Antes de codear cada fase: revisar `node_modules/next/dist/docs/01-app/`.

Leyenda: `[ ]` pendiente · `[~]` en progreso · `[x]` hecho.

---

## Fase 0 — Fundaciones ✅
- [x] Docs `docs/` creados (Entregable 0).
- [x] Config Tailwind v4 + design tokens (CSS variables) en `globals.css`.
- [x] ShadCN/UI listo (`components.json` + `cn()`); componentes se agregan on-demand.
- [x] Framer Motion instalado.
- [x] Theme provider (dark/light, sin flash con `next-themes`) en root layout.
- [x] Fuentes: Space Grotesk (display) + Inter (texto).
- [x] Componentes base: `GlassCard`, `NeuButton`, `AuroraBackground`, `Section/Container/SectionHeading`, `ThemeToggle`, `Navbar`, `BottomNav`, `MobileDrawer`, `Footer`.
- [x] Route group `(public)` con layout (Navbar + BottomNav + Footer) + home demo.
- [x] `npm run build` y `npm run lint` OK.
- **Entregable:** layout base mobile-first con dark/light funcionando. ✅

## Fase 1 — Landing pública (primer MVP visible) ✅
- [x] Secciones con contenido **seed** (`lib/landing-data.ts`): hero, stats, qué es, radio, streaming, noticias, eventos, cobertura deportiva, publicidad+paquetes, sponsors, galería, videos, testimonios, FAQ, contacto+mapa.
- [x] Identidad visual aplicada (glass/neu/aurora/glow) + animaciones (`Reveal`, waveform, marquee).
- [x] Mobile-first: bottom-nav, drawer, safe-area, `Reveal` respeta reduced-motion.
- [x] Streaming = embed YouTube; Radio = reproductor placeholder (play/pausa visual); Estadísticas = contadores.
- [x] Formulario de contacto (front, sin persistencia — Fase 4/8).
- [x] Placeholders de imagen por gradiente (`MediaPlaceholder`), sin assets externos.
- [x] `npm run build` y `npm run lint` OK.
- **Entregable:** landing navegable, responsive, dark/light. ✅
- Pendiente menor: rutas internas (`/noticias`, `/eventos`, `/radio`, `/publicidad`) aún 404 — se crean en sus fases.

## Fase 2 — Base de datos + Auth + RBAC ✅
- [x] Prisma **7** + Neon conectados; esquema núcleo (User, ClientProfile, SiteSetting, Category, Tag) + enum Role. Migración `init` aplicada.
- [x] `lib/db.ts` (singleton con driver adapter `@prisma/adapter-pg`), `lib/auth.ts` (`getCurrentUser` con lazy-sync, `requireRole`, `hasRole`).
- [x] Clerk: sign-in/up (`app/(auth)`), `proxy.ts` (protege /admin, /cliente), provider en root layout (localización esES), controles en navbar.
- [x] `AdminShell` (dashboard-first, sidebar+drawer) protegido por rol; `/admin` dashboard con KPIs.
- [x] `npm run build` y `npm run lint` OK.
- **Entregable:** login real, roles, admin accesible solo a ADMIN/EDITOR. ✅
- **Bootstrap admin:** agregar `ADMIN_EMAILS="tu@mail.com"` en `.env` para que ese usuario se cree como ADMIN al primer login.
- **Deviaciones vs plan:** Prisma 7 (URL en `prisma.config.ts` + driver adapter, no en schema); `middleware.ts`→`proxy.ts` (deprecación Next 16); Clerk v7 (sin `SignedIn/SignedOut`, se usa `useUser`). Webhook de sync pospuesto: se usa **lazy-sync** en `getCurrentUser` (no requiere URL pública).

## Fase 3 — Noticias (primer CRUD end-to-end) ✅
- [x] CRUD admin (RHF + Zod, UploadThing para portada). Lista + nueva + editar + borrar.
- [x] Categorías y tags (CSV con `connectOrCreate` por slug).
- [x] Render público: listado `/noticias`, detalle `/noticias/[slug]` (SEO/OpenGraph, vistas, relacionadas), landing conectada a DB (con fallback a seed).
- [x] Server Actions (`server/actions/news.ts`) + queries (`server/queries/news.ts`), slug único, `revalidatePath`.
- [x] `.env.example` con todas las variables.
- [x] `npm run build` OK; `npm run lint` 0 errores (1 warning esperado de RHF `watch`).
- [ ] Tests Vitest — pendientes (se agregan junto con Fase 4/5).
- **Entregable:** EDITOR/ADMIN crea noticia → aparece en landing y en `/noticias`. ✅
- **Deviaciones:** tabla admin simple (lista) en vez de TanStack (se evalúa cuando haga falta ordenamiento/filtros); galería de imágenes por noticia pospuesta (solo portada por ahora); zod v4 (`z.url()`), UploadThing v7 (`file.ufsUrl`).

## Fase 4 — Eventos + Presupuestos ✅
- [x] CRUD eventos (estados UPCOMING/LIVE/FINISHED, portada, mapa embed, artistas/conductores) + render público (`/eventos`, `/eventos/[slug]`).
- [x] Formulario público "Solicitar presupuesto" (checkboxes de servicios) → `QuoteRequest`.
- [x] Email a admin (Resend, tolerante a fallos) + bandeja `/admin/presupuestos` con cambio de estado.
- [x] Landing `UpcomingEvents` conectada a DB (fallback a seed). Dashboard con conteos reales.
- [x] `npm run build` OK; `npm run lint` 0 errores (warnings RHF `watch`).
- **Entregable:** evento publicado + presupuesto solicitable y gestionable. ✅
- **Deviaciones:** galería/sponsors por evento pospuestos (portada + mapa por ahora); mapa vía embed de Google sin API key.

## Fase 5 — Publicidad: Paquetes, Contratación, Pagos ✅
- [x] Paquetes editables (CRUD admin, precios mensual/semanal/día, features) + sección pública conectada a DB.
- [x] Portal Cliente (`/cliente`): contratar → creatividades (logo + imágenes vía UploadThing) + redes/desc → informar pago (monto, método, comprobante).
- [x] Admin: publicidad (contratos + estado), pagos (aprobar/rechazar → activa contrato + email al cliente), crear publicidad sin cliente ("de palabra").
- [x] Emails: nueva contratación (a admin) y resultado de pago (a cliente), tolerantes a fallos.
- [x] `npm run build` OK; `npm run lint` 0 errores (warnings RHF `watch`).
- **Entregable:** flujo completo Cliente → Pendiente → Aprobación → Activa. ✅
- **Deviaciones:** montos con `z.number()` + `valueAsNumber` (evita el problema de tipos de `z.coerce`); UploadThing rutas `adCreative`/`paymentProof` para clientes; portal cliente bajo grupo `(public)` para reusar navbar/footer.

## Fase 6 — Sponsors + Banners ✅
- [x] Módulo sponsors (CRUD admin, logo, estado, orden, clicks/impresiones) + render: marquee en landing (DB, fallback seed) y página pública `/sponsors`.
- [x] Banners por ubicación (CRUD admin, `BannerPlacement`) + `BannerSlot` renderizado en landing (HOME).
- [x] Tracking de clicks: `/api/track/[kind]/[id]` incrementa y redirige (sponsor→web, banner→link). Impresiones de sponsors en `/sponsors`.
- [x] `npm run build` OK; `npm run lint` 0 errores (warnings RHF `watch`).
- **Entregable:** sponsors/banners dinámicos y medibles. ✅
- **Deviaciones:** imágenes de logo/banner con endpoint `newsImage` (staff); impresiones como proxy simple (no por-render); banners renderizados por ahora en HOME (otras ubicaciones listas para conectar con `<BannerSlot placement=... />`).

## Fase 7 — Radio + Streaming ✅
- [x] Modelos `RadioProgram`, `RadioSchedule` (horarios semanales + repeticiones), `Podcast`; enum `Weekday`. Migración `radio_streaming`.
- [x] CRUD admin de programas (conductores/invitados por CSV, portada, horarios anidados con `useFieldArray`, borrado+recreación transaccional) en `/admin/radio`.
- [x] CRUD admin de podcasts (`/admin/radio/podcasts`): audio propio (UploadThing `podcastAudio`) o YouTube, asociable a programa.
- [x] Streaming gestionable (`/admin/radio/streaming`): ID de YouTube en `SiteSetting["streaming"]` con vista previa; landing conectada (fallback a demo).
- [x] Público `/radio`: grilla semanal (lun–dom), programas+conductores, programas anteriores (podcasts). Link desde el reproductor de la landing.
- [x] `npm run build` OK; `npm run lint` 0 errores (warnings RHF `watch`).
- **Entregable:** sección Radio completa con programación dinámica y streaming editable. ✅
- **Deviaciones:** horarios editados dentro del form del programa (no CRUD aparte); streaming en `SiteSetting` (no modelo propio); tab Streaming visible a EDITOR pero la página exige ADMIN (redirige); reproductor de radio sigue placeholder (transmisión propia = backlog).

## Fase 8 — CMS Landing + Configuración ✅
- [x] Config global en `SiteSetting["site"]` (`lib/site-config.ts`: identidad, contacto, redes, SEO) con merge sobre defaults. Form `/admin/configuracion`.
- [x] Toggles de secciones en `SiteSetting["sections"]` (`lib/sections.ts`) — 14 bloques on/off. Form `/admin/configuracion/secciones` con `SettingsTabs`.
- [x] Landing conectada: home renderiza cada sección según flag; `ContactMap` usa contacto + embed de Maps; `Footer` (server) usa marca/contacto/redes; `generateMetadata` (root) usa SEO.
- [x] `npm run build` OK; `npm run lint` 0 errores (warnings RHF `watch`).
- **Entregable:** admin enciende/apaga secciones y edita datos/SEO sin tocar código. ✅
- **Deviaciones:** logo/favicon, tipografías y paleta = Fase 9 (theme-engine); persistencia del form de contacto (`ContactMessage`) sigue en backlog; Hero siempre visible (no toggleable). Revalidación con `revalidatePath("/", "layout")`.

## Fase 9 — Theme Engine ✅
- [x] Config de tema en `SiteSetting["theme"]` (`lib/theme.ts`): paleta claro/oscuro (primary/secondary/accent), radius, tipografías (display/body) y toggle de animaciones. Merge sobre defaults.
- [x] `ThemeStyle` (server, en el root layout) inyecta un `<style>` que sobrescribe los tokens de `globals.css` (`:root`/`.dark`) y un `<link>` a Google Fonts según las familias elegidas.
- [x] Admin `/admin/configuracion/tema` (tab en Configuración): color pickers, selects de fuentes (10 familias), radius, animaciones on/off, "Restaurar por defecto".
- [x] `npm run build` OK; `npm run lint` 0 errores (warnings RHF `watch`). Verificado: el HTML prerenderizado incluye el override de vars + fonts.
- **Entregable:** admin cambia colores/tipografías y el sitio lo refleja (claro y oscuro). ✅
- **Deviaciones:** colores en HEX (los defaults de `globals.css` son OKLCH; los tokens editables lo sobrescriben); tipografías vía Google Fonts CDN (las locales Inter/Space Grotesk siguen como fallback); loader configurable = pendiente (backlog); la marca en navbar sigue con ícono fijo.

## Fase 10 — Analytics + Auditoría + PWA ✅
- [x] Modelo `AuditLog`; `lib/audit.ts` (`logAudit`, tolerante) + `lib/logger.ts`. Wired en pagos (informar/aprobar/rechazar) y configuración (general/secciones/tema). Migración `audit_log`.
- [x] Dashboard `/admin` con KPIs reales (usuarios, noticias, eventos, presupuestos, ingresos aprobados, contratos activos, sponsors, pagos pendientes), CTR de banners/sponsors, rankings de vistas y distribuciones por estado. Charts con `BarList` (SVG/CSS puro, sin dependencia).
- [x] `/admin/auditoria` (solo ADMIN) lista las acciones registradas; ítem en nav.
- [x] PWA: `app/manifest.ts`, `public/sw.js` (fallback offline en navegaciones), `public/offline.html`, `public/icon.svg`, `ServiceWorkerRegister` (registra en prod) + `appleWebApp` en metadata.
- [x] `npm run build` OK; `npm run lint` 0 errores (warnings RHF `watch`).
- **Entregable:** panel con métricas reales, auditoría visible y app instalable. ✅
- **Deviaciones:** charts propios en vez de Tremor/Recharts (evita dependencia pesada); Sentry y Pino = backlog (requieren DSN/infra, se dejó `logger` mínimo); ícono PWA en SVG (raster 192/512 PNG = follow-up para instalabilidad estricta); SW conservador (no cachea chunks de Next para no servir assets obsoletos).

## Fase 10.1 — Galería / Videos (módulo Media) ✅
- [x] Modelo `MediaItem` (enum `MediaType` IMAGE/VIDEO; url, youtubeId, title, caption, featured, order). Migración `media_items`.
- [x] Backend: `lib/validations/media.ts` (refine por tipo), `server/queries/media.ts`, `server/actions/media.ts` (CRUD + auditoría).
- [x] Admin `/admin/media` (grilla con thumbnails, badge de tipo/destacada) + nuevo/editar; `MediaForm` conmuta entre subir imagen (UploadThing `newsImage`) o ID de YouTube con vista previa.
- [x] Público: página `/galeria` (masonry de fotos + grilla de videos con embeds) + ítem en nav; secciones `Gallery` y `Videos` de la landing conectadas a DB (fallback a placeholders seed), con link "Ver galería completa".
- [x] `npm run build` OK; `npm run lint` 0 errores (warnings RHF `watch`).
- **Entregable:** admin sube/organiza fotos y videos → aparecen en la landing y en `/galeria`. ✅
- **Deviaciones:** este módulo faltaba en el roadmap original (`/admin/media` estaba en la nav sin página); podcasts se gestionan aparte (Fase 7), acá solo IMAGE/VIDEO; asociación de media a noticias/eventos = backlog (por ahora standalone).

## Fase 10.2 — Usuarios / Roles ✅
- [x] Backend: `lib/users.ts` (labels/estilos de rol), `lib/validations/users.ts`, `server/queries/users.ts` (lista con conteos, detalle con contratos) y `server/actions/users.ts` (`updateUserRole`, `updateClientProfile`) con auditoría.
- [x] Admin `/admin/usuarios`: lista con rol editable inline (`UserRoleSelect`), empresa y conteos; `/admin/usuarios/[id]`: detalle con rol, perfil de cliente editable (`ClientProfileForm`) y contrataciones del usuario.
- [x] Guard: un ADMIN no puede cambiar su propio rol (evita autobloqueo); el select se deshabilita para el usuario actual.
- [x] `npm run build` OK; `npm run lint` 0 errores (warnings RHF `watch`).
- **Entregable:** ADMIN ve usuarios, cambia roles y gestiona perfiles de cliente. ✅
- **Deviaciones:** los usuarios se crean vía Clerk (lazy-sync), no hay alta manual; sin borrado (al reloguear, Clerk re-sincroniza como CLIENTE); email/nombre vienen de Clerk (no editables acá).

## Fase 11 — Tienda (preparada, inactiva)
- [ ] Modelos + UI base detrás de feature flag; pago manual.
- **Entregable:** tienda lista para activar a futuro.

## Fase 12 — Rediseño UI / Auditoría de interfaz (skill `/frontend-design`)
> Tarea de **mejora de interfaz** ejecutada con la skill `/frontend-design`. No cambia
> la esencia del producto ni la identidad ya definida en [04-design-system.md](04-design-system.md):
> **evoluciona** el diseño existente para llevarlo a nivel SaaS profesional, moderno,
> elegante e innovador, manteniendo coherencia visual.
>
> **Auditoría detallada, hallazgos y plan por capas (12.1–12.5) con checklist de avance en
> [07-auditoria-ui.md](07-auditoria-ui.md).**

**Objetivo:** auditoría completa de la interfaz y rediseño del frontend a un estándar
comparable a Linear, Vercel, Stripe Dashboard, Raycast, Notion y Clerk, adaptado a la
identidad de Viva La Mañana.

- [ ] **Auditoría** de toda la interfaz: Landing, páginas públicas, dashboard, panel admin,
      componentes, layouts, navegación, formularios, tablas, cards, modales, métricas,
      estados vacíos, loaders/skeletons, notificaciones, gráficos, responsive y accesibilidad.
- [ ] **Rediseño** aplicando las guías de identidad (sin reemplazarlas):
  - Glassmorphism elegante y sutil.
  - Neumorphism solo donde aporte profundidad.
  - Aurora Gradients como acento.
  - Microinteracciones fluidas con Framer Motion.
  - Toques muy suaves de Cyberpunk (glow/neón solo en elementos destacados).
  - Dashboard Enterprise: limpio, denso, ordenado y profesional.
- [ ] **Optimizar**: jerarquía visual, tipografía, espaciados, paleta, iconografía,
      contraste, UX, accesibilidad (AA, focus visible, `prefers-reduced-motion`),
      consistencia del Design System, reutilización de componentes y rendimiento del frontend.
- [ ] **Consistencia**: unificar patrones repetidos (cards, tablas, formularios, badges,
      estados) en primitivos reutilizables; documentar cambios en [04-design-system.md](04-design-system.md).
- [ ] `npm run build` y `npm run lint` sin errores; verificación visual en claro/oscuro y mobile.
- **Entregable:** frontend rediseñado a nivel SaaS premium, coherente con la identidad,
  sin regresiones funcionales.
- **Skill usada:** `/frontend-design` (guía de dirección estética, tipografía y decisiones
  no-templadas).

---

## Backlog (post-MVP)
- Transmisión de radio propia desde la plataforma.
- Integración Mercado Pago.
- Migración de storage a Cloudflare R2.
- Internacionalización (i18n).
