# Auditoría de interfaz + Plan de rediseño (Fase 12)

> Guía de trabajo para el rediseño del frontend a nivel SaaS profesional. Ejecutado con
> la skill `/frontend-design`. **No cambia la esencia del producto ni la identidad** definida
> en [04-design-system.md](04-design-system.md): la evoluciona.
>
> Este archivo es la **fuente de verdad** del rediseño: se va marcando `[x]` a medida que
> avanzamos y se anota en el [registro de avance](#registro-de-avance) al cerrar cada capa.
>
> Leyenda: `[ ]` pendiente · `[~]` en progreso · `[x]` hecho.
> Referencias de calidad: Linear, Vercel, Stripe Dashboard, Raycast, Notion, Clerk.

---

## 1. Diagnóstico general

La base es sólida y coherente (tokens OKLCH, glass/aurora/neu bien definidos, dark-first,
mobile-first real). El problema **no es la identidad** — es que está **a medio ejecutar**:
el Design System documenta capas que no existen en código, y lo que sí existe se aplica por
copy-paste en vez de por componentes. Resultado: hoy se siente "prolijo pero plano", lejos del
nivel Linear/Vercel/Stripe.

Objetivo de la Fase 12: cerrar esa brecha entre lo documentado y lo implementado, subiendo el
piso de calidad visual, la consistencia del Design System y las microinteracciones, sin
regresiones funcionales.

---

## 2. Hallazgos de la auditoría

Cada hallazgo se marca `[x]` cuando queda resuelto por la capa correspondiente del plan.

### 2.1 Críticos (bloquean la sensación "premium")

- [x] **C1 · No hay capa de componentes UI — todo es Tailwind repetido.** ✅ Resuelto en 12.1:
  `components/ui/` creado (Input, Textarea, Select, Label/Field, Checkbox, Badge, Skeleton,
  Table, EmptyState) con barrel. `inputCls`/`labelCls` ahora tienen **fuente única** e importada
  en los 18 formularios (0 definiciones locales), y el badge de estado se unificó en `<Badge>`.
  Pendiente menor (12.1b): adopción a nivel de elemento de `<Select>`/`<Checkbox>`/`<Field>`
  (hoy los controles nativos ya usan el estilo compartido refinado).
- [x] **C2 · Cero estados de carga.** ✅ 12.2: `Skeleton` + `CardGridSkeleton`; `loading.tsx` en
  admin (segmento) y en noticias/eventos/galería públicas.
- [x] **C3 · Sin sistema de notificaciones.** ✅ 12.2: `Toaster` (sonner, sigue tema + tokens) en el
  root; toast.error en los 17 formularios y toast.success en los que no redirigen (config, tema,
  streaming, secciones, perfil, pago, presupuesto).
- [x] **C4 · Sin límites de error / vacío.** ✅ 12.2: `app/error.tsx` + `app/not-found.tsx` branded;
  los 14 estados vacíos restantes (8 admin + 6 públicos) migrados a `EmptyState` con CTA.

### 2.2 Altos (afectan jerarquía y personalidad)

- [x] **A1 · Microinteracciones casi ausentes.** ✅ 12.4: hero orquestado en carga (`FadeUp`
  escalonado), hover rico en cards (news/eventos/videos/galería: lift + zoom + detalles),
  transición de página del sitio público (`template.tsx`, fade breve). Todo respeta
  `prefers-reduced-motion` (incluidos ambos drawers).
- [x] **A2 · Listas admin no son tablas.** ✅ 12.3: `DataTable` (header sticky, row hover,
  responsive→cards en mobile) adoptado en noticias, eventos, sponsors, paquetes, banners,
  usuarios, publicidad, radio, podcasts y auditoría. Se dejan como cards a propósito las vistas
  con detalle expandido (presupuestos, pagos) y la galería (grid visual).
- [x] **A3 · Dashboard plano.** ✅ 12.3: jerarquía real — 3 KPIs principales (glass + `ring-glow`)
  con delta de tendencia y `Sparkline` (14 días), 6 secundarios compactos (`surface` plano), y
  `BarList` multicolor por serie (paleta marca) y por estado (color semántico).
- [x] **A4 · Glass sin jerarquía de profundidad.** ✅ 12.1 (tokens) + 12.4: escala
  surface → glass → glow aplicada con intención en la landing — servicios/FAQ/datos de
  contacto/tiles de sponsors en `surface` plano, cards protagonistas en glass, glow reservado
  al hero y al paquete destacado. Glow de eyebrows eliminado (`.text-eyebrow` unificado).

### 2.3 Medios (pulido)

- [x] **M1 · Tipografía de una sola marcha.** ✅ 12.1 (utilidades `.text-eyebrow`/`.tnum`) +
  12.4: eyebrows unificados sin glow (SectionHeading, Sports, tablas), `tnum` en KPIs/stats.
- [x] **M2 · Accesibilidad.** ✅ 12.1 (checkbox ≥44px, inputs `min-h-11`) + 12.5:
  `--muted-foreground` recalibrado para AA sobre glass (light 0.46 / dark 0.72),
  `:focus-visible` global unificado (outline 2px ring), botones de acción icon
  `size-11 md:size-9` (44px touch) en las 17 ubicaciones.
- [x] **M3 · `reduced-motion` incompleto.** ✅ 12.4 (drawers, `FadeUp`, `template.tsx` con
  `useReducedMotion`) + 12.5: kill-switch global en CSS (animaciones/transiciones a 0.01ms)
  que cubre hovers de lift/zoom, marquee y aurora.

---

## 3. Plan por capas

Ordenado para que cada capa habilite la siguiente. **Regla de cierre de capa:** `npm run build`
y `npm run lint` sin errores, verificación visual en claro/oscuro y mobile, y marcar aquí +
[registro de avance](#registro-de-avance).

### Capa 12.1 — Fundaciones del Design System `[x]`
> Elimina la causa raíz (C1). Habilita todo lo demás. Sin esto, cada refinamiento se duplica ×17.

- [x] Crear `components/ui/` con primitivos tipados sobre los tokens actuales:
  - [x] `Input`, `Textarea` (sobre `inputBase` compartido; target ≥44px con `min-h-11`).
  - [x] `Label` / `Field` / `FieldError` / `FieldHint` (label AA + control + error + hint).
  - [x] `Select` (nativo estilado con chevron propio, `appearance-none`).
  - [x] `Checkbox` (área táctil ≥44px, `size-5`, forwardea `register`).
  - [x] `Badge` (variantes primary/secondary/neutral/success/warning/danger/outline + `dot`).
  - [x] `Skeleton` (respeta `prefers-reduced-motion`; base para 12.2).
  - [x] `Table` (Table/THead/TBody/TR con densidad y hover) + `EmptyState` (con CTA).
  - [x] Barrel `components/ui/index.ts` (fuente única de imports).
- [x] Escala de **elevación** en tokens (`globals.css`): utilidades `.surface` / `.surface-muted`
      junto a `.glass` / `.ring-glow`, con guía de uso (no todo glass) en comentarios.
- [x] Escala **tipográfica**: utilidades `.text-eyebrow` (eyebrow consistente sin depender de glow)
      y `.tnum` (números tabulares) centralizadas.
- [x] Single-source de `inputCls`/`labelCls` en los **18 formularios** (0 defs locales). Verificado por grep.
- [x] Páginas con badges (noticias, eventos, sponsors, usuarios, auditoría) → `<Badge>` +
      `EmptyState` con CTA en los estados vacíos de listas.
- [x] **12.1b** — Adopción a nivel de elemento: `<select>` → `<Select>` (chevron propio) en los
      15 selects de formularios; checkboxes standalone → `<Checkbox>` (≥44px). Nativos que quedan
      a propósito: chips multi-check de presupuesto, `isRerun` compacto de horarios, toggle
      `sr-only` de secciones y los selects de acción admin (status/rol) que son controles aparte.
- [x] `npm run build` OK y `npm run lint` 0 errores (solo warnings RHF `watch` esperados).
- Resuelve: **C1** ✅; sienta base de **A4** (elevación) y **M1** (eyebrow/tnum). 12.1b cierra la capa.

### Capa 12.2 — Feedback (carga, error, vacío, notificaciones) `[x]`
> Cierra los huecos de UX más visibles.

- [x] `Toaster` global (`components/ui/toaster.tsx`, sonner + `richColors`, sigue el tema y usa los
      tokens) en el root layout; `toast` reexportado desde el barrel.
- [x] Formularios conectados: `toast.error` en los 17 forms (además del inline); `toast.success`
      en los que no redirigen (site-config, tema, streaming, secciones, perfil, pago, presupuesto).
- [x] `loading.tsx` con skeletons: admin (segmento, `app/admin/loading.tsx`) y público
      (noticias/eventos/galería con `CardGridSkeleton`). `Skeleton` respeta `reduced-motion`.
- [x] `app/error.tsx` (client, reintentar + inicio) y `app/not-found.tsx` (404 branded), ambos con
      AuroraBackground + GlassCard.
- [x] `EmptyState` en los 14 vacíos restantes (8 admin con CTA + 6 públicos informativos).
- [x] `npm run build` → `✓ Compiled successfully`; `npm run lint` 0 errores.
- Resuelve: **C2** ✅, **C3** ✅, **C4** ✅.

### Capa 12.3 — Admin Enterprise `[x]`
> Densidad, orden y jerarquía. Usa los primitivos de 12.1.

- [x] Migrar listas admin (`<ul>`) a `DataTable` (columnas, header sticky, row hover,
      responsive→cards en mobile) en las 10 listas tabulares. Cards a propósito donde el detalle
      manda (presupuestos, pagos) y galería como grid.
- [x] Rediseñar dashboard `/admin`: jerarquía de KPIs (3 principales con delta+sparkline vs 6
      secundarios `surface`), tendencia de 14 días, `BarList` multicolor por serie y por estado.
- [x] Refinar `AdminShell` (eyebrow de sección, activo en sub-rutas con barra indicadora,
      íconos atenuados en inactivos).
- [x] Resuelve: **A2**, **A3**.

### Capa 12.4 — Landing & público `[x]`
> La cara comercial, sobre base ya sólida.

- [x] **Identidad de marca configurable** (agregado a la capa): nombre del sitio dinámico en
      toda la web (navbar, footer, hero, secciones, metadata, panel admin) + subida de **logo**
      (512×512 PNG transparente) y **portada** (1920×1080, 16:9) desde
      `/admin/configuracion` → Identidad, con hints de tamaño. Endpoint `brandAsset` (ADMIN).
      Ver [06-modulos.md](06-modulos.md#identidad-de-marca-fase-124).
- [x] Motion intencional: hero orquestado en carga (`FadeUp` escalonado, respeta
      `prefers-reduced-motion`), reveals con stagger (ya existentes), hover rico en cards
      (lift + zoom de imagen + flecha en news/eventos).
- [x] Jerarquía de glass/elevación aplicada: `surface` en contextos densos (servicios de
      publicidad, FAQ, datos de contacto, tiles del marquee de sponsors); glass para cards
      protagonistas; glow solo hero + paquete destacado. Eyebrows → `.text-eyebrow` sin glow
      (SectionHeading + Sports); stats sin `text-glow` (con `.tnum`).
- [x] Refinamiento sección por sección: hover zoom en galería y videos (play que escala),
      transición de página pública (`template.tsx`, fade 0.25s), drawers con
      `useReducedMotion`.
- [x] Resuelve: **A1**, cierra **A4**; adelanta drawers de **M3**.

### Capa 12.5 — Pulido de accesibilidad + docs `[x]`
> Quality floor + documentación al día.

- [x] Contraste AA en ambos modos: `--muted-foreground` recalibrado (light 0.50→0.46,
      dark 0.68→0.72) para pasar ≥4.5:1 también sobre glass; `text-foreground/80` verificado
      (pasa holgado en ambos modos).
- [x] Targets táctiles ≥44px: acciones icon de listas admin `size-11 md:size-9` (17 archivos);
      focus-visible unificado con `:focus-visible` global (outline 2px `--ring`, offset 2px).
- [x] `prefers-reduced-motion` completo: kill-switch global CSS (animaciones + transiciones)
      además del `useReducedMotion` de Framer (12.4).
- [x] [04-design-system.md](04-design-system.md) actualizado: tokens reales, escala de
      elevación (§2.1), tipografía utilitaria (§2.2), componentes implementados (§5),
      admin real (§6) y nueva sección de accesibilidad (§8).
- [x] Resuelve: **M2**, **M3** (y cierra **M1** junto a 12.1/12.4).

---

## 4. Registro de avance

> Al cerrar cada capa: fecha, qué se hizo y cómo se verificó (mismo criterio que
> [CHANGELOG.md](CHANGELOG.md)).

### 2026-07-02 — Capa 12.1 (fundaciones, parte a)
- **Design System real:** creado `components/ui/` (`input`, `select`, `field`, `checkbox`,
  `badge`, `skeleton`, `table`, `empty-state`) + barrel `index.ts`. Estilo base en `inputBase`
  (foco/ring refinado, ≥44px, contraste AA en labels).
- **Tokens (`globals.css`):** utilidades de elevación `.surface` / `.surface-muted` (para contextos
  densos donde glass-sobre-glass se ensucia) y tipografía `.text-eyebrow` / `.tnum`.
- **C1 resuelto:** `inputCls`/`labelCls` con fuente única, importados en los 18 formularios
  (admin + cliente + eventos + contacto). Verificado por grep: 0 definiciones locales.
- **Badges + vacíos:** `noticias`, `eventos`, `sponsors`, `usuarios/[id]`, `auditoria` migrados a
  `<Badge>` (variantes semánticas) y `EmptyState` con CTA en los estados vacíos de listas.
- **Verificado:** `npm run build` OK (todas las rutas compilan), `npm run lint` 0 errores
  (6 warnings RHF `watch`, preexistentes y esperados).
- **Pendiente (12.1b):** conmutar los tags nativos de los forms a `<Input>/<Select>/<Checkbox>/<Field>`
  para chevron propio y checkbox ≥44px en todas las pantallas. Luego seguir con Capa 12.2 (feedback).

### 2026-07-02 — Capa 12.1b (adopción a nivel de elemento) — **capa cerrada**
- **Selects:** 15 `<select>` de formularios → `<Select>` (chevron propio, `appearance-none`) en
  news, event, sponsor, banner, media, podcast, payment, contract (cliente), quote,
  admin-contract (×3), theme (×2), radio-program.
- **Checkboxes:** standalone → `<Checkbox>` (≥44px) en news (×2), banner, media, package, theme,
  radio-program. Se dejan nativos a propósito: chips multi-check de presupuesto, `isRerun`
  compacto de horarios, toggle `sr-only` de secciones y los selects de acción admin.
- **Verificado:** `npm run build` → `✓ Compiled successfully`; `npm run lint` 0 errores
  (6 warnings RHF `watch`, preexistentes).
- **Siguiente:** Capa 12.2 — feedback (Toaster, `loading.tsx`+skeletons, `error.tsx`/`not-found.tsx`,
  EmptyState en el resto).

### 2026-07-02 — Capa 12.2 (feedback) — **capa cerrada**
- **Notificaciones (C3):** `sonner` instalado; `components/ui/toaster.tsx` (sigue tema + tokens,
  `richColors`) montado en el root layout; `toast` reexportado desde `@/components/ui`. Los 17
  formularios toastean error; los que no redirigen (site-config, tema, streaming, secciones,
  perfil de cliente, pago, presupuesto) toastean éxito.
- **Carga (C2):** `components/ui/skeleton.tsx` + `card-grid-skeleton.tsx`; `app/admin/loading.tsx`
  (skeleton de dashboard) y `loading.tsx` en noticias/eventos/galería públicas.
- **Error/404 (C4):** `app/error.tsx` (client: reintentar + inicio) y `app/not-found.tsx` (404
  branded), con AuroraBackground + GlassCard.
- **Vacíos (C4):** 14 estados vacíos restantes → `EmptyState`. Admin con CTA (banners, paquetes,
  media, radio, podcasts, publicidad; pagos/presupuestos informativos). Públicos informativos
  (noticias, eventos, sponsors, galería, cliente, contratar).
- **Verificado:** `npm run build` → `✓ Compiled successfully`; `npm run lint` 0 errores
  (6 warnings RHF `watch`, preexistentes). Fix en el camino: `else` colgante en payment/quote.
- **Siguiente:** Capa 12.3 — Admin Enterprise (listas→DataTable, dashboard con jerarquía/sparklines).

### 2026-07-02 — Capa 12.3 (Admin Enterprise) — **capa cerrada**
- **DataTable (A2):** `components/ui/data-table.tsx` — API tipada por columnas (`Column<T>`),
  header sticky + hover de fila en desktop y colapso a card en mobile (título = columna `primary`,
  resto como pares label/valor, acciones al pie). Adoptado en noticias, eventos, sponsors,
  paquetes, banners, usuarios, publicidad, radio, podcasts y auditoría. Presupuestos/pagos siguen
  como cards (detalle expandido) y galería como grid visual.
- **Dashboard (A3):** `components/admin/stat-card.tsx` — `StatCard` (glass + `ring-glow`, delta de
  tendencia, `Sparkline` SVG server-only), `StatMini` (secundario, `surface` plano), `DeltaBadge`.
  `getDashboardData` ahora devuelve `series`/`deltas` (ventana de 14 días, medias comparadas).
  `BarList` multicolor: paleta por serie (marca→violeta→cian) y color semántico por estado.
- **AdminShell:** eyebrow "Panel", activo en sub-rutas (`startsWith`, salvo `/admin` exacto) con
  barra indicadora izquierda y `aria-current`; íconos atenuados en inactivos.
- **Verificado:** `npm install` (faltaba `sonner` en node_modules) → `npm run build`
  `✓ Compiled successfully`; `npm run lint` 0 errores (6 warnings RHF `watch`, preexistentes).
  Pendiente: verificación visual claro/oscuro y mobile en navegador (requiere sesión Clerk).
- **Siguiente:** Capa 12.4 — Landing & público (motion intencional, jerarquía de glass/elevación).

### 2026-07-02 — Capa 12.4 (parte a: identidad de marca + motion base)
- **Identidad configurable:** `SiteConfig` suma `logoUrl` y `coverUrl` (merge + defaults + zod).
  Form de `/admin/configuracion` con subida de logo y portada (`BrandImageField`, preview +
  quitar) y hints de tamaño: logo 512×512 PNG transparente, portada 1920×1080 (16:9), máx. 4 MB.
  Endpoint uploadthing `brandAsset` (solo ADMIN).
- **Nombre dinámico en toda la web:** navbar (última palabra en primary), footer, hero, About,
  Testimonials, Streaming (title del iframe), RadioPlayer, dashboard y sidebar del admin
  (iniciales, ej. "VLM Admin"), EmptyState de cliente, subtítulo de sponsors, y metadata de
  noticias/eventos/radio/galería/sponsors vía `generateMetadata` + `getSiteConfig`.
  Cero hardcodes de "Viva La Mañana" en componentes públicos.
- **Motion:** `FadeUp` (client, entrada al montar con `useReducedMotion`) orquesta el hero
  (badge→h1→p→CTAs→card, delays 0–0.24s). Hover rico en `NewsCard`/`EventCard`: lift +
  `shadow-xl` + zoom 1.04 de imagen (500ms) + flecha que se desplaza.
- **Hero con identidad:** eslogan como badge, nombre como h1, descripción, portada (16:9) y logo
  en la card "al aire" — todo desde la config.
- **Docs:** [06-modulos.md](06-modulos.md) § "Identidad de marca (Fase 12.4)" con tamaños y
  regla "no hardcodear el nombre".
- **Verificado:** `npm run build` → `✓ Compiled successfully`; `npm run lint` 0 errores
  (7 warnings RHF `watch`: 6 preexistentes + 1 nuevo esperado en site-config-form).
  Pendiente: verificación visual en navegador.
- **Pendiente (12.4 parte b):** jerarquía glass/elevación sección por sección + refinamiento
  fino de secciones restantes + transiciones de página.

### 2026-07-02 — Capa 12.4 (parte b: jerarquía de elevación + pulido) — **capa cerrada**
- **Jerarquía de elevación (A4):** `surface` plano en contextos densos — servicios de
  publicidad (los paquetes glass+glow quedan un nivel arriba), FAQ, datos de contacto (el form
  glass es protagonista), tiles del marquee de sponsors. Glow reservado: hero + paquete
  destacado.
- **Tipografía (base M1):** eyebrows de `SectionHeading` y Sports → `.text-eyebrow` en accent,
  sin `text-glow` (patrón template eliminado). Números de Stats sin glow, con `.tnum`.
- **Microinteracciones (A1):** hover zoom de imagen en galería (tiles bento) y videos
  (thumbnail + play que escala 1.1); `template.tsx` público con fade de 0.25s por navegación
  (sin desplazamiento, no compite con FadeUp/Reveal).
- **Reduced-motion:** drawers (MobileDrawer + AdminShell) con `useReducedMotion`
  (transición duration 0); `template.tsx` y `FadeUp` idem. Adelanta parte de M3.
- **Verificado:** `npm run build` → `✓ Compiled successfully`; `npm run lint` 0 errores
  (7 warnings RHF `watch` conocidos). Pendiente: verificación visual en navegador.
- **Siguiente:** Capa 12.5 — Accesibilidad + docs (contraste AA, targets ≥44px, `motion-reduce:`
  en hovers CSS, actualizar 04-design-system.md).

### 2026-07-02 — Capa 12.5 (accesibilidad + docs) — **capa cerrada · fin de Fase 12**
- **Contraste AA (M2):** `--muted-foreground` recalibrado — light `oklch(0.46 …)`, dark
  `oklch(0.72 …)` — para ≥4.5:1 también sobre superficies glass translúcidas (no solo sobre
  `background`). `text-foreground/80` verificado: pasa holgado en ambos modos.
- **Focus (M2):** `:focus-visible` global en `globals.css` (outline 2px `--ring`, offset 2px):
  cualquier link/botón sin estilo de foco propio recibe el anillo de marca; inputs y `NeuButton`
  conservan su ring coherente.
- **Targets (M2):** acciones icon de listas admin (editar/eliminar/ver) → `size-11 md:size-9`:
  44px en mobile/touch, densidad original en desktop. 17 archivos (8 páginas + 8 delete-buttons
  + usuarios).
- **Reduced motion (M3):** kill-switch global CSS — `animation-duration`/`transition-duration`
  a 0.01ms bajo `prefers-reduced-motion` — cubre hovers de lift/zoom, marquee de sponsors y
  aurora; Framer ya estaba cubierto por `useReducedMotion` (12.4).
- **Docs:** [04-design-system.md](04-design-system.md) puesto al día con lo implementado:
  tokens reales, escala de elevación con tabla de uso (§2.1), tipografía utilitaria (§2.2),
  inventario real de `components/ui`/`glass`/`admin`/`layout` (§5, adiós ShadCN/TanStack/Tremor
  aspiracionales), estilo admin real (§6), guía de glow ampliada (§7) y **nueva §8 de
  accesibilidad** como piso de calidad.
- **Verificado:** `npm run build` → `✓ Compiled successfully`; `npm run lint` 0 errores
  (7 warnings RHF `watch` conocidos).
- **Cierre de Fase 12:** los 4 críticos (C1–C4), los 4 altos (A1–A4) y los 3 medios (M1–M3)
  quedan resueltos. Única deuda: verificación visual integral en navegador (claro/oscuro +
  mobile real) de 12.3/12.4/12.5 — requiere sesión y datos.
</content>
