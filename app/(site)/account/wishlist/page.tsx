import type { Metadata } from 'next';
import AccountWishlist from '@/components/account/AccountWishlist';

export const metadata: Metadata = { title: 'My Wish List | Fleet X Parts', robots: { index: false, follow: false } };

export default function AccountWishlistPage() {
  return <AccountWishlist />;
}
