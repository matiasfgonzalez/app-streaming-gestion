import { Newspaper, CalendarDays, Users, Megaphone } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const user = await requireRole("ADMIN", "EDITOR");
  const usersCount = await db.user.count();

  const kpis = [
    { label: "Usuarios", value: usersCount, icon: Users },
    { label: "Noticias", value: 0, icon: Newspaper },
    { label: "Eventos", value: 0, icon: CalendarDays },
    { label: "Publicidades", value: 0, icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">
          Hola, {user.name ?? "bienvenido"} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Este es el panel de Viva La Mañana. Los módulos se irán activando por fase.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <GlassCard key={label}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="size-4 text-primary" />
            </div>
            <div className="mt-2 font-display text-3xl font-bold">{value}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <h2 className="font-display font-semibold">Próximos pasos</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
          <li>Fase 3 — Módulo de Noticias (primer CRUD completo).</li>
          <li>Fase 4 — Eventos y solicitudes de presupuesto.</li>
          <li>Fase 5 — Paquetes, contratación y pagos manuales.</li>
        </ul>
      </GlassCard>
    </div>
  );
}
