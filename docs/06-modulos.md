# Módulos — especificación funcional

Detalle de cada módulo: qué hace el público, qué gestiona el admin y notas clave. Ver datos en [03-modelo-de-datos.md](03-modelo-de-datos.md).

---

## Noticias
**Público:** listado con filtros por categoría/tag, detalle con galería/video/podcast, compartir en redes, comentarios (moderados), relacionadas, breaking news destacada, SEO (metadata + OpenGraph por nota).
**Admin (ADMIN/EDITOR):** CRUD con editor de contenido, portada y galería (UploadThing), categorías/tags, flags `featured`/`breaking`, estado DRAFT/PUBLISHED, `publishedAt`, SEO por nota, moderación de comentarios.
**Notas:** slug único; `views` para analytics; destacadas alimentan la landing.

## Eventos
**Público:** listado por estado (Próximamente/En vivo/Finalizado), detalle con lugar+mapa, galería, videos, sponsors, artistas, conductores, cobertura. Botón **Solicitar presupuesto**.
**Admin:** CRUD, cambio de estado, asociación de sponsors/media, geolocalización (lat/lng).
**Notas:** el estado puede derivarse de fechas o setearse manualmente (LIVE).

## Presupuestos (Quote Requests)
**Público:** formulario con servicios seleccionables (Internet, Streaming, Fotos, Videos/Reels, Conductor/Animador, Publicidad, Redes, Community Manager, Entrevistas, Cobertura Periodística) + lugar, días, horarios, detalles.
**Admin:** bandeja con estados (Nueva/En revisión/Presupuestada/Cerrada), ver detalle, marcar estado.
**Notas:** al crear → email a admin (Resend). Puede vincularse a un `Event`.

## Publicidad — Paquetes y Contratación
**Público / Cliente:** ver paquetes y precios; contratar → completar título/descripción/redes → subir logo e imágenes → informar pago.
**Admin:** CRUD de paquetes y precios (mensual/semanal/día); gestionar contratos; aprobar/rechazar; **crear publicidad sin solicitud** (venta de palabra); definir vigencia (inicio/fin).
**Flujo:** DRAFT → PENDING → (admin) ACTIVE / REJECTED → EXPIRED por fecha.
**Precios base:** Radio L–V 8–11 $30.000 · Fútbol $15.000 · Streamings semanales $30.000 · Paquete completo $60.000 (todos editables, mensuales por defecto).

## Pagos (manual)
**Cliente:** registrar pago (monto, método TRANSFER/CASH, fecha, **comprobante**), ver histórico y estado.
**Admin:** ver pagos pendientes, **aprobar/rechazar** con nota; al resolver → email al cliente.
**Notas:** sin pasarela por ahora; campo reservado para Mercado Pago/tienda a futuro.

## Sponsors
**Público:** grilla/marquee de logos ("confían en nosotros"), link a sitio/redes; registrar clicks/impresiones.
**Admin:** CRUD (logo, descripción, redes, sitio, paquete, vigencia, estado), métricas.

## Banners
**Público:** render según `placement` (home, noticias, eventos, sidebar, footer, header, popup, entre notas, landing); registrar clicks/impresiones.
**Admin:** CRUD con ubicación, vigencia, activo/inactivo, orden.

## Radio
**Público:** programación (grilla semanal), conductores, programas, horarios, invitados, programas anteriores, podcasts, repeticiones.
**Admin:** CRUD de programas y horarios (`RadioProgram` / `RadioSchedule`).
**Notas:** reproductor placeholder al inicio; transmisión propia = backlog.

## Streaming
**Público:** embed de YouTube y/o **Facebook Live** (`StreamPlayer`): con ambas plataformas
cargadas muestra pestañas para elegir; con una sola, el player directo.
**Admin (`/admin/radio/streaming`):** ID de YouTube y/o URL del vivo de Facebook (link público,
Compartir → Copiar enlace; se embebe con `plugins/video.php`, sin API key), con vista previa de
ambas. Al menos una plataforma es obligatoria.
**Notas:** el video de Facebook debe ser público (si no, el embed muestra «contenido no
disponible»). Transmisión propia desde la plataforma = backlog.

