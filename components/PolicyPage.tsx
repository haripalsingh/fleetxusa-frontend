import type { ReactNode } from 'react';

export type PolicyBlock =
  | { type: 'p'; text: string; lead?: string; strong?: boolean }
  | { type: 'ul'; items: (string | { lead: string; text: string })[] };

export type PolicySection = {
  heading?: string;
  level?: 2 | 3;
  blocks?: PolicyBlock[];
};

type PolicyPageProps = {
  title: string;
  subtitle: string;
  intro?: string[];
  sections: PolicySection[];
  contact?: string;
};

const EMAIL_RE = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

// Turns any email address inside plain text into a mailto link.
const withLinks = (text: string): ReactNode[] =>
  text.split(EMAIL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={`mailto:${part}`}
        className="text-[#00a550] hover:text-[#00873f] underline"
      >
        {part}
      </a>
    ) : (
      part
    )
  );

const Block = ({ block }: { block: PolicyBlock }) => {
  if (block.type === 'ul') {
    return (
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
        {block.items.map((item, i) => (
          <li key={i}>
            {typeof item === 'string' ? (
              withLinks(item)
            ) : (
              <>
                <span className="font-semibold text-gray-900">{item.lead}</span>
                {withLinks(item.text)}
              </>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className={`mb-4 ${block.strong ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
      {block.lead && (
        <span className="font-semibold text-gray-900">{block.lead}</span>
      )}
      {withLinks(block.text)}
    </p>
  );
};

export default function PolicyPage({
  title,
  subtitle,
  intro,
  sections,
  contact,
}: PolicyPageProps) {
  return (
    <div className="w-full font-display">
      {/* ---- Header (black, full width) ---- */}
      <section className="w-full bg-black text-white">
        <div className="max-w-[1320px] mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">
            {title}
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mb-6" />
          <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg">
            {subtitle}
          </p>
        </div>
      </section>

      {/* ---- Plain text body ---- */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <article className="max-w-[900px] mx-auto leading-relaxed">
          {intro?.map((text, i) => (
            <p key={i} className="text-gray-700 mb-6">
              {withLinks(text)}
            </p>
          ))}

          {sections.map((section, i) => {
            const isGroup = (section.level ?? 2) === 2;
            return (
              <section key={i} className={isGroup ? 'mt-10 mb-4' : 'mb-6'}>
                {section.heading &&
                  (isGroup ? (
                    <h2 className="font-heading text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                      {section.heading}
                    </h2>
                  ) : (
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {section.heading}
                    </h3>
                  ))}
                {section.blocks?.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </section>
            );
          })}

          {contact && (
            <p className="border-t border-gray-200 pt-6 mt-10 text-gray-700">
              {withLinks(contact)}
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
