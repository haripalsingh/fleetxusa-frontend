import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import PolicyPage from '@/components/PolicyPage';
import type { PolicySection } from '@/components/PolicyPage';

const DESCRIPTION =
  `Read our cancellation and refund policy, including restocking fees and eligibility windows.`;

export const metadata: Metadata = pageMetadata({
  title: 'Cancellation & Refund Policy | Fleet X Parts',
  description: DESCRIPTION,
  keywords: 'cancellation policy, refund policy, restocking fee',
  path: '/cancellation-refund-policy',
});

const SECTIONS: PolicySection[] = [
  {
    heading: `Order Cancellations`,
    blocks: [
      {
        type: 'ul',
        items: [
          { lead: `Before processing/shipment: `, text: `You may cancel an order at no charge if it has not been pulled, processed, special-ordered, or shipped.` },
          { lead: `After shipment or after "ready for pickup": `, text: `If an order has already shipped or has been prepared for pickup, cancellation is treated as a return (if eligible) and may be subject to the 10% restocking fee, plus any non-refundable shipping/handling charges.` },
          { lead: `Special orders / drop-ship orders: `, text: `Special-order items may not be cancellable once placed with the supplier. If cancellation is possible, supplier fees and the 10% restocking fee may apply.` },
        ],
      },
    ],
  },
  {
    heading: `Refund & Return Eligibility (30-Day Window)`,
    blocks: [
      { type: 'p', text: `Most new, unused, uninstalled items may be returned within 30 days of purchase (or delivery date for shipped orders) if:` },
      {
        type: 'ul',
        items: [
          `Proof of purchase is provided (receipt/order number), and`,
          `The item is in original packaging with all accessories, manuals, and hardware, and`,
          `The item is in resalable condition (no damage, wear, installation marks, writing/labels on packaging, or missing parts).`,
        ],
      },
    ],
  },
  {
    heading: `15% Restocking Fee`,
    blocks: [
      { type: 'p', text: `A 15% restocking fee applies to most eligible returns that are not due to our error or a confirmed defect. This is an industry-standard fee to cover handling, inspection/testing, repackaging, and inventory costs.` },
      { type: 'p', text: `The restocking fee generally applies when:` },
      {
        type: 'ul',
        items: [
          `The wrong item was ordered, item is no longer needed, or return is for preference/fitment reasons.`,
          `Packaging has been opened and/or internal packaging is missing (even if the item is unused).`,
        ],
      },
      { type: 'p', text: `The restocking fee may be waived (at our discretion) when:` },
      {
        type: 'ul',
        items: [`We shipped the wrong item, or`, `The item is confirmed defective out of the box (see below).`],
      },
    ],
  },
  {
    heading: `Final Sale / Non-Refundable Items`,
    blocks: [
      { type: 'p', text: `Unless required by law, the following are final sale and not eligible for return or refund:` },
      {
        type: 'ul',
        items: [
          `Electrical/electronic parts once opened (including, but not limited to: sensors, switches, modules, ECUs/ECMs, lighting electronics, control units)`,
          `Special-order or custom items`,
          `Clearance/final sale items marked as such`,
          `Installed, used, modified, or damaged parts`,
          `Fluids, chemicals, adhesives, paints, and other hazardous/consumable items once opened`,
          `Items missing original packaging, UPC/barcodes/labels, or included components`,
        ],
      },
    ],
  },
  {
    heading: `Wrong, Damaged, or Defective Items`,
    blocks: [
      {
        type: 'ul',
        items: [
          { lead: `Wrong item shipped by us: `, text: `Contact us within 7 days. We will correct the issue. No restocking fee.` },
          { lead: `Shipping damage: `, text: `Report within 48 hours of delivery with photos of the item, packaging, and shipping label. Keep all packaging until resolved.` },
          { lead: `Defective items: `, text: `Contact us within 7 days. We may require troubleshooting details and/or return for inspection/testing. Remedies may include replacement, repair, or refund consistent with supplier/manufacturer terms.` },
        ],
      },
    ],
  },
  {
    heading: `Refund Method & Timing`,
    blocks: [
      {
        type: 'ul',
        items: [
          `Approved refunds are issued to the original payment method when possible.`,
          `Refunds are processed after inspection and approval, typically within 3–10 business days (your bank may take additional time to post).`,
          `Original shipping charges are non-refundable except where required by law or due to our error.`,
        ],
      },
    ],
  },
];

export default function CancellationRefundPolicyPage() {
  return (
    <PolicyPage
      title="Cancellation & Refund Policy"
      subtitle="Effective Date: December 17, 2025"
      intro={[`This policy applies to all purchases made from FLEET X PARTS in-store, by phone, or online.`]}
      sections={SECTIONS}
      contact="Contact for cancellations/returns: support@fleetxusa.com"
    />
  );
}
