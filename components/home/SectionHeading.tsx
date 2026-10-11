import Link from 'next/link';

type Props = { id?: string; eyebrow?: string; title: string; link?: { href: string; label: string }; dark?: boolean };

const SectionHeading = ({ id, eyebrow, title, link, dark }: Props) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
    <div>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#00a550]">{eyebrow}</p>}
      <h2 id={id} className={`mt-2 text-2xl font-bold md:text-4xl ${dark ? 'text-white' : 'text-[#1d1d1b]'}`}>{title}</h2>
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#00a550] to-[#f8ef05]" aria-hidden="true" />
    </div>
    {link && (
      <Link href={link.href} className="text-sm font-bold text-[#00a550] transition-opacity hover:opacity-80 md:text-base">
        {link.label} &rarr;
      </Link>
    )}
  </div>
);

export default SectionHeading;
