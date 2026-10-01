import { Suspense } from 'react';
import type { Metadata } from 'next';
import OrderDetails from '@/components/OrderDetails';

type Props = { params: Promise<{ number: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  return { title: `Order ${number} | Fleet X Parts`, robots: { index: false, follow: false } };
}

export default async function OrderPage({ params }: Props) {
  const { number } = await params;
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-gray-50" />}>
      <OrderDetails number={number} />
    </Suspense>
  );
}
