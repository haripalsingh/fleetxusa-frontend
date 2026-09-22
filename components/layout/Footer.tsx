import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Contact icon, wrapped in a gray box that turns green on hover of the row (see FooterIconBox)
const FooterIcon = (d: string) =>
  React.createElement(
    'svg',
    { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d })
  );

const FooterIconBox = (d: string) =>
  React.createElement(
    'div',
    { className: 'w-8 h-8 flex items-center justify-center rounded-md bg-white/10 text-white flex-shrink-0 group-hover:bg-gradient-to-r group-hover:from-[#e9e611] group-hover:to-[#00a34f] group-hover:text-white transition-colors' },
    FooterIcon(d)
  );

// Social media icons (filled brand glyphs)
const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: '#',
    icon: React.createElement(
      'svg',
      { viewBox: '0 0 24 24', fill: 'currentColor', className: 'w-4 h-4' },
      React.createElement('path', {
        d: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.58v1.9h2.78l-.44 2.91h-2.34v7.03C18.34 21.24 22 17.08 22 12.06z'
      })
    )
  },
  {
    name: 'X',
    href: '#',
    icon: React.createElement(
      'svg',
      { viewBox: '0 0 24 24', fill: 'currentColor', className: 'w-4 h-4' },
      React.createElement('path', {
        d: 'M18.24 3h3.11l-6.79 7.76L22.5 21h-6.26l-4.9-6.41L5.7 21H2.58l7.26-8.3L2 3h6.42l4.43 5.86L18.24 3zm-1.09 16.17h1.72L7.94 4.74H6.09l11.06 14.43z'
      })
    )
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: React.createElement(
      'svg',
      { viewBox: '0 0 24 24', fill: 'currentColor', className: 'w-4 h-4' },
      React.createElement('path', {
        d: 'M6.94 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM2.4 8.75h4.08V21H2.4V8.75zm7.13 0h3.91v1.68h.06c.55-1.03 1.88-2.12 3.87-2.12 4.14 0 4.9 2.72 4.9 6.26V21h-4.08v-5.68c0-1.35-.02-3.09-1.88-3.09-1.88 0-2.17 1.47-2.17 2.99V21H9.53V8.75z'
      })
    )
  },
  {
    name: 'YouTube',
    href: '#',
    icon: React.createElement(
      'svg',
      { viewBox: '0 0 24 24', fill: 'currentColor', className: 'w-4 h-4' },
      React.createElement('path', {
        d: 'M21.58 7.2a2.78 2.78 0 00-1.95-1.97C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.63.48A2.78 2.78 0 002.42 7.2 29 29 0 002 12a29 29 0 00.42 4.8 2.78 2.78 0 001.95 1.97c1.73.48 7.63.48 7.63.48s5.9 0 7.63-.48a2.78 2.78 0 001.95-1.97A29 29 0 0022 12a29 29 0 00-.42-4.8zM9.94 15.02V8.98L15.5 12l-5.56 3.02z'
      })
    )
  },
  {
    name: 'Instagram',
    href: '#',
    icon: React.createElement(
      'svg',
      { viewBox: '0 0 24 24', fill: 'currentColor', className: 'w-4 h-4' },
      React.createElement('path', {
        d: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.23.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.23.41-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 01-1.38-.9 3.71 3.71 0 01-.9-1.38c-.16-.42-.36-1.05-.41-2.23-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.5.01-4.74.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.74-.34.34-.55.67-.74 1.13-.14.35-.3.87-.34 1.83-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.96.2 1.48.34 1.83.18.46.39.79.74 1.13.34.34.67.55 1.13.74.35.14.87.3 1.83.34 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.74.34-.34.55-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.96-.2-1.48-.34-1.83a3.04 3.04 0 00-.74-1.13 3.04 3.04 0 00-1.13-.74c-.35-.14-.87-.3-1.83-.34-1.24-.06-1.59-.07-4.74-.07zm0 4.14a4.08 4.08 0 110 8.16 4.08 4.08 0 010-8.16zm0 6.73a2.65 2.65 0 100-5.3 2.65 2.65 0 000 5.3zm5.19-6.89a.95.95 0 11-1.9 0 .95.95 0 011.9 0z'
      })
    )
  }
];

