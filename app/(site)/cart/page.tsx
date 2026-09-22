import type { Metadata } from 'next';
import CartView from '@/components/CartView';

export const metadata: Metadata = {
  title: 'Shopping Cart | Fleet X Parts',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartView />;
}
