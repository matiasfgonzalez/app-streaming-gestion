import type { BannerPlacement } from "@prisma/client";
import Image from "next/image";
import { Container } from "@/components/glass/section";
import { getBannersByPlacement } from "@/server/queries/banners";

/**
 * Renderiza los banners activos de una ubicación. Los clicks pasan por
 * /api/track/banner/[id] para contabilizarse. Server component.
 */
export async function BannerSlot({
  placement,
  className,
}: {
  placement: BannerPlacement;
  className?: string;
}) {
  const banners = await getBannersByPlacement(placement);
  if (banners.length === 0) return null;

  return (
    <div className={className}>
      <Container className="space-y-3">
        {banners.map((b) => {
          const img = (
            <div className="relative aspect-[4/1] w-full overflow-hidden rounded-2xl">
              <Image
                src={b.imageUrl}
                alt={b.title ?? "Banner"}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          );
          return b.link ? (
            <a
              key={b.id}
              href={`/api/track/banner/${b.id}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block transition-transform hover:-translate-y-0.5"
            >
              {img}
            </a>
          ) : (
            <div key={b.id}>{img}</div>
          );
        })}
      </Container>
    </div>
  );
}
