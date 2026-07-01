import Link from "next/link";
import { neuButton } from "@/components/glass/neu-button";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { NewsCard, type CardNews } from "@/components/news/news-card";
import { NEWS } from "@/lib/landing-data";
import { formatDate, hueFrom } from "@/lib/format";
import { getPublishedNews } from "@/server/queries/news";

export async function LatestNews() {
  const dbNews = await getPublishedNews(3);

  // Si todavía no hay noticias reales, mostramos el seed para no dejar el bloque vacío.
  const items: CardNews[] =
    dbNews.length > 0
      ? dbNews.map((n) => ({
          slug: n.slug,
          title: n.title,
          excerpt: n.excerpt,
          category: n.categories[0]?.name ?? "Noticias",
          date: formatDate(n.publishedAt),
          coverUrl: n.coverUrl,
          hue: hueFrom(n.slug),
        }))
      : NEWS.map((n) => ({
          title: n.title,
          excerpt: n.excerpt,
          category: n.category,
          date: n.date,
          hue: n.hue,
        }));

  return (
    <Section id="noticias">
      <Container>
        <SectionHeading
          eyebrow="Enterate"
          title="Últimas noticias"
          subtitle="Lo que pasa en el programa, los eventos y el deporte de la ciudad."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((n, i) => (
            <Reveal key={n.slug ?? n.title} delay={i * 0.08}>
              <NewsCard news={n} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/noticias" className={neuButton({ variant: "outline" })}>
            Ver todas las noticias
          </Link>
        </div>
      </Container>
    </Section>
  );
}
