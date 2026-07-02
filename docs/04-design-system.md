# Design System — Identidad visual

## 1. Concepto

Viva La Mañana es un **medio de comunicación** (radio + streaming + eventos). El diseño debe sentirse **moderno, energético y confiable**, sin perder seriedad. Combinamos:

- **Glassmorphism** — superficies translúcidas con blur, bordes sutiles, profundidad por capas.
- **Neumorphism** — sombras suaves para controles/tarjetas (con cuidado en accesibilidad/contraste).
- **Aurora gradients** — fondos con degradados fluidos y coloridos como acento.
- **Microinteracciones** (Framer Motion) — feedback en hover/tap, transiciones suaves, entradas escalonadas.
- **Cyberpunk MUY suave** — solo toques de neón/glow en acentos (nunca dominante).
- **Dashboard-First** en el admin — denso, ordenado, profesional.

Referencias de calidad: Apple HIG, Linear, Raycast, Vercel, Stripe.

> Regla: el cyberpunk es condimento, no plato principal. Mantener legibilidad y aire.

## 2. Tokens (TailwindCSS v4 `@theme` en `app/globals.css`)

Todo como **CSS variables** (theme-engine editable, Fase 9). Tokens reales implementados:

- **Color**: `--background/--foreground`, `--card`, `--popover`, `--primary` (naranja amanecer),
  `--secondary` (violeta), `--accent` (cian), `--muted/--muted-foreground`, `--destructive`,
  `--border/--input/--ring`. `--muted-foreground` calibrado para AA también sobre glass
  (light 0.46 L, dark 0.72 L — ver 12.5).
- **Aurora**: `--aurora-1..3` (degradados del fondo animado del hero).
- **Glass**: `--glass-bg`, `--glass-border`, `--glass-blur`.
- **Neumorphism**: `--neu-shadow`, `--neu-shadow-inset` (por modo).
- **Glow**: `--glow` (cian; ver §7).
- **Radios**: `--radius` base → `--radius-sm/md/lg/xl/2xl`.
- **Tipografía**: `--font-display` (Space Grotesk 500-700) + `--font-sans` (Inter).

Cada token con variante clara y oscura. El **modo oscuro** es primera clase, no un afterthought.

### 2.1 Escala de elevación (Fase 12) — usar con intención

Tres niveles, de plano a destacado. **No todo es glass**: cuando todo flota, nada flota.

| Utilidad | Qué es | Cuándo usarla |
|---|---|---|
| `.surface` / `.surface-muted` | Plano opaco con borde | Contextos densos o anidados: filas/celdas, listas (FAQ, datos de contacto), cards secundarias (`StatMini`, servicios), tiles repetidos (marquee de sponsors) |
| `.glass` (`GlassCard`) | Translúcido con blur | Cards protagonistas que flotan sobre el fondo: hero, KPIs principales, formularios, navbar/sidebar |
| `.ring-glow` | Glow de acento | Solo lo destacado: CTA del hero, KPI principal, paquete "más elegido", badge EN VIVO |

### 2.2 Tipografía utilitaria

- `.text-eyebrow` — eyebrow único del sistema (uppercase, tracking 0.14em, 0.72rem). **Sin
  `text-glow`** (12.4 eliminó ese patrón template); color según contexto (`text-accent` en
  landing, `text-muted-foreground` en tablas/sidebar).
- `.tnum` — números tabulares (KPIs, precios, contadores, fechas en columnas).
- `.text-glow` — reservado a display del hero y acentos puntuales; nunca en texto de lectura.

## 3. Modo claro / oscuro

- Provider de tema en el root layout (persistencia en `localStorage` + respeto a `prefers-color-scheme`). Evitar flash (script inline o estrategia de Next 16).
- Toggle accesible en navbar (y en admin).
- Ambos modos deben cumplir contraste AA. El neumorphism en dark requiere sombras específicas (no negro puro; usar superficies elevadas).

## 4. Mobile-first (obligatorio)

