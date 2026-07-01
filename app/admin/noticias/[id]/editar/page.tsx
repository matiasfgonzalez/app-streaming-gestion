import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { NewsForm } from "@/components/admin/news-form";
import { requireRole } from "@/lib/auth";
import { getNewsById } from "@/server/queries/news";

export const metadata = { title: "Editar noticia" };

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN", "EDITOR");
  const { id } = await params;
  const news = await getNewsById(id);
  if (!news) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/noticias"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Editar noticia</h1>
      <NewsForm
        newsId={news.id}
        defaults={{
          title: news.title,
          excerpt: news.excerpt,
          content: news.content,
          coverUrl: news.coverUrl ?? "",
          videoUrl: news.videoUrl ?? "",
          podcastUrl: news.podcastUrl ?? "",
          status: news.status,
          featured: news.featured,
          breaking: news.breaking,
          categories: news.categories.map((c) => c.name).join(", "),
          tags: news.tags.map((t) => t.name).join(", "),
        }}
      />
    </div>
  );
}