## Galería / Videos / Podcast
Media reutilizable (`MediaItem`) asociable a noticias/eventos o standalone. Admin sube y organiza; público navega.

## Contacto
**Público:** formulario (nombre, email, teléfono, asunto, mensaje) → `ContactMessage`.
**Admin:** bandeja, marcar leído, (opcional) email de aviso.

## Configuración / Settings
**Admin (ADMIN):** logo, título, descripción, tipografías, paleta, modo claro/oscuro, navbar, footer, redes, dirección, email, teléfono, Google Maps, SEO/OpenGraph, favicon, loader, animaciones. Persistido en `SiteSetting`.
**Notas:** datos/contacto/SEO editables en Fase 8; colores/tipografías (theme-engine) en Fase 9.

### Identidad de marca (Fase 12.4)
El **nombre del proyecto es configurable** desde `/admin/configuracion` (campo "Nombre"): hoy es
"Viva La Mañana", mañana puede ser "Viva La Radio" — se actualiza en navbar, footer, hero, panel
admin, metadata SEO y todos los textos que lo mencionan. No hardcodear el nombre en componentes
nuevos: recibirlo por prop (`brandName`) o leer `getSiteConfig()`.

Imágenes de marca (subida en Configuración → Identidad, endpoint `brandAsset`, solo ADMIN):
- **Logo** (`logoUrl`): cuadrado, PNG con fondo transparente, **512×512 px recomendado**, máx. 4 MB.
  Se muestra en navbar, footer, hero ("al aire") y sidebar del panel. Vacío → ícono Radio por defecto.
- **Portada** (`coverUrl`): apaisada **16:9, 1920×1080 px recomendado**, JPG/PNG, máx. 4 MB.
  Se muestra como imagen principal del hero de la landing. Vacío → card "al aire" sola.

A futuro: favicon/OG image derivados del logo, y variantes de logo por tema (claro/oscuro).

## CMS de Landing
**Admin:** habilitar/deshabilitar y (a futuro) reordenar secciones; editar textos/CTAs de cada sección. Flags en `SiteSetting`.

## PWA / App instalable
**Público:** el sitio es una PWA instalable — sección "Llevá [marca] con vos" en la landing
(`components/pwa/install-app.tsx`): botón de instalación real en Chrome/Edge (desktop y Android,
vía `beforeinstallprompt`) e instrucciones paso a paso en iOS Safari (Compartir → Agregar a
inicio). Se auto-oculta si ya está instalada o el navegador no lo soporta.
**Assets:** íconos PNG 192/512 (+ maskable + `apple-touch-icon`) generados desde
`public/icon.svg` con `node scripts/gen-icons.mjs` (regenerar si cambia el logo). Manifest en
`app/manifest.ts`; service worker conservador (`public/sw.js`, solo fallback offline con
`offline.html`) registrado en producción.
**Notas:** la instalabilidad requiere HTTPS (o localhost). Si cambia la marca, actualizar
nombre en `app/manifest.ts` (es build-time, no lee `SiteConfig`).

## Analytics (Fase 10)
**Admin:** usuarios, visitas, noticias/eventos/sponsors más vistos, CTR publicidad, ingresos, conversiones, ventas, presupuestos, clientes nuevos (Tremor/Recharts).

## Auditoría / Logs (Fase 10)
**Admin:** `AuditLog` de acciones sensibles (quién, qué, cuándo).

## Usuarios / Roles
**Admin:** CRUD de usuarios, asignación de rol (ADMIN/EDITOR/CLIENTE), ver perfiles de cliente.

## Tienda (preparada, inactiva)
Modelos y UI base (productos, categorías, stock, pedidos, cupones, envíos, facturas, pago manual). Detrás de feature flag; activación y Mercado Pago = futuro.
