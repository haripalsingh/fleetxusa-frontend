'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'My Orders' },
  { href: '/account/addresses', label: 'My Addresses' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/password', label: 'Change Password' },
];

/** Layout + route guard for /account/* (redirects to login when signed out). */
export default function AccountShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return <div className="min-h-[60vh] bg-gray-50" aria-busy="true" />;
  }

  return (
    <div className="w-full font-display">
      <section className="w-full bg-black text-white">
        <div className="max-w-[1320px] mx-auto px-4 py-10 md:py-12">
          <p className="text-sm text-gray-400">My Account</p>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold mt-1">Hi, {user.name.split(' ')[0]}</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mt-4" />
        </div>
      </section>

      <div className="bg-gray-50 min-h-[50vh] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
          <nav aria-label="Account" className="bg-white rounded-lg shadow-sm p-2 h-max flex lg:flex-col gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const active = item.href === '/account' ? pathname === '/account' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                    active ? 'bg-[#00a550] text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="whitespace-nowrap rounded-md px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Log Out
            </button>
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const Card = ({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) => (
  <section className="bg-white rounded-lg shadow-sm p-5 md:p-6 mb-6">
    {(title || action) && (
      <div className="flex items-center justify-between gap-4 mb-4">
        {title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
        {action}
      </div>
    )}
    {children}
  </section>
);

export const INPUT =
  'w-full h-[42px] border border-gray-300 rounded-md bg-white px-3 text-sm text-gray-900 focus:outline-none focus:border-[#00a550] focus:ring-1 focus:ring-[#00a550]';
export const PRIMARY_BTN =
  'inline-flex items-center justify-center h-[42px] px-6 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 disabled:opacity-50';
export const SECONDARY_BTN =
  'inline-flex items-center justify-center h-[42px] px-5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:border-[#00a550]';
