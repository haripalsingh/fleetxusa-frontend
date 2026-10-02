import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import PolicyPage from '@/components/PolicyPage';
import type { PolicySection } from '@/components/PolicyPage';

const DESCRIPTION =
  `Learn about Fleet X Parts shipping times, carriers, costs, and our return and refund process.`;

export const metadata: Metadata = pageMetadata({
  title: 'Shipping & Return Policy | Fleet X Parts',
  description: DESCRIPTION,
  keywords: 'shipping policy, return policy, truck parts returns',
  path: '/shipping-return-policy',
});

const SECTIONS: PolicySection[] = [
  {
    heading: `Shipping Coverage & Carriers`,
    blocks: [
      { type: 'p', text: `We ship within the United States using carriers such as UPS, FedEx, USPS, and freight carriers depending on package size and weight.` },
    ],
  },
  {
    heading: `Processing Times`,
    blocks: [
      {
        type: 'ul',
        items: [
          `Most in-stock orders process within 1–5 business days (excluding weekends/holidays).`,
          `Special orders and drop-ship items may have longer lead times.`,
        ],
      },
    ],
  },
  {
    heading: `Shipping Costs`,
    blocks: [
      { type: 'p', text: `Shipping charges are calculated at checkout or quoted at time of order. Oversized/heavy items may require freight shipping and additional fees (e.g., liftgate service, residential delivery, appointment delivery).` },
    ],
  },
  {
    heading: `Tracking & Delivery`,
    blocks: [
      { type: 'p', text: `Tracking is provided when available. Delivery dates are estimates and not guaranteed.` },
    ],
  },
  {
    heading: `Incorrect Address / Undeliverable Packages`,
    blocks: [
      { type: 'p', text: `If an order is returned due to an incorrect address or failed delivery attempts:` },
      {
        type: 'ul',
        items: [
          `Shipping charges are non-refundable.`,
          `Reshipment fees may apply, or a refund may be issued minus shipping and any applicable fees.`,
        ],
      },
    ],
  },
  {
    heading: `Return Shipping (For Eligible Returns)`,
    blocks: [
      {
        type: 'ul',
        items: [
          `Return shipping costs are the customer's responsibility unless the return is due to our error or confirmed shipping damage/defect.`,
          `Use a trackable, insured shipping method. We are not responsible for returns lost or damaged in transit.`,
          `Items must be packed securely to prevent damage.`,
        ],
      },
    ],
  },
  {
    heading: `Return Authorization`,
    blocks: [
      { type: 'p', text: `We strongly recommend contacting us before returning any item to receive instructions and avoid delays or rejected returns.` },
    ],
  },
];

export default function ShippingReturnPolicyPage() {
  return (
    <PolicyPage
      title="Shipping & Return Policy"
      subtitle="Everything you need to know about shipping times, carriers, and how our returns process works."
      sections={SECTIONS}
      contact="For questions about shipping or returns, please contact us at support@fleetxusa.com."
    />
  );
}
