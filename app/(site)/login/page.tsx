import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Log In | Fleet X Parts',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex-1 min-h-[60vh] bg-gray-50" />}>
      <LoginForm />
    </Suspense>
  );
}
