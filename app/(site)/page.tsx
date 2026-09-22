import HeroBanner from "@/components/Herobanner";
import ExploreMore from "@/components/ExploreMore";
import QuickActions from "@/components/QuickActions";
import ProductCategories from "@/components/ProductCategories";
import AwardsSection from "@/components/AwardsSection";

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
