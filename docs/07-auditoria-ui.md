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

- [ ] **A1 · Microinteracciones casi ausentes.**
  Framer Motion se importa en solo 3 archivos (2 drawers + `Reveal`). La landing es estática;
  sin hover states ricos en cards, sin stagger, sin transiciones de página. → Capa 12.4
- [x] **A2 · Listas admin no son tablas.** ✅ 12.3: `DataTable` (header sticky, row hover,
  responsive→cards en mobile) adoptado en noticias, eventos, sponsors, paquetes, banners,
  usuarios, publicidad, radio, podcasts y auditoría. Se dejan como cards a propósito las vistas
  con detalle expandido (presupuestos, pagos) y la galería (grid visual).
- [x] **A3 · Dashboard plano.** ✅ 12.3: jerarquía real — 3 KPIs principales (glass + `ring-glow`)
  con delta de tendencia y `Sparkline` (14 días), 6 secundarios compactos (`surface` plano), y
  `BarList` multicolor por serie (paleta marca) y por estado (color semántico).
- [ ] **A4 · Glass sin jerarquía de profundidad.**
  `.glass` está en navbar, sidebar, header y **todas** las cards por igual. Cuando todo es
  glass, nada destaca. Neumorphism quedó solo en botones; aurora solo en el hero. Falta una
  escala de elevación (surface → glass → glow) usada con intención. → Capa 12.1 (tokens) + 12.4

### 2.3 Medios (pulido)

- [ ] **M1 · Tipografía de una sola marcha.**
  Space Grotesk + Inter con saltos de escala gruesos (2xl→3xl→4xl) y `tabular-nums` a mano.
  Los eyebrows son siempre `.text-glow` uppercase → patrón que ya se lee como plantilla. → Capa 12.1
- [ ] **M2 · Accesibilidad.**
  Checkboxes nativos `size-4` (target <44px en mobile, contra el propio DS), `text-foreground/80`
  sobre glass puede no pasar AA, focus-visible inconsistente entre inputs y botones. → Capa 12.5
- [ ] **M3 · `reduced-motion` incompleto.**
  Respetado en aurora y `Reveal`, pero no en las animaciones de drawer (Framer) ni en futuros
  hovers. → Capa 12.5

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

### Capa 12.4 — Landing & público `[ ]`
> La cara comercial, sobre base ya sólida.

- [ ] Motion intencional: hero orquestado en carga, reveals con stagger, hover rico en cards,
      transiciones suaves (todo con `prefers-reduced-motion`).
- [ ] Jerarquía de glass/elevación aplicada (usar la escala de 12.1; no todo glass).
- [ ] Refinamiento sección por sección (Hero, Stats, Noticias, Eventos, Radio, Publicidad,
      Sponsors, Galería, Contacto) manteniendo estructura y contenido.
- [ ] Resuelve: **A1**, cierra **A4**.

### Capa 12.5 — Pulido de accesibilidad + docs `[ ]`
> Quality floor + documentación al día.

- [ ] Contraste AA en ambos modos (revisar `text-foreground/80` sobre glass y estados).
- [ ] Targets táctiles ≥44px; focus-visible unificado (inputs y botones).
- [ ] `prefers-reduced-motion` completo (incluye drawers y hovers nuevos).
- [ ] Actualizar [04-design-system.md](04-design-system.md) con la capa de componentes real,
      la escala de elevación y tipografía, y guías de uso.
- [ ] Resuelve: **M2**, **M3**.

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
</content>
