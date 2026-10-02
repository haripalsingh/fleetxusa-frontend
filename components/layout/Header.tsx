'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MobileDrawer from './MobileDrawer';
import type { DrawerSection } from './MobileDrawer';

type NavLink = { label: string; to: string };
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
            { label: 'All Categories', to: '/categories' },

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

const Header = ({ phone = '(000) 000-0000' }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const navigate = (to: string) => router.push(to);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null); // 'products' | 'about' | 'resources' | 'contact' | null
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const headerBarRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

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

  const renderSimpleDropdown = (menu: NavMenu) =>
    React.createElement(
      'div',
      { className: 'absolute left-0 top-full mt-2 bg-white/75 backdrop-blur-md border border-gray-200 shadow-xl z-40 min-w-[220px] rounded-lg overflow-hidden' },
      React.createElement(
        'ul',
        { className: 'py-3' },
        ...(menu.links ?? []).map((link, i) =>
          React.createElement(
            'li',
            { key: i },
            React.createElement(
              Link,
              {
                href: link.to,
                className: 'block px-5 py-2 text-sm text-[#2B2A29] font-medium hover:text-[#00a550] hover:bg-gray-50 transition-colors',
                onClick: () => setOpenMenu(null)
              },
              link.label
            )
          )
        )
      )
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
        { type: 'button', onClick: () => toggleMenu(key), className: `flex items-center ${labelClassName}` },
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
      isOpen && menu && menu.type === 'simple' && renderSimpleDropdown(menu)
    );
  };

  const renderMegaPanel = () => {
    if (openMenu !== 'products') return null;
    const menu = NAV_MENUS.products;
    if (!menu || menu.type !== 'mega') return null;

    return React.createElement(
      'div',
      { className: 'absolute left-0 right-0 top-full bg-white/75 backdrop-blur-md border-t border-gray-200 shadow-xl z-40 rounded-lg' },
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto px-4 md:px-0   lg:px-10 py-8 rounded-lg' },
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
          ...(menu.columns ?? []).map((col, i) =>
            React.createElement(
              'div',
              { key: i },
              React.createElement('h3', { className: 'text-[#00a550] font-bold text-base mb-3' }, col.title),
              React.createElement(
                'ul',
                { className: 'space-y-2' },
                ...col.links.map((link, j) =>
                  React.createElement(
                    'li',
                    { key: j },
                    React.createElement(
                      Link,
                      {
                        href: link.to,
                        className: 'text-[#2B2A29] text-sm font-medium hover:text-[#00a550] transition-colors',
                        onClick: () => setOpenMenu(null)
                      },
                      link.label
                    )
                  )
                )
              )
            )
          )
        ),
        menu.footerLinks && React.createElement(
          'div',
          { className: 'mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-8' },
          ...menu.footerLinks.map((link, i) =>
            React.createElement(
              Link,
              {
                key: i,
                href: link.to,
                className: 'flex items-center gap-2 text-[#00a550] font-bold text-base hover:opacity-80 transition-opacity',
                onClick: () => setOpenMenu(null)
              },
              link.label,
              React.createElement(
                'svg',
                { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                React.createElement('path', {
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: 2,
                  d: 'M17 8l4 4m0 0l-4 4m4-4H3'
                })
              )
            )
          )
        )
      )
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
          // Mobile menu button
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

    // ---- Mobile menu (slide-in drawer) ----
    React.createElement(MobileDrawer, {
      open: isMobileMenuOpen,
      onClose: () => setIsMobileMenuOpen(false),
      sections: DRAWER_SECTIONS,
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
