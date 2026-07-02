import { StreamingForm } from "@/components/admin/streaming-form";
import { RadioTabs } from "@/components/admin/radio-tabs";
import { requireRole } from "@/lib/auth";
import { getStreamingConfig } from "@/server/queries/radio";

export const metadata = { title: "Streaming" };

export default async function AdminStreamingPage() {
  await requireRole("ADMIN");
  const cfg = await getStreamingConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Streaming</h1>
        <p className="text-sm text-muted-foreground">
          Configurá el video de YouTube que se muestra en el sitio.
        </p>
      </div>

      <RadioTabs />

      <StreamingForm
        defaults={{
          youtubeId: cfg.youtubeId,
          title: cfg.title ?? "",
          channelUrl: cfg.channelUrl ?? "",
        }}
      />
    </div>
  );
}
