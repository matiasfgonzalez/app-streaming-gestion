import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PodcastForm } from "@/components/admin/podcast-form";
import { requireRole } from "@/lib/auth";
import { getProgramOptions } from "@/server/queries/radio";

export const metadata = { title: "Nuevo podcast" };

export default async function NewPodcastPage() {
  await requireRole("ADMIN", "EDITOR");
  const programs = await getProgramOptions();
  return (
    <div className="space-y-6">
      <Link href="/admin/radio/podcasts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Nuevo podcast</h1>
      <PodcastForm programs={programs} />
    </div>
  );
}
