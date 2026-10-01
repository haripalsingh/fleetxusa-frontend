import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/PasswordResetForms';

export const metadata: Metadata = {
  title: 'Reset Password | Fleet X Parts',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex-1 min-h-[60vh] bg-gray-50" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
