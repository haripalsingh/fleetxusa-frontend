'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toggleWishlist, useWishlist, wishlistErrorMessage } from '@/lib/wishlist';

type Props = {
  productId: number;
  productName?: string;
  /** 'icon' = round heart for product cards, 'full' = bordered button for the product page */
  variant?: 'icon' | 'full';
  className?: string;
};

const Heart = ({ filled, className }: { filled: boolean; className: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s-6.7-4.35-9.33-8.1C.9 10.36 1.6 6.6 4.6 5.3c2.1-.9 4.3-.2 5.6 1.5L12 8.6l1.8-1.8c1.3-1.7 3.5-2.4 5.6-1.5 3 1.3 3.7 5.06 1.93 7.6C18.7 16.65 12 21 12 21z"
    />
  </svg>
);

export default function WishlistButton({ productId, productName, variant = 'icon', className = '' }: Props) {
  const { has } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const saved = has(productId);

  const onClick = async (e: MouseEvent) => {
    // Cards are links - don't open the product when the heart is tapped.
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      const result = await toggleWishlist(productId);
      if (result === 'login') router.push(`/login?next=${encodeURIComponent(pathname || '/')}`);
    } catch (err) {
      setError(wishlistErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const label = saved ? `Remove ${productName ?? 'product'} from wish list` : `Add ${productName ?? 'product'} to wish list`;

  if (variant === 'full') {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={onClick}
          disabled={busy}
          aria-pressed={saved}
          className={`flex w-full items-center justify-center gap-2 border bg-white px-4 py-3 text-xs font-bold uppercase transition-colors disabled:opacity-60 ${
            saved ? 'border-[#00a550] text-[#00a550]' : 'border-gray-300 text-gray-900 hover:border-[#00a550]'
          }`}
        >
          <Heart filled={saved} className={`h-4 w-4 ${saved ? 'text-red-500' : 'text-gray-500'}`} />
          {saved ? 'Saved to Wish List' : 'Add to Wish List'}
        </button>
        {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-pressed={saved}
      aria-label={label}
      title={error || (saved ? 'Saved to wish list' : 'Add to wish list')}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow ring-1 ring-gray-200 transition hover:scale-110 disabled:opacity-60 ${
        saved ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
      } ${className}`}
    >
      <Heart filled={saved} className="h-5 w-5" />
    </button>
  );
}
