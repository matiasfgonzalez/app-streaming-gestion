import {
  SiInstagram,
  SiFacebook,
  SiYoutube,
  SiTiktok,
  SiWhatsapp,
} from "@icons-pack/react-simple-icons";
import { Radio } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/glass/section";
import { NAV_LINKS } from "./nav-links";

const SOCIALS = [
  { href: "#", label: "Instagram", icon: SiInstagram },
  { href: "#", label: "Facebook", icon: SiFacebook },
  { href: "#", label: "YouTube", icon: SiYoutube },
  { href: "#", label: "TikTok", icon: SiTiktok },
  { href: "#", label: "WhatsApp", icon: SiWhatsapp },
];

export function Footer() {
  return (
    <footer className="glass mt-16 border-x-0 border-b-0 pb-24 lg:pb-8">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Radio className="size-5" />
              </span>
              Viva La <span className="text-primary">Mañana</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Radio, streaming, cobertura de eventos y publicidad. Todo en un
              solo lugar.
            </p>
          </div>

          <nav className="space-y-2">
            <h3 className="font-display text-sm font-semibold">Navegación</h3>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="space-y-2">
            <h3 className="font-display text-sm font-semibold">Contacto</h3>
            <p className="text-sm text-muted-foreground">contacto@vivalamanana.com</p>
            <p className="text-sm text-muted-foreground">+54 000 000 0000</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold">Seguinos</h3>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="glass inline-flex size-10 items-center justify-center rounded-full hover:ring-glow"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Viva La Mañana. Todos los derechos
          reservados.
        </div>
      </Container>
    </footer>
  );
}
