import type { Metadata } from 'next';
import { PasswordForm } from '@/components/account/AccountProfile';

export const metadata: Metadata = { title: 'Change Password | Fleet X Parts' };

export default function AccountPasswordPage() {
  return <PasswordForm />;
}
