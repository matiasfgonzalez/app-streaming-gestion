import { GlassCard } from "@/components/glass/glass-card";
import { Container, Section } from "@/components/glass/section";
import { Skeleton } from "./skeleton";

/** Skeleton reutilizable para páginas públicas con grilla de cards (loading.tsx). */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Section>
      <Container>
        <Skeleton className="mx-auto h-9 w-56" />
        <Skeleton className="mx-auto mt-4 h-4 w-80 max-w-full" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <GlassCard key={i} className="overflow-hidden p-0">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
