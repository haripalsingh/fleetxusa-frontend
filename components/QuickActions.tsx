import Link from 'next/link';
import type { ReactNode } from 'react';

type QuickAction = {
  heading: string;
  linkLabel: string;
  href: string;
  icon: ReactNode;
};

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  className: 'w-8 h-8 md:w-9 md:h-9',
  'aria-hidden': true
} as const;

const ACTIONS: QuickAction[] = [
  {
    heading: 'Find a Dealer',
    linkLabel: 'Search',
    href: '/dealers',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 21c-4.5-4.5-7-8-7-11a7 7 0 1114 0c0 3-2.5 6.5-7 11z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={12} cy={10} r={2.5} />
      </svg>
    )
  },
  {
    heading: 'Shop Parts',
    linkLabel: 'Search',
    href: '/products',
    icon: (
      <svg {...ICON_PROPS}>
        <path
          d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2-2 2.5-2.5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    heading: 'Request a Quote',
    linkLabel: 'Get Started',
    href: '/contact',
    icon: (
      <svg {...ICON_PROPS}>
        <rect x={2} y={5} width={20} height={14} rx={2} />
        <path d="M2 10h20" strokeLinecap="round" />
        <circle cx={17} cy={15} r={1.8} />
      </svg>
    )
  }
];

// Quick actions — Find a Dealer / Shop Parts / Request a Quote cards with a hover accent bar.
const QuickActions = () => {
  return (
    <section className="w-full bg-white font-display">
      <div className="max-w-[1320px] mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {ACTIONS.map((action) => (
            <Link
              key={action.heading}
              href={action.href}
              className="group relative flex h-64 md:h-72 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-7 md:p-10 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:bg-white"
            >
              {/* Top accent bar that expands on hover */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#e9e611] to-[#00a34f] transition-all duration-300 group-hover:w-full" />

              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#e9e611] group-hover:to-[#00a34f] group-hover:text-white group-hover:shadow-lg">
                {action.icon}
              </div>

              <div>
                <h3 className="font-heading mb-2 text-lg md:text-xl font-extrabold uppercase tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[#00a550]">
                  {action.heading}
                </h3>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-900 transition-colors duration-300 group-hover:text-[#00a550]">
                  {action.linkLabel}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
