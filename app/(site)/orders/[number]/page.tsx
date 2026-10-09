import { Suspense } from 'react';
import type { Metadata } from 'next';
import OrderDetails from '@/components/OrderDetails';

// Static export: order numbers only exist at runtime, so a single shell page
// (/orders/view.html) is built. .htaccess serves it for every /orders/<number> URL,
// and OrderDetails reads the real order number from the browser address bar.
export function generateStaticParams() {
  return [{ number: 'view' }];
}

export const metadata: Metadata = {
  title: 'Order details | Fleet X Parts',
  robots: { index: false, follow: false },
};

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-gray-50" />}>
      <OrderDetails />
    </Suspense>
  );
}
