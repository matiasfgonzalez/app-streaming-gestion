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

## Fase 10 — Analytics + Auditoría + PWA
- [ ] Dashboard KPIs (Tremor/Recharts), AuditLog visible, contadores reales, CTR publicidad.
- [ ] PWA (manifest + SW), Sentry, Pino.
- **Entregable:** panel con métricas reales y app instalable.

## Fase 11 — Tienda (preparada, inactiva)
- [ ] Modelos + UI base detrás de feature flag; pago manual.
- **Entregable:** tienda lista para activar a futuro.

---

## Backlog (post-MVP)
- Transmisión de radio propia desde la plataforma.
- Integración Mercado Pago.
- Migración de storage a Cloudflare R2.
- Internacionalización (i18n).
