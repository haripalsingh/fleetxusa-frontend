/* eslint-disable @next/next/no-img-element */
// Footer trust strip: tells shoppers that checkout is encrypted and card payments go through Stripe.
// Card logos live in /public/images/payments. To add one (e.g. Discover, Apple Pay), drop its SVG
// there and add a line below - only list methods that are switched on in the Stripe dashboard.

const CARDS = [
  { name: 'Visa', src: '/images/payments/visa.svg', w: 49 },
  { name: 'Mastercard', src: '/images/payments/mastercard.svg', w: 38 },
  { name: 'American Express', src: '/images/payments/amex.svg', w: 28 },
];

const Icon = ({ d }: { d: string }) => (
  <svg className="h-5 w-5 shrink-0 text-[#00a550]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

const POINTS = [
  { title: 'Secure checkout', text: '256-bit SSL encryption', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { title: 'Payments by Stripe', text: 'PCI DSS Level 1 certified', d: 'M3 10h18M7 15h2m4 0h4M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { title: 'Card details stay private', text: 'We never store your full card number', d: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zm-3 9l2 2 4-4' },
];

export default function SecurePayments() {
  return (
    <section aria-label="Secure payments" className="mt-10 rounded-xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <ul className="grid gap-4 sm:grid-cols-3 lg:flex lg:gap-8">
          {POINTS.map((p) => (
            <li key={p.title} className="flex items-start gap-3">
              <Icon d={p.d} />
              <div>
                <p className="text-sm font-semibold text-white">{p.title}</p>
                <p className="text-xs text-gray-400">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">We accept</p>
          <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
            {CARDS.map((c) => (
              <li key={c.name}>
                <img src={c.src} alt={c.name} title={c.name} width={c.w} height={28} loading="lazy" className="h-7 w-auto rounded-[3px]" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-4 border-t border-white/10 pt-3 text-xs text-gray-500">
        All payments are processed securely by Stripe, Inc. Your card information is sent directly to Stripe and is never stored on our servers.
      </p>
    </section>
  );
}
