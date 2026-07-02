import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { EventStatus } from "@prisma/client";
import { GlassCard } from "@/components/glass/glass-card";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";
import { EVENT_STATUS_LABEL } from "@/lib/events";
import { cn } from "@/lib/utils";

export type CardEvent = {
  slug?: string;
  name: string;
  venue?: string | null;
  dateLabel: string;
  status: EventStatus;
  coverUrl?: string | null;
  hue: number;
};

const STATUS_CLS: Record<EventStatus, string> = {
  LIVE: "bg-primary text-primary-foreground",
  UPCOMING: "glass text-foreground",
  FINISHED: "bg-muted text-muted-foreground",
};

export function EventCard({ event }: { event: CardEvent }) {
  const inner = (
    <GlassCard className="group flex h-full flex-col gap-4 p-4 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        {event.coverUrl ? (
          <Image
            src={event.coverUrl}
            alt={event.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <MediaPlaceholder hue={event.hue} icon={CalendarDays} className="size-full" />
        )}
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium",
            STATUS_CLS[event.status],
          )}
        >
          {EVENT_STATUS_LABEL[event.status]}
        </span>
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="font-display font-semibold">{event.name}</h3>
        {event.venue && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {event.venue}
          </p>
        )}
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-4" /> {event.dateLabel}
        </p>
      </div>
    </GlassCard>
  );

  return event.slug ? (
    <Link href={`/eventos/${event.slug}`} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}
