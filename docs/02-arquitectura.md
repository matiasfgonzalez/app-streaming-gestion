# Arquitectura

## 1. Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Backend | Server Actions + Route Handlers |
| ORM | Prisma |
| Base de datos | Neon (PostgreSQL serverless) |
| Autenticación | Clerk |
| Validación | Zod |
| Formularios | React Hook Form |
| UI kit | ShadCN/UI |
| Estilos | TailwindCSS v4 |
| Animaciones | Framer Motion |
| Tablas | TanStack Table |
| Gráficos | Tremor / Recharts |
| Uploads | UploadThing (→ Cloudflare R2 a futuro) |
| Emails | Resend |
| Logging | Pino |
| Observabilidad | Sentry |
| Testing | Vitest (unit) + Playwright (e2e) |
| Deploy | Vercel |

> **Next.js 16**: consultar siempre `node_modules/next/dist/docs/01-app/` antes de implementar. Las APIs pueden diferir del conocimiento previo (Server Actions, caching, `params`/`searchParams` async, etc.).

## 2. Estructura de carpetas

> **Nota:** el alias de TypeScript es `@/*` → `./*` (raíz, sin `src/`). Por eso
> `lib/`, `components/`, `server/`, `hooks/` viven a nivel raíz junto a `app/`,
> dando imports limpios tipo `@/components/...`, `@/lib/...`. Esto se decidió en
> Fase 0 para alinear con ShadCN (`components.json`).

```
app/
  (public)/            # sitio público
    layout.tsx         # navbar + bottom-nav + footer públicos
    page.tsx           # landing
    noticias/
    eventos/
    radio/
    sponsors/
    contacto/
  (auth)/              # sign-in / sign-up (Clerk)
  (cliente)/           # portal del cliente (contratar, pagos, presupuestos)
  admin/               # panel CMS (Dashboard-First)
  api/
    webhooks/clerk/    # sync Clerk -> DB
    uploadthing/       # file router
  layout.tsx           # root layout: providers (ThemeProvider), fuentes, metadata
  globals.css          # design tokens Tailwind v4 @theme

lib/
  db.ts                # PrismaClient singleton
  auth.ts              # getCurrentUser(), requireRole(), hasRole()
  uploads.ts           # abstracción de storage (UploadThing hoy, R2 mañana)
  validations/         # Zod schemas (compartidos cliente/servidor)
  utils.ts             # cn() (creado en Fase 0)
server/
  actions/             # Server Actions (mutaciones)
  queries/             # lecturas reutilizables
components/
  ui/                  # ShadCN generado
  glass/               # identidad visual: GlassCard, NeuButton, AuroraBackground, Section
  layout/              # Navbar, BottomNav, MobileDrawer, Footer, nav-links
  sections/            # secciones de landing (Fase 1)
  theme-provider.tsx   # wrapper de next-themes
  theme-toggle.tsx     # toggle claro/oscuro
hooks/
types/

prisma/
  schema.prisma
  seed.ts

components.json        # config ShadCN
prisma.config.ts       # Prisma 7: config CLI (datasource.url para migraciones)
proxy.ts               # (ex middleware.ts) Clerk: protege /admin y /(cliente)
```

> **Prisma 7 / Clerk v7 (notas de versión):**
> - La URL de conexión NO va en `schema.prisma`: va en `prisma.config.ts`
>   (`datasource.url = env("DIRECT_URL")`, usada por migraciones) y en el
>   **driver adapter** (`@prisma/adapter-pg` con `DATABASE_URL`/pooler) en `lib/db.ts`.
> - En Next 16 `middleware.ts` está deprecado → archivo `proxy.ts` (mismo API).
> - Clerk v7 ya no exporta `SignedIn`/`SignedOut`; usar `useUser()` (cliente) o
>   `auth()` (servidor). Sync Clerk→DB por **lazy-sync** en `getCurrentUser`
>   (el webhook queda para cuando haya URL pública).

