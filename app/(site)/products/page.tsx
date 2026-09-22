import { Suspense } from 'react';
import type { Metadata } from 'next';
import LegacyCategoryRedirect from '@/components/LegacyCategoryRedirect';
import ProductListing from '@/components/ProductListing';
import { getAllDummyProducts } from '@/lib/dummyProducts';

const DESCRIPTION =
  'Browse our full catalog of heavy-duty truck parts including brake pads, rotors, calipers, hardware kits, and more.';

export const metadata: Metadata = {
  title: 'Shop Truck Parts | Fleet X Parts',
  description: DESCRIPTION,
  keywords:
    'truck parts catalog, brake pads, rotors, calipers, hardware kits, truck parts for sale',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Shop Truck Parts | Fleet X Parts',
    description: DESCRIPTION,
    siteName: 'Fleet X Parts',
    type: 'website',
  },
};

export default function ProductsPage() {
  return (
    <>
      <Suspense fallback={null}>
        <LegacyCategoryRedirect />
      </Suspense>
      <ProductListing products={getAllDummyProducts()} />
    </>
  );
}
