import Image from "next/image";
import Link from "next/link";
import { neuButton } from "@/components/glass/neu-button";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { SPONSORS } from "@/lib/landing-data";
import { getActiveSponsors } from "@/server/queries/banners";

export async function Sponsors() {
  const dbSponsors = await getActiveSponsors();

  // Fallback a nombres seed si todavía no hay sponsors cargados.
  const items =
    dbSponsors.length > 0
      ? [...dbSponsors, ...dbSponsors]
      : [...SPONSORS, ...SPONSORS].map((name) => ({
          id: name,
          name,
          logoUrl: null,
        }));

  return (
    <Section id="sponsors" className="py-12">
      <Container>
        <SectionHeading eyebrow="Confían en nosotros" title="Nuestros sponsors" />
      </Container>
      <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-4 motion-reduce:animate-none">
          {items.map((s, i) => (
            <div
              key={`${s.id}-${i}`}
              className="surface flex h-16 w-44 shrink-0 items-center justify-center rounded-xl px-4 text-center text-sm font-semibold text-muted-foreground"
            >
              {s.logoUrl ? (
                <div className="relative h-10 w-full">
                  <Image src={s.logoUrl} alt={s.name} fill className="object-contain" sizes="176px" />
                </div>
              ) : (
                s.name
              )}
            </div>
          ))}
        </div>
      </div>
      <Container className="mt-8 text-center">
        <Link href="/sponsors" className={neuButton({ variant: "outline" })}>
          Ver todos los sponsors
        </Link>
      </Container>
    </Section>
  );
}