## 3. RBAC

**Fuente de verdad del rol: la base de datos** (`User.role`), no Clerk. Clerk solo autentica.

**Sincronización Clerk ↔ DB:**
- Webhook de Clerk (`app/api/webhooks/clerk/route.ts`) escucha `user.created` / `user.updated` / `user.deleted` y hace upsert del `User` local (guardando `clerkId`, `email`, `name`). Rol por defecto al registrarse: `CLIENTE` (los VISITANTE no tienen cuenta).
- Verificar la firma del webhook (svix) antes de procesar.

**Helpers (`src/lib/auth.ts`):**
- `getCurrentUser()` → devuelve el `User` local (join por `clerkId` con `auth()` de Clerk) o `null`.
- `requireRole(...roles)` → usar al inicio de Server Actions y páginas protegidas; lanza/redirige si no cumple.
- `hasRole(user, ...roles)` → helper booleano para UI condicional.

**Protección de rutas (`middleware.ts`):**
- `/admin/**` → requiere `ADMIN` o `EDITOR` (el detalle fino por sección se valida en cada action/page).
- `/(cliente)/**` → requiere sesión (rol `CLIENTE` o superior).
- Público → sin restricción.

**Matriz de permisos (resumen):**

| Recurso | ADMIN | EDITOR | CLIENTE |
|---------|:-----:|:------:|:-------:|
| Noticias / Eventos / Galería / Podcast | CRUD | CRUD | — |
| Sponsors / Banners | CRUD | — | — |
| Paquetes / Publicidad | CRUD | — | contratar (propias) |
| Pagos | aprobar/rechazar | — | informar (propios) |
| Presupuestos | gestionar | ver | crear |
| Usuarios / Roles | CRUD | — | — |
| Configuración / Tema / SEO | CRUD | — | — |
| Analytics / Auditoría | ver | — | — |

## 4. Patrón de mutaciones

- **Server Actions** para todos los formularios y CRUD (admin y cliente). Validar con Zod **en el servidor** aunque el form ya valide en cliente.
- **Route Handlers** solo para: webhooks (Clerk), file router (UploadThing) y endpoints públicos que lo requieran.
- Cada Server Action: `requireRole()` → validar input Zod → operar Prisma → `revalidatePath`/`revalidateTag` → devolver resultado tipado.

## 5. Validación

Un único set de Zod schemas en `src/lib/validations/` reutilizado por React Hook Form (cliente, `zodResolver`) y por las Server Actions (servidor). Nunca confiar solo en la validación de cliente.

## 6. Storage / uploads

- MVP: **UploadThing** (`app/api/uploadthing/route.ts` + `src/lib/uploads.ts`).
- Toda subida pasa por el helper `uploads.ts` para poder migrar a **Cloudflare R2** sin tocar los llamadores.
- Guardar en DB la **URL** del archivo (y metadata), no el binario.

## 7. Emails

- **Resend** para notificaciones: pago aprobado/rechazado, nueva solicitud de presupuesto (a admin), confirmaciones al cliente.
- Plantillas en `src/server/emails/`. Env: `RESEND_API_KEY`.

## 8. Configuración / feature flags

- Tabla `SiteSetting` (key/value JSON) para config global y flags de secciones de landing.
- Feature flag de **Tienda** (inactiva por defecto).

## 9. Variables de entorno (esperadas)

```
DATABASE_URL=                  # Neon (pooled)
DIRECT_URL=                    # Neon (direct, para migraciones)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
UPLOADTHING_TOKEN=
RESEND_API_KEY=
SENTRY_DSN=                    # opcional hasta Fase 10
```

## 10. Observabilidad y testing

- **Pino** para logs estructurados en el servidor.
- **Sentry** desde Fase 10.
- **Vitest** para Server Actions y validaciones (desde Fase 3).
- **Playwright** para flujos críticos: login, contratar paquete, solicitar presupuesto.
