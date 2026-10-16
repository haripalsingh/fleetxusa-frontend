'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MobileDrawer from './MobileDrawer';
import { isLinkLive, useLiveCategories } from '@/lib/liveCategories';
import type { DrawerSection } from './MobileDrawer';

type NavLink = { label: string; to: string; desc?: string };
type NavMenu = {
  type: 'simple' | 'mega';
  to?: string;
  links?: NavLink[];
  columns?: { title: string; links: NavLink[] }[];
  footerLinks?: NavLink[];
};
type CartItem = { quantity: number };
type HeaderProps = { phone?: string; promoText?: string };

// ---- Mega-menu content -------------------------------------------------
// Edit the labels/links below to match your real product catalog & pages.
const NAV_MENUS: Record<string, NavMenu> = {
  products: {
    type: 'simple',
    links: [
      { label: 'Clamps', to: '/products/clamps' },
      { label: 'Filters', to: '/products/filters' },
      { label: 'Hoses', to: '/products/hoses' },
      { label: 'Seals', to: '/products/seals' },
      { label: 'Detroit Engine Parts', to: '/detroit-engine-parts' },
      { label: 'Cummins Engine Parts', to: '/cummins-engine-parts' },
      { label: 'All Categories', to: '/categories' }
    ]
  },
  about: {
    type: 'simple',
    to: '/about',
    links: [
      { label: 'Our Story', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press', to: '/press' }
    ]
  },
  resources: {
    type: 'simple',
    links: [
      { label: 'Catalogs', to: '/resources/catalogs' },
      { label: 'Installation Guides', to: '/resources/guides' },
      { label: 'Warranty', to: '/resources/warranty' },
      { label: 'FAQs', to: '/faqs' }
    ]
  },
  contact: {
    type: 'simple',
    to: '/contact',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Find a Dealer', to: '/dealers' },
      { label: 'Support', to: '/support' }
    ]
  }
};

const NAV_ORDER = [
  { key: 'products', label: 'Products' },
  { key: 'resources', label: 'Resources' },
  { key: 'contact', label: 'Contact Us' }
];

// ---- Desktop mega-menu content (Products) ------------------------------
const MEGA_CATEGORIES = [
  { label: 'Clamps', to: '/products/clamps', img: '/images/menu/clamps.webp', desc: 'V-band, T-bolt & exhaust' },
  { label: 'Filters', to: '/products/filters', img: '/images/menu/filters.webp', desc: 'Oil, fuel & air filtration' },
  { label: 'Hoses', to: '/products/hoses', img: '/images/menu/hoses.webp', desc: 'Silicone coolant & charge-air' },
  { label: 'Seals', to: '/products/seals', img: '/images/menu/seals.webp', desc: 'O-rings, gaskets & seals' }
];
const MEGA_ENGINES = [
  { label: 'Detroit Engine Parts', to: '/detroit-engine-parts', mark: 'DD', desc: 'DD15 exploded-view diagrams' },
  { label: 'Cummins Engine Parts', to: '/cummins-engine-parts', mark: 'CU', desc: 'Top Cummins parts by system' }
];
const RESOURCE_ICONS: Record<string, string> = {
  '/resources/catalogs': 'M4 6h16M4 10h16M4 14h10M4 18h10',
  '/resources/guides': 'M9 12h6m-6 4h6M7 4h7l5 5v11a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1z',
  '/resources/warranty': 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zm-3 9l2 2 4-4',
  '/faqs': 'M9 9a3 3 0 116 0c0 2-3 2-3 4m0 4h.01M12 21a9 9 0 110-18 9 9 0 010 18z'
};
const RESOURCE_DESCS: Record<string, string> = {
  '/resources/catalogs': 'Download product catalogs',
  '/resources/guides': 'Step-by-step install help',
  '/resources/warranty': 'Coverage & claims',
  '/faqs': 'Answers to common questions'
};

const Arrow = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const DRAWER_SECTIONS: DrawerSection[] = NAV_ORDER.map(({ key, label }) => {
  const menu = NAV_MENUS[key];
  const links =
    menu.type === 'mega' ? (menu.columns ?? []).flatMap((c) => c.links) : (menu.links ?? []);
  // About Us and Contact Us have no submenu on mobile: they are plain links.
  if (key === 'about' || key === 'contact') return { key, label, to: menu.to };
  return {
    key,
    label,
    links: key === 'products' ? [{ label: 'All Products', to: '/products' }, ...links] : links
  };
});

