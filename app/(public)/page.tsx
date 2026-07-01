import { Hero } from "@/components/sections/hero";
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

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <RadioPlayer />
      <Streaming />
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
