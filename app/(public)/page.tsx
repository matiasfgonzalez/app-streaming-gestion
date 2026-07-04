import { Hero } from "@/components/sections/hero";
import { BannerSlot } from "@/components/banners/banner-slot";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { RadioPlayer } from "@/components/sections/radio-player";
import { Streaming } from "@/components/sections/streaming";
import { LatestNews } from "@/components/sections/latest-news";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { Sports } from "@/components/sections/sports";
import { ServicesPricing } from "@/components/sections/services-pricing";
import { Sponsors } from "@/components/sections/sponsors";
import { Gallery } from "@/components/sections/gallery";
import { Videos } from "@/components/sections/videos";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { ContactMap } from "@/components/sections/contact-map";
import { getStreamingConfig } from "@/server/queries/radio";
import { getSectionFlags, getSiteConfig } from "@/server/queries/settings";

export default async function Home() {
  const [streaming, sections, site] = await Promise.all([
    getStreamingConfig(),
    getSectionFlags(),
    getSiteConfig(),
  ]);
  return (
    <>
      <Hero site={site} />
      <BannerSlot placement="HOME" className="pb-4" />
      {sections.stats && <Stats />}
      {sections.about && <About brandName={site.brandName} />}
      {sections.radio && <RadioPlayer brandName={site.brandName} />}
      {sections.streaming && (
        <Streaming
          youtubeId={streaming.youtubeId}
          facebookUrl={streaming.facebookUrl}
          brandName={site.brandName}
        />
      )}
      {sections.news && <LatestNews />}
      {sections.events && <UpcomingEvents />}
      {sections.sports && <Sports />}
      {sections.services && <ServicesPricing />}
      {sections.sponsors && <Sponsors />}
      {sections.gallery && <Gallery />}
      {sections.videos && <Videos />}
      {sections.testimonials && <Testimonials brandName={site.brandName} />}
      {sections.faq && <Faq />}
      {sections.contact && <ContactMap contact={site.contact} />}
    </>
  );
}
