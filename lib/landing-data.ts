/**
 * Fase 1 — contenido seed (hardcodeado) de la landing.
 * En fases posteriores esto se reemplaza por datos desde la DB / CMS.
 */
import {
  Mic,
  Radio,
  Camera,
  Video,
  Wifi,
  Megaphone,
  Share2,
  Users,
  MessageSquareText,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export const STATS = [
  { value: "+500", label: "Eventos" },
  { value: "+300", label: "Clientes" },
  { value: "+1500", label: "Noticias" },
  { value: "+200", label: "Transmisiones" },
] as const;

export type NewsItem = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  hue: number; // para placeholder de portada
};

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Arranca la nueva temporada de Viva La Mañana",
    category: "Programa",
    excerpt:
      "Más música, más invitados y más cobertura en vivo cada mañana de 8 a 11.",
    date: "1 Jul 2026",
    hue: 40,
  },
  {
    id: "n2",
    title: "Cobertura especial del clásico de la ciudad",
    category: "Deportes",
    excerpt:
      "Transmisión completa con relatos, entrevistas y análisis post partido.",
    date: "28 Jun 2026",
    hue: 300,
  },
  {
    id: "n3",
    title: "Los mejores momentos del festival de invierno",
    category: "Eventos",
    excerpt:
      "Fotos, videos y backstage de una jornada a sala llena junto a la comunidad.",
    date: "24 Jun 2026",
    hue: 200,
  },
];

export type EventItem = {
  id: string;
  name: string;
  venue: string;
  date: string;
  status: "Próximamente" | "En vivo" | "Finalizado";
  hue: number;
};

export const EVENTS: EventItem[] = [
  {
    id: "e1",
    name: "Fecha del torneo local",
    venue: "Estadio Municipal",
    date: "5 Jul 2026 · 20:00",
    status: "Próximamente",
    hue: 300,
  },
  {
    id: "e2",
    name: "Streaming semanal en vivo",
    venue: "Estudio Viva La Mañana",
    date: "Hoy · 21:00",
    status: "En vivo",
    hue: 200,
  },
  {
    id: "e3",
    name: "Peña folclórica de invierno",
    venue: "Centro Cultural",
    date: "12 Jul 2026 · 22:00",
    status: "Próximamente",
    hue: 40,
  },
];

export type PricePlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export const PLANS: PricePlan[] = [
  {
    id: "radio",
    name: "Sponsor Radio",
    price: "$30.000",
    period: "/mes",
    description: "Menciones en el programa de lunes a viernes de 8 a 11.",
    features: [
      "Menciones diarias en vivo",
      "Placa en redes del programa",
      "Reporte mensual de aire",
    ],
  },
  {
    id: "full",
    name: "Paquete Completo",
    price: "$60.000",
    period: "/mes",
    description: "Radio + fútbol + streamings semanales. La mejor cobertura.",
    features: [
      "Todo lo de Radio",
      "Sponsor en transmisiones de fútbol",
      "Sponsor en streamings semanales",
      "Prioridad en banners del sitio",
    ],
    featured: true,
  },
  {
    id: "streaming",
    name: "Sponsor Streaming",
    price: "$30.000",
    period: "/mes",
    description: "Presencia en los streamings semanales del canal.",
    features: [
      "Logo en pantalla durante el vivo",
      "Mención del conductor",
      "Clip destacado en redes",
    ],
  },
];

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const SERVICES: Service[] = [
  { title: "Internet", description: "Conectividad para transmitir sin cortes.", icon: Wifi },
  { title: "Streaming", description: "Transmisión en vivo multiplataforma.", icon: Radio },
  { title: "Fotos", description: "Cobertura fotográfica profesional.", icon: Camera },
  { title: "Videos / Reels", description: "Clips y reels para redes.", icon: Video },
  { title: "Conducción", description: "Conductor y animación del evento.", icon: Mic },
  { title: "Publicidad", description: "Difusión en radio y redes.", icon: Megaphone },
  { title: "Redes / CM", description: "Gestión de comunidad y contenido.", icon: Share2 },
  { title: "Entrevistas", description: "Cobertura periodística y notas.", icon: MessageSquareText },
];

export const SPONSORS = [
  "Café del Centro",
  "AutoMax",
  "Deportes Sur",
  "TecnoHogar",
  "Farmacia Norte",
  "Óptica Visión",
  "Constructora RÍO",
  "Heladería Polo",
] as const;

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  hue: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Alejandra Méndez",
    role: "Café del Centro",
    quote:
      "Desde que sponsoreamos el programa aumentaron las visitas al local. Se nota el alcance.",
    hue: 40,
  },
  {
    name: "Martín Rossi",
    role: "AutoMax",
    quote:
      "La cobertura del evento fue impecable: fotos, video y transmisión en vivo de primera.",
    hue: 300,
  },
  {
    name: "Carla Duarte",
    role: "TecnoHogar",
    quote:
      "El equipo es profesional y responde rápido. Recomiendo el paquete completo.",
    hue: 200,
  },
];

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "¿Cómo contrato un paquete de publicidad?",
    a: "Registrate, elegí el paquete, completá los datos y creatividades, informá el pago y nuestro equipo lo aprueba. La publicidad queda activa según la vigencia contratada.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Por ahora transferencia y efectivo. Subís el comprobante y validamos el pago manualmente. Más adelante sumaremos pago online.",
  },
  {
    q: "¿Puedo pedir cobertura para mi evento?",
    a: "Sí. En la sección de eventos podés solicitar un presupuesto eligiendo los servicios que necesitás (streaming, fotos, video, conducción y más).",
  },
  {
    q: "¿Dónde puedo escuchar el programa?",
    a: "En vivo desde esta página y en nuestras redes. Próximamente sumaremos la radio propia directamente en el sitio.",
  },
];

export const FEATURED_ICONS = { Users, Newspaper } as const;