const Footer = () => {
  return React.createElement(
    'footer',
    { className: 'bg-black text-white mt-auto w-full' },
    React.createElement(
      'div',
      { className: 'w-full h-1.5 flex' },
      React.createElement('div', { className: 'w-1/2 h-full bg-[#e9e611]' }),
      React.createElement('div', { className: 'w-1/2 h-full bg-[#00a34f]' })
    ),
    React.createElement(
      'div',
      { className: 'max-w-[1320px] mx-auto px-4 pt-10' },
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10' },

        // About Section
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement(Image, { src: '/fleet-x.png', alt: 'FleetX', width: 2634, height: 583, className: 'h-8 w-32 mb-1' }),
          React.createElement('div', { className: 'w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mb-3' }),
         // React.createElement('p', { className: 'text-base text-gray-400 leading-relaxed' }, 'Your trusted partner for heavy-duty truck parts and accessories. Quality parts for the long haul.'),

          // Social icons
          React.createElement(
            'div',
            { className: 'flex items-center gap-3 mt-2' },
            SOCIAL_LINKS.map((social) =>
              React.createElement(
                'a',
                {
                  key: social.name,
                  href: social.href,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  'aria-label': social.name,
                  className: 'w-9 h-9 flex items-center justify-center rounded-md bg-white/10 text-gray-300 hover:bg-gradient-to-r hover:from-[#e9e611] hover:to-[#00a34f] hover:text-white transition-colors'
                },
                social.icon
              )
            )
          )
        ),

        // Quick Links
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement('h3', { className: 'text-base font-bold uppercase tracking-wide text-white mb-1' }, 'Quick Links'),
          React.createElement('div', { className: 'w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mb-3' }),
          React.createElement(Link, { href: '/', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, 'Home'),
          React.createElement(Link, { href: '/products', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, 'Products'),
          React.createElement(Link, { href: '/about', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, 'About Us'),
          React.createElement(Link, { href: '/contact', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, 'Contact')
        ),

        // Customer Service
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement('h3', { className: 'text-base font-bold uppercase tracking-wide text-white mb-1' }, 'Customer Service'),
          React.createElement('div', { className: 'w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mb-3' }),
          React.createElement(Link, { href: '/privacy-policy', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, 'Privacy Policy'),
          React.createElement(Link, { href: '/terms-conditions', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, 'Terms & Conditions'),
          React.createElement(Link, { href: '/shipping-return-policy', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, 'Shipping & Return Policy'),
          React.createElement(Link, { href: '/cancellation-refund-policy', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, 'Cancellation & Refunds'),
          React.createElement(Link, { href: '/faqs', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, 'FAQs')
        ),

        // Contact Info
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement('h3', { className: 'text-base font-bold uppercase tracking-wide text-white mb-1' }, 'Contact Us'),
          React.createElement('div', { className: 'w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mb-3' }),

          // Address
          React.createElement(
            'div',
            { className: 'flex items-start gap-3 group' },
            FooterIconBox('M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z'),
            React.createElement(
              'p',
              { className: 'text-base text-gray-400 leading-snug pt-1.5' },
              '415 E 31 Street',
              React.createElement('br'),
              'Anderson, IN 46016'
            )
          ),

          // Phone
          React.createElement(
            'div',
            { className: 'flex items-center gap-3 group' },
            FooterIconBox('M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'),
            React.createElement('a', { href: 'tel:0000000000', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors' }, '000-000-0000')
          ),

          // Email
          React.createElement(
            'div',
            { className: 'flex items-center gap-3 group' },
            FooterIconBox('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'),
            React.createElement('a', { href: 'mailto:support@fleetxusa.com', className: 'text-base text-gray-400 hover:text-[#00a550] transition-colors break-all' }, 'support@fleetxusa.com')
          ),

          // Business Hours
          React.createElement(
            'div',
            { className: 'flex items-center gap-3 group' },
            FooterIconBox('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'),
            React.createElement('p', { className: 'text-base text-gray-400' }, 'Mon–Fri 9:00 AM–6:00 PM ET')
          )
        )
      ),

      React.createElement(
  'p',
  { className: 'text-base text-gray-500 text-center  border-t border-gray-900 pt-4 pb-4 mt-3' },
  '© 2026 Fleetx USA',

  '. All rights reserved. '
)
    )
  );
};

export default Footer;