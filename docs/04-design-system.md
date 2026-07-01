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

Definir todo como **CSS variables** para poder migrar al theme-engine editable (Fase 9) sin reescribir componentes.

Categorías de tokens:
- **Color**: `--color-bg`, `--color-surface`, `--color-surface-glass`, `--color-primary`, `--color-secondary`, `--color-accent` (neón suave), `--color-fg`, `--color-muted`, `--color-border`, estados (`success`, `warning`, `danger`).
- **Aurora**: variables de degradado para fondos (`--aurora-1..n`).
- **Blur/Glass**: `--glass-blur`, `--glass-opacity`, `--glass-border`.
- **Sombra neumórfica**: `--shadow-neu-out`, `--shadow-neu-in` (distintas por modo claro/oscuro).
- **Radios**: `--radius-sm/md/lg/xl`.
- **Tipografía**: familias (display + texto), escala, pesos.
- **Espaciado/anim**: duraciones y easings estándar.

Cada token con variante clara y oscura. El **modo oscuro** es primera clase, no un afterthought.

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

## 5. Componentes base

**Identidad (`src/components/glass/`):**
- `GlassCard`, `GlassPanel`, `NeuButton`, `AuroraBackground`, `GlowBadge`, `SectionHeading`, `Stat` (contador animado), `Marquee` (sponsors).

**UI (`src/components/ui/`, ShadCN):** Button, Input, Select, Dialog, Sheet (drawer), Tabs, Table, Toast, Form, DropdownMenu, Badge, Skeleton, Avatar, Switch, Tooltip — estilados con nuestros tokens.

**Layout (`src/components/layout/`):** `Navbar`, `BottomNav`, `MobileDrawer`, `Footer`, `AdminShell` (sidebar + topbar dashboard-first).

## 6. Estilo del Admin (Dashboard-First)

- Sidebar colapsable + topbar con búsqueda/perfil.
- Densidad de información alta pero ordenada; tablas con TanStack Table (orden, filtro, paginación).
- Cards de KPI con Tremor/Recharts.
- Mismos tokens glass/neu que el público, pero más sobrio y funcional.
- En mobile: sidebar → drawer, tablas → cards.

## 7. Guía de uso del "glow" cyberpunk

- Usar en: CTA principal, badge "EN VIVO", indicadores de estado, hover de tarjetas destacadas.
- Evitar en: bloques de texto largo, fondos completos, el admin (mínimo).
- Intensidad: bajo `opacity`/`blur`, nunca saturado.
