import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Log In | Fleet X Parts',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
