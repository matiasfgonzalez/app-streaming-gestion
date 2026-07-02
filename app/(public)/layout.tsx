import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import { MobileMenuProvider } from "@/components/layout/mobile-menu-context";
import { getSiteConfig } from "@/server/queries/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteConfig();
  return (
    <MobileMenuProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar brandName={site.brandName} logoUrl={site.logoUrl} />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </div>
    </MobileMenuProvider>
  );
}
