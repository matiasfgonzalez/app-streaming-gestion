import { Container, Section, SectionHeading } from "@/components/glass/section";
import { GlassCard } from "@/components/glass/glass-card";
import { NewsCard, type CardNews } from "@/components/news/news-card";
import { formatDate, hueFrom } from "@/lib/format";
import { getPublishedNews } from "@/server/queries/news";
import { getSiteConfig } from "@/server/queries/settings";
import { Newspaper } from "lucide-react";
import { EmptyState } from "@/components/ui";

export async function generateMetadata() {
  const site = await getSiteConfig();
  return {
    title: "Noticias",
    description: `Todas las noticias de ${site.brandName}.`,
  };
}

export default async function NoticiasPage() {
  const dbNews = await getPublishedNews();
  const items: CardNews[] = dbNews.map((n) => ({
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt,
    category: n.categories[0]?.name ?? "Noticias",
    date: formatDate(n.publishedAt),
    coverUrl: n.coverUrl,
    hue: hueFrom(n.slug),
  }));

  return (
    <Section className="pt-24">
      <Container>
        <SectionHeading eyebrow="Actualidad" title="Noticias" />
        {items.length === 0 ? (
          <GlassCard className="mt-10 p-0">
            <EmptyState
              icon={Newspaper}
              title="Todavía no hay noticias"
              description="Estamos preparando las primeras publicaciones. Volvé pronto."
            />
          </GlassCard>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <NewsCard key={n.slug} news={n} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
