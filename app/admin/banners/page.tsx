import { ImageIcon, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DeleteBannerButton } from "@/components/admin/delete-banner-button";
import { requireRole } from "@/lib/auth";
import { getAllBannersAdmin } from "@/server/queries/banners";
import { BANNER_PLACEMENT_LABEL } from "@/lib/banners";
import { Badge, DataTable, EmptyState, type Column } from "@/components/ui";

export const metadata = { title: "Banners" };

type BannerRow = Awaited<ReturnType<typeof getAllBannersAdmin>>[number];

const columns: Column<BannerRow>[] = [
  {
    key: "title",
    header: "Banner",
    primary: true,
    cell: (b) => (
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={b.imageUrl}
          alt={b.title ?? "Banner"}
          className="h-10 w-20 shrink-0 rounded-lg object-cover"
        />
        <span className="min-w-0 truncate text-sm font-medium">{b.title ?? "(sin título)"}</span>
      </div>
    ),
  },
  {
    key: "placement",
    header: "Ubicación",
    cell: (b) => (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
          {BANNER_PLACEMENT_LABEL[b.placement]}
        </span>
        {!b.active && <Badge variant="neutral">Inactivo</Badge>}
      </div>
    ),
  },
  {
    key: "perf",
    header: "Rendimiento",
    cell: (b) => (
      <span className="text-xs text-muted-foreground tnum">
        {b.clicks} clicks · {b.impressions} impresiones
      </span>
    ),
  },
  {
    key: "actions",
    header: "Acciones",
    action: true,
    cell: (b) => (
      <div className="inline-flex items-center gap-1">
        <Link
          href={`/admin/banners/${b.id}/editar`}
          aria-label="Editar"
          className="inline-flex size-11 items-center justify-center rounded-lg md:size-9 text-foreground/80 transition-colors hover:bg-muted"
        >
          <Pencil className="size-4" />
        </Link>
        <DeleteBannerButton id={b.id} />
      </div>
    ),
  },
];

export default async function AdminBannersPage() {
  await requireRole("ADMIN");
  const banners = await getAllBannersAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground">{banners.length} banners</p>
        </div>
        <Link href="/admin/banners/nuevo" className={neuButton()}>
          <Plus /> Nuevo
        </Link>
      </div>

      {banners.length === 0 ? (
        <GlassCard className="p-0">
          <EmptyState
            icon={ImageIcon}
            title="Todavía no hay banners"
            description="Creá un banner para mostrarlo en las ubicaciones del sitio."
            action={
              <Link href="/admin/banners/nuevo" className={neuButton()}>
                <Plus /> Nuevo banner
              </Link>
            }
          />
        </GlassCard>
      ) : (
        <DataTable columns={columns} rows={banners} getKey={(b) => b.id} />
      )}
    </div>
  );
}
