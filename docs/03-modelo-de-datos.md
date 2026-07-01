# Modelo de datos (Prisma / Neon PostgreSQL)

> Esquema inicial de referencia. Se implementa por fases (no todo en la Fase 2). Sirve como diseño objetivo; ajustar nombres/campos al codear consultando los docs de Prisma vigentes.

## Enums

```prisma
enum Role            { ADMIN EDITOR CLIENTE VISITANTE }
enum ContractStatus  { DRAFT PENDING ACTIVE REJECTED EXPIRED }
enum BillingCycle    { DAILY WEEKLY MONTHLY }
enum PaymentMethod   { TRANSFER CASH }        // MERCADO_PAGO a futuro
enum PaymentStatus   { PENDING APPROVED REJECTED }
enum BannerPlacement { HOME NEWS EVENTS SIDEBAR FOOTER HEADER POPUP INLINE LANDING }
enum ContentStatus   { DRAFT PUBLISHED }
enum EventStatus     { UPCOMING LIVE FINISHED }
enum QuoteStatus     { NEW IN_REVIEW QUOTED CLOSED }
enum CreativeType    { LOGO IMAGE }
enum SponsorStatus   { ACTIVE INACTIVE EXPIRED }
enum MediaType       { IMAGE VIDEO AUDIO PODCAST }
```

## Núcleo de usuarios

- **User** — `id`, `clerkId` (unique), `email` (unique), `name`, `role: Role`, `createdAt`, `updatedAt`. Relaciones: `clientProfile?`, `news[]` (como autor), `auditLogs[]`.
- **ClientProfile** — `id`, `userId` (unique), `company`, `phone`, `taxId?`, `notes?`. Datos comerciales del cliente. Relación: `contracts[]`.

## Publicidad

- **Package** — `id`, `name`, `slug`, `description`, `priceMonthly`, `priceWeekly?`, `priceDaily?`, `features: String[]`, `active`, `order`. Precios en enteros (centavos o pesos, definir; sugerido: pesos enteros).
- **AdContract** — `id`, `clientId?` (null si lo crea ADMIN sin cliente), `packageId`, `status: ContractStatus`, `billingCycle: BillingCycle`, `startDate?`, `endDate?`, `title`, `description`, `socials: Json`, `createdAt`. Relaciones: `creatives[]`, `payments[]`.
- **Creative** — `id`, `contractId`, `type: CreativeType`, `url`, `alt?`, `order`.
- **Payment** — `id`, `contractId`, `amount`, `method: PaymentMethod`, `status: PaymentStatus`, `proofUrl?`, `paidAt?`, `reviewedById?`, `reviewedAt?`, `notes?`, `createdAt`. (Campo `orderId?` reservado para la tienda futura.)

## Sponsors y banners

- **Sponsor** — `id`, `name`, `logoUrl`, `description?`, `website?`, `socials: Json`, `packageId?`, `startDate?`, `endDate?`, `status: SponsorStatus`, `clicks` (default 0), `impressions` (default 0), `order`.
- **Banner** — `id`, `imageUrl`, `link?`, `placement: BannerPlacement`, `active`, `startDate?`, `endDate?`, `clicks` (0), `impressions` (0), `order`.

## Contenido editorial

- **News** — `id`, `title`, `slug` (unique), `excerpt`, `content` (rich text/markdown), `coverUrl?`, `authorId`, `status: ContentStatus`, `featured` (bool), `breaking` (bool), `views` (0), `publishedAt?`, `seo: Json`, `videoUrl?`, `podcastUrl?`, timestamps. Relaciones M:N: `categories[]`, `tags[]`; 1:N: `gallery: MediaItem[]`, `comments[]`.
- **Category** — `id`, `name`, `slug` (unique). M:N con News.
- **Tag** — `id`, `name`, `slug` (unique). M:N con News.
- **Comment** — `id`, `newsId`, `authorName`, `authorEmail?`, `body`, `approved` (bool), `createdAt`. (Moderable.)

## Eventos

- **Event** — `id`, `name`, `slug` (unique), `description`, `venue?`, `lat?`, `lng?`, `startsAt`, `endsAt?`, `status: EventStatus`, `coverUrl?`, `views` (0), timestamps. Relaciones: `gallery: MediaItem[]`, `sponsors: Sponsor[]` (M:N), `artists[]`, `hosts[]` (pueden ser strings o entidades simples).
- **QuoteRequest** — `id`, `name`, `contact` (email/tel), `services: QuoteService[]` (o `Json`), `venue`, `dates`, `schedule`, `details`, `status: QuoteStatus`, `eventId?`, `createdAt`.
  - Servicios: Internet, Streaming, Fotos, Videos/Reels, Conductor/Animador, Publicidad, Redes, Community Manager, Entrevistas, Cobertura Periodística. (Modelar como enum `QuoteService` o tabla de opciones editable.)

## Radio

- **RadioProgram** — `id`, `name`, `description?`, `imageUrl?`, `hosts: String[]`, `active`, `order`. Relación: `schedules[]`.
- **RadioSchedule** — `id`, `programId`, `dayOfWeek` (0-6), `startTime`, `endTime`, `isRerun` (bool). Para programación/horarios/repeticiones.

## Media reutilizable

- **MediaItem** — `id`, `type: MediaType`, `url`, `alt?`, `caption?`, `order`, más FKs opcionales (`newsId?`, `eventId?`) para galerías. Sirve para Galería, Videos, Podcast, Audio.

## Configuración y sistema

- **SiteSetting** — `id`, `key` (unique), `value: Json`, `updatedAt`. Para config global (contacto, redes, SEO, tema) y **flags de secciones de landing** (ej: `{ "landing.sections": { "hero": true, "testimonials": false } }`).
- **ContactMessage** — `id`, `name`, `email`, `phone?`, `subject?`, `message`, `read` (bool), `createdAt`.
- **AuditLog** — `id`, `userId?`, `action`, `entity`, `entityId?`, `meta: Json`, `createdAt`.

## Tienda (preparada, inactiva)

- **Product** — `id`, `name`, `slug`, `description`, `price`, `stock`, `active`, `images: String[]`. Relación: `category?`.
- **ProductCategory** — `id`, `name`, `slug`.
- **Order** — `id`, `clientId?`, `status`, `total`, `paymentMethod: PaymentMethod`, `createdAt`. Relación: `items[]`.
- **OrderItem** — `id`, `orderId`, `productId`, `qty`, `unitPrice`.
- **Coupon** — `id`, `code` (unique), `discountPct?`, `discountAmount?`, `active`, `expiresAt?`.

## Notas de diseño

- **Slugs** únicos para todo lo público (News, Event, Package, Product) para URLs limpias y SEO.
- **Contadores** (`views`, `clicks`, `impressions`) para el módulo de Analytics (Fase 10).
- **`Json`** para estructuras flexibles (socials, seo, settings) y evitar sobre-normalizar al inicio.
- **Timestamps** (`createdAt`/`updatedAt`) en todas las entidades relevantes.
- Definir **índices** en `slug`, `status`, `publishedAt`, `startsAt` y FKs frecuentes.
- Migraciones con `prisma migrate` usando `DIRECT_URL` de Neon.
