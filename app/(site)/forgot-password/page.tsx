import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/PasswordResetForms';

export const metadata: Metadata = {
  title: 'Forgot Password | Fleet X Parts',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
