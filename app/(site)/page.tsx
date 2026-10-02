import type { Metadata } from "next";
import { pageMetadata, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import HeroBanner from "@/components/Herobanner";
import ExploreMore from "@/components/ExploreMore";
import QuickActions from "@/components/QuickActions";
import ProductCategories from "@/components/ProductCategories";
import AwardsSection from "@/components/AwardsSection";

export const metadata: Metadata = pageMetadata({
  title: `Heavy-Duty Truck Parts for Fleets | ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  path: '/',
});

export default function Home() {
  return (
    <main className="flex-1">
      <HeroBanner />
      <ProductCategories />
      <AwardsSection />
      <ExploreMore />
      <QuickActions />
    </main>
  );
}
