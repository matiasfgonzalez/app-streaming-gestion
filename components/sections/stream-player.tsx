"use client";

import { SiFacebook, SiYoutube } from "@icons-pack/react-simple-icons";
import { useState } from "react";
import { facebookEmbedUrl } from "@/lib/radio";
import { cn } from "@/lib/utils";

type Platform = "youtube" | "facebook";

/**
 * Player de streaming con pestañas YouTube/Facebook. Si hay una sola plataforma
 * cargada, no muestra pestañas. El iframe de la plataforma inactiva se desmonta
 * (corta la reproducción al cambiar).
 */
export function StreamPlayer({
  youtubeId,
  facebookUrl,
  title,
}: {
  youtubeId?: string;
  facebookUrl?: string;
  title: string;
}) {
  const hasYoutube = !!youtubeId;
  const hasFacebook = !!facebookUrl;
  const [platform, setPlatform] = useState<Platform>(hasYoutube ? "youtube" : "facebook");

  if (!hasYoutube && !hasFacebook) return null;

  return (
    <div className="space-y-3">
      {hasYoutube && hasFacebook && (
        <div className="flex justify-center gap-2" role="tablist" aria-label="Plataforma de streaming">
          <PlatformTab
            active={platform === "youtube"}
            onClick={() => setPlatform("youtube")}
            icon={<SiYoutube className="size-4" />}
            label="YouTube"
          />
          <PlatformTab
            active={platform === "facebook"}
            onClick={() => setPlatform("facebook")}
            icon={<SiFacebook className="size-4" />}
            label="Facebook"
          />
        </div>
      )}

      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        {platform === "youtube" && hasYoutube ? (
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
            title={`${title} · YouTube`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <iframe
            className="size-full"
            src={facebookEmbedUrl(facebookUrl!)}
            title={`${title} · Facebook`}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}

function PlatformTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "surface text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
