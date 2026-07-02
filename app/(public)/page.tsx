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

export default async function Home() {
  const streaming = await getStreamingConfig();
  return (
    <>
      <Hero />
      <BannerSlot placement="HOME" className="pb-4" />
      <Stats />
      <About />
      <RadioPlayer />
      <Streaming youtubeId={streaming.youtubeId} />
      <LatestNews />
      <UpcomingEvents />
      <Sports />
      <ServicesPricing />
      <Sponsors />
      <Gallery />
      <Videos />
      <Testimonials />
      <Faq />
      <ContactMap />
    </>
  );
}