Diseñar **primero** para celular. Patrones:
- **Bottom Navigation** en público (Inicio, Noticias, Radio, Eventos, Más).
- **Drawer** lateral para menús secundarios / admin en mobile.
- **Touch-friendly**: targets ≥ 44px, gestos donde aporte.
- **Safe-area** (`env(safe-area-inset-*)`) para notch/gestos.
- **Skeletons** en toda carga de datos.
- **Lazy loading** de imágenes/secciones pesadas; `next/image` siempre.
- **Animaciones suaves** que respeten `prefers-reduced-motion`.
- Breakpoints: mobile (base) → `sm` tablet → `lg` desktop. Componentes con versiones optimizadas por tamaño.
- **PWA-ready** (manifest + service worker) — se completa en Fase 10.

## 5. Componentes base (implementados en Fase 12)

**Identidad (`components/glass/`):** `GlassCard`, `NeuButton` (+ `neuButton()` cva para links),
`AuroraBackground`, `Section`/`Container`/`SectionHeading`, `Waveform`, `MediaPlaceholder`,
`Reveal` (fade+rise on-scroll) y `FadeUp` (entrada orquestada al montar; ambos respetan
`prefers-reduced-motion`).

**UI (`components/ui/`, propios sobre tokens — barrel `index.ts`):**
- Formularios: `Input`, `Textarea`, `Select` (chevron propio), `Checkbox` (≥44px),
  `Label`/`Field`/`FieldError`/`FieldHint`; `inputCls`/`labelCls` como fuente única.
- Datos: `Table` (primitivos), `DataTable` (tipada por `Column<T>`: header sticky + hover en
  desktop, colapso a cards en mobile), `Badge` (variantes semánticas + `dot`).
- Feedback: `Skeleton`, `CardGridSkeleton`, `EmptyState` (con CTA), `Toaster`/`toast` (sonner).

**Admin (`components/admin/`):** `StatCard` (KPI con delta + `Sparkline`), `StatMini`
(KPI secundario en `surface`), `DeltaBadge`, `BarList` (multicolor por serie/estado).

**Layout (`components/layout/`):** `Navbar` (brandName/logo por props), `BottomNav`,
`MobileDrawer`, `Footer`, `AdminShell` (sidebar + drawer, brand dinámico).

**Identidad de marca:** nombre/logo/portada configurables desde `/admin/configuracion` —
ver [06-modulos.md](06-modulos.md#identidad-de-marca-fase-124). No hardcodear el nombre.

## 6. Estilo del Admin (Dashboard-First)

- Sidebar glass + drawer mobile (`AdminShell`); estado activo con barra indicadora y
  `aria-current`; topbar con tema + perfil.
- Densidad alta pero ordenada: listas tabulares con `DataTable` propia (header sticky, hover
  de fila, colapso a cards en mobile). Orden/filtro/paginación: backlog si escala el volumen.
- KPIs con `StatCard`/`StatMini`/`Sparkline`/`BarList` propios (server-only, sin JS de gráficos).
- Jerarquía: KPIs principales en glass (+`ring-glow` el destacado), secundarios en `surface`.
- Vistas con detalle expandido (presupuestos, pagos) quedan como cards a propósito; la galería
  es grid visual.

## 7. Guía de uso del "glow" cyberpunk

- Usar en: CTA principal, badge "EN VIVO", indicadores de estado, hover de tarjetas destacadas.
- Evitar en: bloques de texto largo, fondos completos, el admin (mínimo), eyebrows (usar
  `.text-eyebrow` sin glow).
- Intensidad: bajo `opacity`/`blur`, nunca saturado.

## 8. Accesibilidad (piso de calidad, Fase 12.5)

- **Contraste AA** en ambos modos: `--muted-foreground` calibrado para ≥4.5:1 también sobre
  superficies glass; verificar contraste al introducir colores nuevos.
- **Focus visible unificado**: `:focus-visible` global (outline 2px `--ring`, offset 2px) en
  `globals.css`; inputs y botones del DS traen su propio ring coherente.
- **Targets táctiles ≥44px**: controles de formulario (`min-h-11`, `Checkbox` ≥44) y botones
  de acción icon `size-11 md:size-9` (44px touch, densos en desktop con puntero).
- **`prefers-reduced-motion` completo**: kill-switch global en CSS (animaciones y transiciones
  a 0.01ms) + `useReducedMotion` en todo Framer Motion (drawers, `FadeUp`, `template.tsx`).
- Siempre: `aria-label` en botones icon, `aria-current` en navegación, `alt` significativo.
