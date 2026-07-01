import { Container, Section, SectionHeading } from "@/components/glass/section";
import { SPONSORS } from "@/lib/landing-data";

export function Sponsors() {
  // Duplicado para loop continuo del marquee.
  const items = [...SPONSORS, ...SPONSORS];

  return (
    <Section id="sponsors" className="py-12">
      <Container>
        <SectionHeading eyebrow="Confían en nosotros" title="Nuestros sponsors" />
      </Container>
      <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-4 motion-reduce:animate-none">
          {items.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="glass flex h-16 w-44 shrink-0 items-center justify-center rounded-xl px-4 text-center text-sm font-semibold text-muted-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
