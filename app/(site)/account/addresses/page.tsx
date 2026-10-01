import type { Metadata } from 'next';
import AccountAddresses from '@/components/account/AccountAddresses';

export const metadata: Metadata = { title: 'My Addresses | Fleet X Parts' };

export default function AccountAddressesPage() {
  return <AccountAddresses />;
}
