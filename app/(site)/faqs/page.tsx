import type { Metadata } from 'next';
import PolicyPage from '@/components/PolicyPage';
import type { PolicySection } from '@/components/PolicyPage';

const DESCRIPTION =
  `Answers to common questions about shipping, returns, warranty, and heavy-duty truck parts at FleetX.`;

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Fleet X Parts',
  description: DESCRIPTION,
  keywords: 'FAQ, frequently asked questions, truck parts, shipping, returns, warranty',
  robots: { index: true, follow: true },
  openGraph: { title: 'Frequently Asked Questions | Fleet X Parts', description: DESCRIPTION, siteName: 'Fleet X Parts', type: 'website' },
};

const FAQS: { category: string; items: { question: string; answer: string }[] }[] = [
  {
    category: `Orders & Shipping`,
    items: [
      {
        question: `How long does it take to process and ship my order?`,
        answer: `Most in-stock orders are processed within 1–5 business days (excluding weekends and holidays). Special orders or drop-ship items may take longer. For full details, see our Shipping & Return Policy.`,
      },
      {
        question: `Where do you ship to?`,
        answer: `We ship within the United States using carriers such as UPS, FedEx, USPS, and freight carriers for larger or heavier items.`,
      },
      {
        question: `Can I track my order?`,
        answer: `Yes. Once your order ships, tracking information is provided when available. You can also check order status from your account under My Orders.`,
      },
      {
        question: `Can I change or cancel my order after placing it?`,
        answer: `Contact us as soon as possible if you need to change or cancel an order. Once an order has shipped, our standard return process applies. See our Cancellation & Refunds page for details.`,
      },
    ],
  },
  {
    category: `Returns & Warranty`,
    items: [
      {
        question: `What is your return policy?`,
        answer: `We accept returns on eligible items — full details on timelines, condition requirements, and the process are outlined on our Shipping & Return Policy page.`,
      },
      {
        question: `Do your brake pads and rotors come with a warranty?`,
        answer: `Yes, our parts are backed by manufacturer warranties against defects in material and workmanship. Reach out to our support team with your order number for warranty assistance.`,
      },
      {
        question: `Who pays for return shipping?`,
        answer: `Return shipping costs are the customer's responsibility unless the return is due to our error or a confirmed shipping defect. We recommend contacting us before returning any item.`,
      },
    ],
  },
  {
    category: `Products`,
    items: [
      {
        question: `What makes your green brake pads different?`,
        answer: `Our trademark green brake pads are engineered for longer pad and rotor life, helping reduce maintenance costs. They're trusted by national fleets and proven across millions of miles.`,
      },
      {
        question: `How do I find the right part for my truck?`,
        answer: `Browse by category on our Products page, or use the search bar to look up parts by name or part number. If you're not sure which part you need, contact our team for help.`,
      },
      {
        question: `Do you sell to fleets and wholesale accounts?`,
        answer: `Yes, we work with national fleets and wholesale buyers. Contact us to discuss fleet pricing and account setup.`,
      },
    ],
  },
  {
    category: `Account & Support`,
    items: [
      {
        question: `Do I need an account to place an order?`,
        answer: `Creating an account lets you track orders, save addresses, and check order history, but you can also reach out directly if you'd prefer to order another way.`,
      },
      {
        question: `How can I contact support?`,
        answer: `Call us at 0000000000 or email support@fleetxusa.com. Our team is available Monday–Friday, 9:00 AM–6:00 PM ET. You can also use our Contact page.`,
      },
    ],
  },
];

// Plain text: each category is a heading, each question a sub-heading with its answer below.
const SECTIONS: PolicySection[] = FAQS.flatMap((group) => [
  { level: 2 as const, heading: group.category },
  ...group.items.map((item) => ({
    level: 3 as const,
    heading: item.question,
    blocks: [{ type: 'p' as const, text: item.answer }],
  })),
]);

export default function FaqsPage() {
  return (
    <PolicyPage
      title="Frequently Asked Questions"
      subtitle="Answers to the questions we hear most about orders, shipping, returns, and our parts."
      sections={SECTIONS}
    />
  );
}
