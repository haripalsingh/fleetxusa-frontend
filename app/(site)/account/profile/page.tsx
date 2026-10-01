import type { Metadata } from 'next';
import { ProfileForm } from '@/components/account/AccountProfile';

export const metadata: Metadata = { title: 'Profile | Fleet X Parts' };

export default function AccountProfilePage() {
  return <ProfileForm />;
}
