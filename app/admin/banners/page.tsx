import { ImageIcon, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DeleteBannerButton } from "@/components/admin/delete-banner-button";
import { requireRole } from "@/lib/auth";
import { getAllBannersAdmin } from "@/server/queries/banners";
import { BANNER_PLACEMENT_LABEL } from "@/lib/banners";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui";

export const metadata = { title: "Banners" };

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
        <div className="space-y-3">
          {banners.map((b) => (
            <GlassCard key={b.id} className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.imageUrl} alt={b.title ?? "Banner"} className="h-14 w-28 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                    {BANNER_PLACEMENT_LABEL[b.placement]}
                  </span>
                  {!b.active && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm font-medium">{b.title ?? "(sin título)"}</p>
                <p className="text-xs text-muted-foreground">
                  {b.clicks} clicks · {b.impressions} impresiones
                </p>
              </div>
              <div className={cn("flex items-center gap-1")}>
                <Link
                  href={`/admin/banners/${b.id}/editar`}
                  aria-label="Editar"
                  className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
                >
                  <Pencil className="size-4" />
                </Link>
                <DeleteBannerButton id={b.id} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
