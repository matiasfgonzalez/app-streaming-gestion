import { Container, Section, SectionHeading } from "@/components/glass/section";
import { GlassCard } from "@/components/glass/glass-card";
import { NewsCard, type CardNews } from "@/components/news/news-card";
import { formatDate, hueFrom } from "@/lib/format";
import { getPublishedNews } from "@/server/queries/news";

export const metadata = {
  title: "Noticias",
  description: "Todas las noticias de Viva La Mañana.",
};

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
          <GlassCard className="mt-10 py-16 text-center text-muted-foreground">
            Todavía no hay noticias publicadas.
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