const Header = ({ phone = '917-293-3704' }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const navigate = (to: string) => router.push(to);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null); // 'products' | 'about' | 'resources' | 'contact' | null
  const { user, isAuthenticated, logout, loading } = useAuth();
  // Hide category links removed in admin (site is pre-built, so check the live API)
  const liveCats = useLiveCategories();
  const liveLink = (l: { to?: string }) => isLinkLive(l.to, liveCats);
  const drawerSections = DRAWER_SECTIONS.map((sec) => (sec.links ? { ...sec, links: sec.links.filter(liveLink) } : sec));
  const navRef = useRef<HTMLDivElement>(null);
  const headerBarRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search panel: focus on open, close on Escape and on navigation
  useEffect(() => {
    if (!isSearchOpen) return undefined;
    searchInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsSearchOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isSearchOpen]);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  const toggleSearch = () => {
    setOpenMenu(null);
    setIsSearchOpen((v) => !v);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return searchInputRef.current?.focus();
    setIsSearchOpen(false);
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  const searchIcon = (cls: string) =>
    React.createElement(
      'svg',
      { className: cls, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'aria-hidden': true },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z' })
    );

  const renderSearchButton = (extra = '') =>
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: toggleSearch,
        'aria-label': isSearchOpen ? 'Close search' : 'Search parts',
        'aria-expanded': isSearchOpen,
        'aria-controls': 'header-search-panel',
        className: `flex items-center justify-center w-9 h-9 rounded-full text-white transition-colors hover:bg-gradient-to-r hover:from-[#e9e611] hover:to-[#00a34f] ${isSearchOpen ? 'bg-white/15' : ''} ${extra}`
      },
      isSearchOpen
        ? React.createElement(
            'svg',
            { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'aria-hidden': true },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' })
          )
        : searchIcon('w-6 h-6')
    );

  const renderSearchPanel = () =>
    isSearchOpen &&
    React.createElement(
      React.Fragment,
      null,
      // dimmed backdrop over the page; click to close
      React.createElement('div', {
        'aria-hidden': true,
        onClick: () => setIsSearchOpen(false),
        className: 'fixed inset-0 top-[var(--hdr-h)] -z-10 bg-black/50',
        style: { ['--hdr-h' as string]: `${headerHeight}px` }
      }),
      React.createElement(
        'div',
        { id: 'header-search-panel', className: 'absolute left-0 right-0 top-full bg-black border-b border-white/10 shadow-2xl font-sans animate-[fadeIn_.15s_ease-out]' },
        React.createElement(
          'form',
          { role: 'search', onSubmit: submitSearch, className: 'max-w-3xl mx-auto px-4 py-5 md:py-7' },
          React.createElement('label', { htmlFor: 'header-search-input', className: 'sr-only' }, 'Search truck parts by part number or keyword'),
          React.createElement(
            'div',
            { className: 'flex overflow-hidden rounded-lg bg-white ring-2 ring-transparent focus-within:ring-[#00a550]' },
            React.createElement('span', { className: 'flex items-center pl-4 text-gray-400' }, searchIcon('w-5 h-5')),
            React.createElement('input', {
              id: 'header-search-input',
              ref: searchInputRef,
              type: 'search',
              name: 'q',
              value: searchQuery,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
              autoComplete: 'off',
              placeholder: 'Part number or keyword',
              className: 'min-w-0 flex-1 bg-transparent px-3 py-3.5 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none'
            }),
            React.createElement(
              'button',
              { type: 'submit', className: 'm-1.5 rounded-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-5 sm:px-8 text-sm font-semibold uppercase tracking-wide text-white hover:opacity-90' },
              'Search'
            )
          ),
          React.createElement(
            'div',
            { className: 'mt-3 flex flex-wrap items-center gap-2 text-sm' },
            React.createElement('span', { className: 'text-gray-400' }, 'Popular:'),
            ...['DD15', 'V-band clamp', 'Oil filter', 'Coolant hose', 'O-ring'].map((t) =>
              React.createElement(
                Link,
                {
                  key: t,
                  href: `/products?q=${encodeURIComponent(t)}`,
                  onClick: () => setIsSearchOpen(false),
                  className: 'rounded-full border border-white/25 px-3 py-1 text-gray-200 hover:border-[#00a550] hover:text-white transition-colors'
                },
                t
              )
            )
          )
        )
      )
    );

  useEffect(() => {
    const el = headerBarRef.current;
    if (!el) return undefined;

    const updateHeight = () => setHeaderHeight(el.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  useEffect(() => {
    updateCartCount();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => updateCartCount();
    const handleCartUpdate = () => updateCartCount();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdate', handleCartUpdate);
    updateCartCount();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isProfileMenuOpen && !(target as Element).closest?.('.profile-dropdown')) {
        setIsProfileMenuOpen(false);
      }
      if (openMenu && navRef.current && !navRef.current.contains(target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen, openMenu]);

  // Escape closes any open dropdown
  useEffect(() => {
    if (!openMenu) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenMenu(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openMenu]);

  // Close mega-menu on route change
  useEffect(() => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const updateCartCount = () => {
    let cart: CartItem[] = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      cart = [];
    }
    const totalItems = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
    setCartCount(totalItems);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? 'text-[#2B2A29] text-sm font-semibold leading-normal'
      : 'text-gray-700 hover:text-[#2B2A29] text-sm font-medium leading-normal';
  };

  const toggleMenu = (key: string) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  // ---- Sub-renderers -----------------------------------------------------

  const renderChevron = (open: boolean) =>
    React.createElement(
      'svg',
      {
        className: `w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180' : ''}`,
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
      },
      React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M19 9l-7 7-7-7'
      })
    );

  const renderSimpleDropdown = (menu: NavMenu) => (
    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-5 z-40">
      <div className="fx-menu-in w-80 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 font-display">
        <ul>
          {(menu.links ?? []).filter(liveLink).map((link) => {
            const active = pathname === link.to;
            const icon = RESOURCE_ICONS[link.to];
            const desc = link.desc ?? RESOURCE_DESCS[link.to];
            return (
              <li key={link.to}>
                <Link
                  href={link.to}
                  onClick={() => setOpenMenu(null)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    active ? 'bg-[#eefaf3]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-gradient-to-br group-hover:from-[#e9e611] group-hover:to-[#00a34f] group-hover:text-white">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon ?? 'M9 5l7 7-7 7'} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[15px] font-bold ${active ? 'text-[#00a550]' : 'text-gray-900 group-hover:text-[#00a550]'}`}>
                      {link.label}
                    </span>
                    {desc && <span className="block text-xs text-gray-500">{desc}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  const renderNavItem = ({ key, label }: { key: string; label: string }) => {
    const isOpen = openMenu === key;
    const menu = NAV_MENUS[key];
    const labelClassName = `text-sm font-semibold leading-normal transition-colors ${
      isOpen ? 'text-[#00a550]' : 'text-white hover:text-[#00a550]'
    }`;
    if (menu && menu.to) {
      return React.createElement(
        'div',
        { key, className: 'relative flex items-center' },
        React.createElement(
          Link,
          { href: menu.to, className: labelClassName, onClick: () => setOpenMenu(null) },
          label
        )
      );
    }

    return React.createElement(
      'div',
      {
        key,
        className: 'relative flex items-center gap-1',
        onMouseEnter: () => setOpenMenu(key)
      },
      React.createElement(
        'button',
        { type: 'button', 'aria-expanded': isOpen, onClick: () => setOpenMenu(key), className: `flex items-center ${labelClassName}` },
        label
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          'aria-label': `Toggle ${label} menu`,
          onClick: () => toggleMenu(key),
          className: `flex items-center ${isOpen ? 'text-[#00a550]' : 'text-white hover:text-[#00a550]'}`
        },
        renderChevron(isOpen)
      ),
      isOpen && menu && menu.type === 'simple' && key !== 'products' && renderSimpleDropdown(menu)
    );
  };

  // Products: full-width mega panel (categories with photos + engine sections + help card)
  const renderMegaPanel = () => {
    if (openMenu !== 'products') return null;
    const close = () => setOpenMenu(null);
    const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

    return (
      <div className="absolute left-0 right-0 top-full pt-3 z-40">
        <div className="fx-menu-in overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 font-display">
          <div className="h-1 w-full bg-gradient-to-r from-[#e9e611] to-[#00a34f]" />
          <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_280px]">
            {/* Shop by category */}
            <div className="p-7">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Shop by category</p>
              <ul className="grid grid-cols-2 gap-3">
                {MEGA_CATEGORIES.filter(liveLink).map((c) => (
                  <li key={c.to}>
                    <Link
                      href={c.to}
                      onClick={close}
                      className={`group flex items-center gap-3 rounded-xl border p-2.5 transition-all hover:-translate-y-0.5 hover:border-[#00a550]/40 hover:shadow-md ${
                        isActive(c.to) ? 'border-[#00a550] bg-[#eefaf3]' : 'border-gray-200'
                      }`}
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                        <img src={c.img} alt="" width={56} height={56} loading="lazy" className="h-full w-full object-contain transition-transform group-hover:scale-110" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-bold text-gray-900 group-hover:text-[#00a550]">{c.label}</span>
                        <span className="block truncate text-xs text-gray-500">{c.desc}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-6 text-sm font-bold">
                <Link href="/categories" onClick={close} className="inline-flex items-center gap-1.5 text-[#00a550] hover:gap-2.5 transition-all">
                  All Categories <Arrow />
                </Link>
                <Link href="/products" onClick={close} className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#00a550] hover:gap-2.5 transition-all">
                  All Products <Arrow />
                </Link>
              </div>
            </div>

            {/* Engine parts by diagram */}
            <div className="border-l border-gray-100 bg-gray-50/70 p-7">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Engine parts by diagram</p>
              <ul className="space-y-3">
                {MEGA_ENGINES.map((e) => (
                  <li key={e.to}>
                    <Link
                      href={e.to}
                      onClick={close}
                      className={`group flex items-center gap-4 rounded-xl border bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-[#00a550]/40 hover:shadow-md ${
                        isActive(e.to) ? 'border-[#00a550]' : 'border-gray-200'
                      }`}
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black font-heading text-sm text-white transition-colors group-hover:bg-gradient-to-br group-hover:from-[#e9e611] group-hover:to-[#00a34f]">
                        {e.mark}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold text-gray-900 group-hover:text-[#00a550]">{e.label}</span>
                        <span className="block text-xs text-gray-500">{e.desc}</span>
                      </span>
                      <Arrow className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-[#00a550]" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-gray-500">
                Open a diagram, click the numbered callout and add the exact part to your cart.
              </p>
            </div>

            {/* Help card */}
            <div className="relative flex flex-col justify-end overflow-hidden bg-black p-6 text-white">
              <img src="/images/menu/promo.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e9e611]">Can&rsquo;t find a part?</p>
                <p className="mt-2 text-lg font-bold leading-snug">Send us the part number &mdash; we&rsquo;ll check stock &amp; price.</p>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                >
                  Call {phone}
                </a>
                <Link href="/contact" onClick={close} className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-bold hover:bg-white hover:text-black transition-colors">
                  Request a part <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAccountIcon = () => {
    if (isAuthenticated) {
      return React.createElement(
        'div',
        { className: 'relative profile-dropdown' },
        React.createElement(
          'button',
          {
            onClick: () => setIsProfileMenuOpen(!isProfileMenuOpen),
            className: 'flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 text-white transition-colors'
          },
          React.createElement(
            'svg',
            { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            })
          )
        ),
        isProfileMenuOpen && React.createElement(
          'div',
          { className: 'absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50' },
          React.createElement(
            'div',
            { className: 'px-4 py-3 border-b border-gray-200' },
            React.createElement('p', { className: 'text-sm font-semibold text-gray-900 truncate' }, user?.name),
            React.createElement('p', { className: 'text-xs text-gray-500 mt-1 truncate' }, user?.email)
          ),
          [
            { label: 'My Account', path: '/account' },
            { label: 'My Orders', path: '/account/orders' },
            { label: 'My Addresses', path: '/account/addresses' },
            { label: 'Profile', path: '/account/profile' },
            { label: 'Change Password', path: '/account/password' }
          ].map((item, i) =>
            React.createElement(
              'button',
              {
                key: i,
                onClick: () => {
                  setIsProfileMenuOpen(false);
                  navigate(item.path);
                },
                className: 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              },
              item.label
            )
          ),
          React.createElement('div', { className: 'border-t border-gray-200 my-2' }),
          React.createElement(
            'button',
            {
              onClick: () => {
                setIsProfileMenuOpen(false);
                handleLogout();
              },
              className: 'w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
            },
            'Logout'
          )
        )
      );
    }

    return React.createElement(
      'div',
      { className: 'flex items-center gap-2' },
      React.createElement(
        Link,
        {
          href: '/signup',
          className: 'flex items-center justify-center h-9 px-4 rounded border border-transparent bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:from-transparent hover:to-transparent hover:border-white text-white text-sm font-medium transition-all duration-300'
        },
        'Sign Up'
      ),
      React.createElement(
        Link,
        {
          href: '/login',
          className: 'flex items-center justify-center h-9 px-4 rounded border-2 border-white text-white hover:bg-gradient-to-r hover:from-[#e9e611] hover:to-[#00a34f] hover:border-[#00a34f] hover:text-white text-sm font-medium transition-colors'
        },
        'Log In'
      )
    );
  };

  return React.createElement(
    React.Fragment,
    null,

    React.createElement(
    'div',
    { className: 'w-full fixed top-0 left-0 right-0 z-50 bg-black font-heading' },

    // ---- Promo bar ----
    // promoText && React.createElement(
    //   'div',
    //   { className: 'w-full bg-[#00a550] text-white text-center text-sm font-medium py-2 px-4' },
    //   promoText
    // ),

    // ---- Header ----
    React.createElement(
      'header',
      { ref: headerBarRef, className: 'w-full bg-black border-b border-white/10 font-heading' },
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto px-4 md:px-0 lg:px-0' },

        // Single inline row: logo + nav + phone + icons
        React.createElement(
          'div',
          { ref: navRef, className: 'relative flex items-center justify-between py-3 gap-6', onMouseLeave: () => setOpenMenu(null) },
          React.createElement(
            'div',
            { className: 'w-32 h-12 md:w-40 md:h-14 overflow-hidden flex items-center cursor-pointer flex-shrink-0', onClick: () => navigate('/') },
            React.createElement(Image, {
              src: '/fleet-x.png',
              alt: 'Fleet X Parts',
              width: 2634,
              height: 583,
              priority: true,
              className: 'w-full h-auto object-contain'
            })
          ),
          React.createElement(
            'nav',
            { className: 'hidden lg:flex items-center gap-8' },
            ...NAV_ORDER.map(renderNavItem)
          ),
          React.createElement(
            'div',
            { className: 'hidden lg:flex items-center gap-5 flex-shrink-0' },
            phone && React.createElement(
              'a',
              { href: `tel:${phone.replace(/[^0-9+]/g, '')}`, className: 'text-lg font-semibold text-white hover:text-[#00a550] transition-colors' },
              phone
            ),
            renderSearchButton(),
            renderAccountIcon(),
            React.createElement(
              'button',
              {
                onClick: () => navigate('/cart'),
                className: 'relative flex items-center justify-center w-9 h-9 rounded-full text-white hover:bg-gradient-to-r hover:from-[#e9e611] hover:to-[#00a34f] hover:text-white transition-colors'
              },
              React.createElement(
                'svg',
                { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                React.createElement('path', {
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: 2,
                  d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                })
              ),
              cartCount > 0 && React.createElement(
                'span',
                { className: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center' },
                cartCount > 99 ? '99+' : cartCount
              )
            )
          ),
          // Mobile search + menu buttons
          React.createElement('div', { className: 'lg:hidden ml-auto -mr-1' }, renderSearchButton()),
          React.createElement(
            'button',
            {
              className: 'lg:hidden flex items-center justify-center w-8 h-8 text-white hover:text-[#00a550]',
              'aria-label': 'Open menu',
              'aria-expanded': isMobileMenuOpen,
              onClick: () => setIsMobileMenuOpen(true)
            },
            React.createElement(
              'svg',
              { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 2,
                d: 'M4 6h16M4 12h16M4 18h16'
              })
            )
          ),
          renderMegaPanel()
        )
      )
    ),

    // ---- Expanding search panel (drops over the banner) ----
    renderSearchPanel(),

    // ---- Mobile menu (slide-in drawer) ----
    React.createElement(MobileDrawer, {
      open: isMobileMenuOpen,
      onClose: () => setIsMobileMenuOpen(false),
      sections: drawerSections,
      cartCount,
      isAuthenticated,
      onLogout: handleLogout,
      phone
    })
    ),

    // ---- Spacer to offset the fixed header's height ----
    React.createElement('div', {
      'aria-hidden': true,
      style: { height: headerHeight ? `${headerHeight}px` : undefined }
    })
  );
};

export default Header;
