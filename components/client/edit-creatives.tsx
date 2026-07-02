"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { CreativesUploader } from "@/components/client/creatives-uploader";
import { updateContractCreatives } from "@/server/actions/contracts";
import { cn } from "@/lib/utils";

export function EditCreatives({
  contractId,
  initialLogo,
  initialImages,
}: {
  contractId: string;
  initialLogo: string;
  initialImages: string[];
}) {
  const [logoUrl, setLogoUrl] = useState(initialLogo);
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await updateContractCreatives(contractId, logoUrl, imageUrls);
      setMsg(
        res.ok
          ? { ok: true, text: "Creatividades actualizadas" }
          : { ok: false, text: res.error },
      );
    });
  }

  return (
    <GlassCard className="space-y-4">
      <CreativesUploader
        logoUrl={logoUrl}
        imageUrls={imageUrls}
        onLogoChange={setLogoUrl}
        onImagesChange={setImageUrls}
        onError={(text) => setMsg({ ok: false, text })}
      />
      {msg && (
        <p
          className={cn(
            "rounded-xl px-4 py-2 text-sm",
            msg.ok ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
          )}
        >
          {msg.text}
        </p>
      )}
      <button type="button" onClick={save} disabled={pending} className={cn(neuButton(), "w-fit")}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        Guardar creatividades
      </button>
    </GlassCard>
  );
}
