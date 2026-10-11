import type { Metadata } from "next";
import { pageMetadata, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import HeroBanners from "@/components/home/HeroBanners";
import ShopByCategory from "@/components/home/ShopByCategory";
import ShopByEngine from "@/components/home/ShopByEngine";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FleetOrdersBanner from "@/components/home/FleetOrdersBanner";
import WhyFleetX from "@/components/home/WhyFleetX";

export const metadata: Metadata = pageMetadata({
  title: `Heavy-Duty Truck Parts for Fleets | ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  path: '/',
});

export default function Home() {
  return (
    <main className="flex-1">
      <HeroBanners />
      <ShopByCategory />
      <ShopByEngine />
      <FeaturedProducts />
      <FleetOrdersBanner />
      <WhyFleetX />
    </main>
  );
}
