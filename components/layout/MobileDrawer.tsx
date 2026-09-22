'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type DrawerLink = { label: string; to: string };
// A section either expands to show `links`, or (when it has no links) is a plain link to `to`.
export type DrawerSection = { key: string; label: string; links?: DrawerLink[]; to?: string };

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  sections: DrawerSection[];
  cartCount: number;
  isAuthenticated: boolean;
  onLogout: () => void;
  phone?: string;
};

const isActive = (pathname: string, to: string) =>
  pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    className={`h-5 w-5 shrink-0 text-white/60 transition-transform duration-300 ${open ? 'rotate-180 text-[#00a550]' : ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MobileDrawer({
  open,
  onClose,
  sections,
  cartCount,
  isAuthenticated,
  onLogout,
  phone,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // When opening, expand the section that contains the current page.
  useEffect(() => {
    if (!open) return;
    const current = sections.find((s) => s.links?.some((l) => isActive(pathname, l.to)));
    setExpanded(current?.key ?? null);
    closeRef.current?.focus();
  }, [open, pathname, sections]);

  // Lock page scroll and close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const tel = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : undefined;

  return createPortal(
    <div
      className={`lg:hidden fixed inset-0 z-[100] ${
        open ? 'visible' : 'invisible pointer-events-none transition-[visibility] delay-300'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className={`absolute right-0 top-0 flex h-dvh w-[88%] max-w-[380px] flex-col overflow-hidden bg-[#0a0a0a] text-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#00a550] to-[#f8ef05]" />

        {/* Top row */}
        <div className="flex shrink-0 items-center justify-between px-5 py-4">
          <Link href="/" onClick={onClose} aria-label="Fleet X Parts home" className="block w-32">
            <Image
              src="/fleet-x.png"
              alt="Fleet X Parts"
              width={2634}
              height={583}
              className="h-auto w-full object-contain"
            />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a550]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <ul className="space-y-1">
            {sections.map((section) => {
              // No submenu: render a simple link row.
              if (!section.links?.length && section.to) {
                const active = isActive(pathname, section.to);
                return (
                  <li key={section.key}>
                    <Link
                      href={section.to}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-lg font-semibold text-white/90 transition-colors hover:bg-white/5"
                    >
                      {active && <span className="h-2 w-2 rounded-full bg-[#00a550]" aria-hidden="true" />}
                      {section.label}
                    </Link>
                  </li>
                );
              }

              const links = section.links ?? [];
              const isOpen = expanded === section.key;
              const sectionActive = links.some((l) => isActive(pathname, l.to));
              return (
                <li key={section.key} className="rounded-xl">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : section.key)}
                    aria-expanded={isOpen}
                    aria-controls={`drawer-${section.key}`}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-lg font-semibold transition-colors hover:bg-white/5 ${
                      isOpen || sectionActive ? 'text-white' : 'text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {sectionActive && <span className="h-2 w-2 rounded-full bg-[#00a550]" aria-hidden="true" />}
                      {section.label}
                    </span>
                    <Chevron open={isOpen} />
                  </button>

                  <div
                    id={`drawer-${section.key}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="mb-2 ml-6 border-l border-white/15 py-1">
                        {links.map((link) => {
                          const active = isActive(pathname, link.to);
                          return (
                            <li key={link.to}>
                              <Link
                                href={link.to}
                                onClick={onClose}
                                tabIndex={isOpen ? 0 : -1}
                                aria-current={active ? 'page' : undefined}
                                className={`-ml-px block border-l-2 py-2.5 pl-5 pr-3 text-[15px] transition-colors ${
                                  active
                                    ? 'border-[#00a550] font-semibold text-[#00a550]'
                                    : 'border-transparent text-white/70 hover:border-white/40 hover:text-white'
                                }`}
                              >
                                {link.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer: cart, account, phone */}
        <div className="shrink-0 space-y-3 border-t border-white/10 bg-white/[0.03] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/cart"
              onClick={onClose}
              className="relative flex items-center justify-center gap-2 rounded-xl border border-white/15 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="rounded-xl border border-red-400/40 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center rounded-xl border border-white/15 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Log In
              </Link>
            )}
          </div>

          {!isAuthenticated && (
            <Link
              href="/signup"
              onClick={onClose}
              className="block rounded-xl bg-gradient-to-r from-[#e9e611] to-[#00a34f] py-3 text-center text-sm font-bold text-white shadow-lg shadow-[#00a34f]/20 transition-opacity hover:opacity-90"
            >
              Create an account
            </Link>
          )}

          {tel && (
            <a
              href={tel}
              className="flex items-center justify-center gap-2 pt-1 text-sm font-semibold text-white/80 transition-colors hover:text-[#00a550]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {phone}
            </a>
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
}
