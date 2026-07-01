# Visión y Especificación (el "prompt" preciso)

> Este documento es la especificación funcional completa y precisa del producto. Sirve como fuente de verdad de requisitos y como "prompt" reutilizable para generar/ampliar el sistema.

## Resumen ejecutivo

Construir una plataforma web **mobile-first** para el medio **Viva La Mañana** (radio + streaming + cobertura de eventos + publicidad). Dos mundos: **sitio público** (marketing + contenido) y **panel admin** (CMS). Casi todo el contenido debe ser editable desde el admin, y las secciones deben poder habilitarse/deshabilitarse. Diseño con identidad visual Glassmorphism + Neumorphism + Aurora gradients + Cyberpunk muy suave, con modo claro/oscuro, priorizando siempre la experiencia en celular.

---

## 1. Roles y permisos

- **ADMIN**: control total (contenido, módulos, usuarios, pagos, settings, tema).
- **EDITOR / Periodista**: crea/edita noticias, eventos, galerías, podcasts. No accede a usuarios, pagos ni configuración.
- **CLIENTE**: contrata paquetes de publicidad, carga datos y creatividades, informa pagos, solicita presupuestos de eventos.
- **VISITANTE**: público no autenticado; navega contenido, escucha radio, ve streaming, envía formularios de contacto/presupuesto.

---

## 2. Sitio público

### 2.1 Secciones de la Landing
Todas habilitables/deshabilitables y (a futuro) reordenables desde el admin:

1. **Hero** — impacto visual + CTAs (Escuchar Radio / Ver Streaming / Contratar publicidad).
2. **Qué es Viva La Mañana** — presentación del medio.
3. **Escuchar Radio** — reproductor (placeholder al inicio).
4. **Ver Streaming** — embed de YouTube.
5. **Noticias destacadas** — últimas/destacadas.
6. **Próximos eventos** — agenda.
7. **Cobertura deportiva** — bloque temático (transmisiones de fútbol).
8. **Publicidad / Servicios** — servicios de sponsoreo y costos.
9. **Paquetes** — planes con precios.
10. **Sponsors** — "confían en nosotros" (logos).
11. **Galería** — fotos.
12. **Videos** — reels/clips.
13. **Estadísticas** — contadores (+500 eventos, +300 clientes, +1500 noticias, +200 transmisiones).
14. **Testimonios**.
15. **Formulario de contacto**.
16. **Mapa** — ubicación (Google Maps).
17. **FAQ**.
18. **Footer extenso** — links, redes, datos de contacto.

### 2.2 Módulos de contenido público
- **Noticias**: categorías, etiquetas, autor, fecha, galería, video, podcast/audio, comentarios, compartir, SEO, relacionadas, destacado, breaking news.
- **Eventos**: nombre, lugar, fecha, mapa, galería, videos, sponsors, artistas, conductores, cobertura; estado **Próximamente / En vivo / Finalizado**; botón **Solicitar presupuesto**.
- **Radio**: programación, conductores, programas, horarios, invitados, programas anteriores, podcast, repeticiones.
- **Streaming**: YouTube embebido (a futuro, transmisión propia).
- **Sponsors** (módulo propio): logo, descripción, redes, sitio web, paquete, inicio/fin, estado, clicks, impresiones.
- **Banners**: ubicaciones home, noticias, eventos, sidebar, footer, header, popup, entre notas, landing.

---

## 3. Publicidad y servicios

### 3.1 Servicios (precios mensuales por defecto; también semanal y por día)
| Servicio | Precio |
|----------|--------|
| Sponsor radio L–V 8:00–11:00 | $30.000 / mes |
| Sponsor transmisiones de fútbol | $15.000 / mes |
| Sponsor streamings semanales | $30.000 / mes |
| **Paquete completo** (los 3) | **$60.000 / mes** |

Precios y paquetes **editables desde el admin**. El **ADMIN puede crear publicidades sin solicitud del cliente** (venta "de palabra" que se ejecuta igual).

### 3.2 Flujo de contratación (cliente)
```
Cliente → elige paquete → completa info (título, descripción, redes)
       → sube logo → sube imágenes/creatividades → agrega descripción
       → informa pago (comprobante) → queda PENDIENTE
       → admin aprueba/rechaza → ACTIVA (con vigencia inicio/fin)
```

### 3.3 Pagos (manual por ahora)
- Métodos: **Transferencia** y **Efectivo**.
- El cliente registra un pago (monto, método, fecha, **comprobante subido**) → estado **PENDIENTE**.
- El admin **valida o rechaza** → notificación por email (Resend).
- Histórico de pagos por cliente / contratación.
- (Futuro: integración Mercado Pago.)

---

## 4. Eventos — Solicitar presupuesto

Formulario público con **servicios seleccionables** (checkboxes):
Internet · Streaming · Fotos · Videos/Reels · Conductor/Animador · Publicidad · Redes · Community Manager · Entrevistas · Cobertura Periodística.

Más campos: **lugar** del evento, **días**, **horarios** e **información relevante**.
Genera una **Solicitud de presupuesto** gestionable desde el admin (con estados: Nueva / En revisión / Presupuestada / Cerrada) y aviso por email.

---

## 5. Panel Admin (CMS, Dashboard-First)

Secciones del panel:
Dashboard (KPIs) · Noticias · Eventos · Streaming · Radio · Programación · Sponsors · Publicidad · Paquetes · Solicitudes (presupuestos) · Pagos · Clientes · Usuarios · Roles/Permisos · Galería · Videos · Podcast · Banners · Landing (secciones on/off) · SEO · Configuración · Logs/Auditoría · Tema · Menús/Navbar/Footer · Redes · Analytics.

---

## 6. Configuración global (editable)
Logo · título · descripción · tipografías · paleta · modo claro/oscuro · navbar · footer · redes (WhatsApp, Facebook, Instagram, TikTok, YouTube) · dirección · email · teléfono · Google Maps · SEO / OpenGraph · favicon · loader · animaciones.

> Los datos de contacto/SEO/redes se hacen editables temprano (Fase 8). El tema (colores/tipografías) se hace editable en la Fase 9.

---

## 7. Analytics (módulo a futuro)
Usuarios · visitas · noticias/eventos/sponsors más vistos · CTR de publicidad · ingresos · conversiones · ventas · presupuestos · clientes nuevos.

---

## 8. Tienda (preparada, inactiva)
Productos · categorías · stock · pedidos · pagos (efectivo/transferencia/MercadoPago futuro) · cupones · envíos · facturas. Se modela y se deja lista detrás de un feature flag; se activa a futuro.

---

## 9. Requisitos transversales

**Mobile-first real** (no solo responsive): diseñar primero para celular, luego tablet, luego desktop. Bottom navigation, drawer, gestos, touch-friendly, safe-area, lazy loading, skeletons, animaciones suaves. **PWA-ready**.

**Modo claro/oscuro** en todo el sitio y el admin.

**Identidad visual**: Glassmorphism + Neumorphism + Aurora gradients + microinteracciones (Framer Motion) + **Cyberpunk MUY suave** + Dashboard-First en el admin. Referencias: Apple HIG, Linear, Raycast, Vercel, Stripe. Evitar cyberpunk fuerte para mantener la seriedad de un medio de comunicación. Detalle en [04-design-system.md](04-design-system.md).

**Accesibilidad y performance**: contrastes correctos en ambos modos, imágenes optimizadas (`next/image`), lazy loading, buenos Core Web Vitals.
