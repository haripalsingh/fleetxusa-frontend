import { Suspense } from 'react';
import type { Metadata } from 'next';
import SignUpForm from '@/components/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up | Fleet X Parts',
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex-1 min-h-[60vh] bg-gray-50" />}>
      <SignUpForm />
    </Suspense>
  );
}
