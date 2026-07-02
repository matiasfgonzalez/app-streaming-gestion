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

- [ ] **C1 · No hay capa de componentes UI — todo es Tailwind repetido.**
  `components/ui/` no existe (ShadCN figura como "listo" pero nunca se agregaron primitivos).
  El string `inputCls`/`labelCls` está **redefinido a mano en 17 formularios**, hay **15
  `<select>` nativos crudos**, y el markup de badge de estado está duplicado en 5+ páginas
  admin. Sin `Input`, `Select`, `Badge`, `Table`, `Field` compartidos, cualquier refinamiento
  visual hay que hacerlo 17 veces. **Causa raíz de la inconsistencia.** → Capa 12.1
- [ ] **C2 · Cero estados de carga.**
  No hay ni un `loading.tsx` en toda la app, pese a que el DS exige "Skeletons en toda carga
  de datos". Cada página admin/pública bloquea sin feedback. → Capa 12.2
- [ ] **C3 · Sin sistema de notificaciones.**
  No hay toast/sonner. Los formularios muestran error como texto rojo inline y el éxito es un
  `redirect` mudo (creás una noticia y no hay confirmación). El DS lista "Toast" — no está. → Capa 12.2
- [ ] **C4 · Sin límites de error / vacío.**
  Cero `error.tsx` y cero `not-found.tsx`. Los estados vacíos son frases sueltas
  ("Todavía no hay noticias") sin ilustración ni CTA. → Capa 12.2

### 2.2 Altos (afectan jerarquía y personalidad)

- [ ] **A1 · Microinteracciones casi ausentes.**
  Framer Motion se importa en solo 3 archivos (2 drawers + `Reveal`). La landing es estática;
  sin hover states ricos en cards, sin stagger, sin transiciones de página. → Capa 12.4
- [ ] **A2 · Listas admin no son tablas.**
  Noticias/eventos/etc. son `<ul>` simples, sin orden/filtro/paginación ni densidad. Para un
  "Dashboard Enterprise" faltan tablas reales (columnas, sticky header, row hover,
  responsive→cards). → Capa 12.3
- [ ] **A3 · Dashboard plano.**
  8 KPIs idénticos en grilla uniforme, sin jerarquía (métrica principal vs secundaria), sin
  tendencia/delta ni sparkline. Todas las barras del mismo color primario. Se lee como
  planilla, no como panel. → Capa 12.3
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

### Capa 12.1 — Fundaciones del Design System `[ ]`
> Elimina la causa raíz (C1). Habilita todo lo demás. Sin esto, cada refinamiento se duplica ×17.

- [ ] Crear `components/ui/` con primitivos tipados sobre los tokens actuales:
  - [ ] `Input`, `Textarea` (reemplazan `inputCls`).
  - [ ] `Label` / `Field` (label + control + error + hint; reemplaza `labelCls` y el patrón de error inline).
  - [ ] `Select` (estilado, reemplaza los 15 `<select>` crudos).
  - [ ] `Checkbox` / `Switch` accesibles (target ≥44px).
  - [ ] `Badge` (variantes de estado: success/warning/danger/neutral/primary) — reemplaza el badge duplicado.
  - [ ] `Skeleton` (base para 12.2).
  - [ ] `Table` (thead/tbody/row/cell con densidad y hover) + `EmptyState`.
- [ ] Escala de **elevación** en tokens: `surface` (plano) → `glass` → `glow`, con clases de uso
      intencional (no todo glass). Documentar cuándo usar cada una.
- [ ] Escala **tipográfica** afinada (display/heading/body/caption/data) con pesos y `tabular-nums`
      centralizado; revisar el patrón de eyebrow para que no lea como plantilla.
- [ ] Migrar los 17 formularios y las páginas con badges a los nuevos primitivos (sin cambiar lógica).
- [ ] Resuelve: **C1**, y sienta base de **A4**, **M1**.

### Capa 12.2 — Feedback (carga, error, vacío, notificaciones) `[ ]`
> Cierra los huecos de UX más visibles.

- [ ] `Toaster` global (sonner con tokens del proyecto) + helper `toast` en actions/forms.
- [ ] Conectar formularios: éxito → toast de confirmación; error → toast + estado inline.
- [ ] `loading.tsx` con skeletons por ruta (admin y público con datos).
- [ ] `error.tsx` y `not-found.tsx` premium (con la identidad, no defaults de Next).
- [ ] Componente `EmptyState` aplicado a todos los estados vacíos, con ilustración/ícono + CTA.
- [ ] Resuelve: **C2**, **C3**, **C4**.

### Capa 12.3 — Admin Enterprise `[ ]`
> Densidad, orden y jerarquía. Usa los primitivos de 12.1.

- [ ] Migrar listas admin (`<ul>`) a `DataTable` (columnas, sticky header, row hover,
      responsive→cards en mobile). Evaluar orden/filtro donde aporte.
- [ ] Rediseñar dashboard `/admin`: jerarquía de KPIs (principal vs secundarios), deltas/tendencia,
      sparklines, `BarList` multicolor por serie.
- [ ] Refinar `AdminShell` (jerarquía de sidebar, estados activos, densidad de la topbar).
- [ ] Resuelve: **A2**, **A3**.

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

- _(pendiente — se completa al cerrar 12.1)_
</content>
