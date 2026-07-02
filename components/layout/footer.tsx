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
import { getSiteConfig } from "@/server/queries/settings";
import type { SiteConfig } from "@/lib/site-config";
import { NAV_LINKS } from "./nav-links";

const SOCIAL_ICONS = [
  { key: "instagram", label: "Instagram", icon: SiInstagram },
  { key: "facebook", label: "Facebook", icon: SiFacebook },
  { key: "youtube", label: "YouTube", icon: SiYoutube },
  { key: "tiktok", label: "TikTok", icon: SiTiktok },
  { key: "whatsapp", label: "WhatsApp", icon: SiWhatsapp },
] as const satisfies ReadonlyArray<{
  key: keyof SiteConfig["socials"];
  label: string;
  icon: typeof SiInstagram;
}>;

export async function Footer() {
  const site = await getSiteConfig();
  const socials = SOCIAL_ICONS.filter(({ key }) => site.socials[key]);

  return (
    <footer className="glass mt-16 border-x-0 border-b-0 pb-24 lg:pb-8">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Radio className="size-5" />
              </span>
              {site.brandName}
            </Link>
            <p className="text-sm text-muted-foreground">{site.description}</p>
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
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="block text-sm text-muted-foreground hover:text-foreground">
                {site.contact.email}
              </a>
            )}
            {site.contact.phone && (
              <p className="text-sm text-muted-foreground">{site.contact.phone}</p>
            )}
            {site.contact.address && (
              <p className="text-sm text-muted-foreground">{site.contact.address}</p>
            )}
          </div>

          {socials.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-sm font-semibold">Seguinos</h3>
              <div className="flex flex-wrap gap-2">
                {socials.map(({ key, label, icon: Icon }) => (
                  <a
                    key={key}
                    href={site.socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="glass inline-flex size-10 items-center justify-center rounded-full hover:ring-glow"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.brandName}. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}
