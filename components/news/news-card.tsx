import { ArrowRight, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";

export type CardNews = {
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  coverUrl?: string | null;
  hue: number;
};

export function NewsCard({ news }: { news: CardNews }) {
  const href = news.slug ? `/noticias/${news.slug}` : "#";

  const inner = (
    <GlassCard className="group flex h-full flex-col gap-4 p-4 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-video overflow-hidden rounded-xl">
        {news.coverUrl ? (
          <Image
            src={news.coverUrl}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <MediaPlaceholder hue={news.hue} icon={Newspaper} className="size-full" />
        )}
        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium">
          {news.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col">
        <p className="text-xs text-muted-foreground">{news.date}</p>
        <h3 className="mt-1 font-display font-semibold text-balance">{news.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{news.excerpt}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Leer más{" "}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </GlassCard>
  );

  return news.slug ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}
