import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import PolicyPage from '@/components/PolicyPage';
import type { PolicySection } from '@/components/PolicyPage';

const DESCRIPTION =
  `Fleet X USA shipping policy: U.S.-only shipping, order processing times, DHL parcel and LTL freight delivery, shipping costs, tracking, and damage claims.`;

export const metadata: Metadata = pageMetadata({
  title: "Shipping Policy | Fleet X Parts",
  description: DESCRIPTION,
  keywords: "shipping policy, truck parts shipping, LTL freight delivery, DHL shipping, Fleet X USA, Fleet X Parts",
  path: "/shipping-return-policy",
});

const SECTIONS: PolicySection[] = [
  {
    heading: `1. Shipping Area`,
    blocks: [
      { type: 'p', text: `We ship within the United States only. We do not currently ship internationally. Shipments to Alaska, Hawaii, U.S. territories, and P.O. boxes may have additional charges, longer transit times, or restrictions—please contact us before ordering if you have questions.` }
    ],
  },
  {
    heading: `2. Order Processing Time`,
    blocks: [
      { type: 'p', text: `Orders are typically processed within 1–2 business days after payment is confirmed. Orders are not processed or shipped on weekends or U.S. holidays. Large, oversized, or special-order items may require additional processing time. You will receive a confirmation email once your order ships.` },
      { type: 'p', text: `Processing may be delayed for orders awaiting fitment verification, backordered items, or payment/fraud review.` }
    ],
  },
  {
    heading: `3. Shipping Methods`,
    blocks: [
      { type: 'p', text: `We use the following methods depending on the size and weight of your items:` },
      {
        type: 'ul',
        items: [
          { lead: `Parcel shipping (DHL): `, text: `Smaller parts and components ship via DHL or a comparable parcel carrier.` },
          { lead: `LTL freight: `, text: `Large, heavy, or oversized items (such as bumpers, body panels, axles, radiators, and similar) ship via less-than-truckload (LTL) freight carriers.` },
        ],
      },
      { type: 'p', text: `We reserve the right to select the carrier and shipping method that best suits each order.` }
    ],
  },
  {
    heading: `4. Shipping Costs`,
    blocks: [
      { type: 'p', text: `Shipping charges are calculated at checkout based on the destination, weight, and dimensions of your order. For oversized or freight items, shipping may be quoted separately before your order is finalized. You are responsible for all shipping charges unless otherwise stated (for example, where we specify free or promotional shipping).` }
    ],
  },
  {
    heading: `5. Transit Times`,
    blocks: [
      { type: 'p', text: `Transit times are estimates provided by the carrier and are not guaranteed. Delivery times may be affected by weather, carrier delays, remote delivery locations, and other factors beyond our control. Parcel shipments generally arrive within standard DHL transit windows; LTL freight shipments may take longer.` }
    ],
  },
  {
    heading: `6. Tracking`,
    blocks: [
      { type: 'p', text: `Once your order ships, we will email you a tracking number so you can monitor your shipment. For freight shipments, the carrier will typically contact you to arrange delivery.` }
    ],
  },
  {
    heading: `7. LTL Freight Deliveries`,
    blocks: [
      { type: 'p', text: `Freight shipments have special requirements. Please note the following:` },
      {
        type: 'ul',
        items: [
          { lead: `Delivery appointment: `, text: `The freight carrier will usually call to schedule a delivery appointment. Someone must be available to receive and sign for the shipment.` },
          { lead: `Liftgate / accessorials: `, text: `Curbside delivery is standard. If you require a liftgate, residential delivery, inside delivery, or other services, let us know in advance—additional fees may apply.` },
          { lead: `Inspect before signing: `, text: `You (or your receiver) must inspect the shipment for damage before signing the delivery receipt/bill of lading (see Section 8).` },
        ],
      }
    ],
  },
  {
    heading: `8. Shipping Damage, Shortages, and Inspection`,
    blocks: [
      {
        type: 'ul',
        items: [
          { lead: `Parcel shipments: `, text: `If your package arrives damaged, keep all packaging and contact us at Support@fleetxusa.com within 2 business days of delivery with photos.` },
          { lead: `Freight shipments: `, text: `Inspect the shipment carefully before signing. If you see any damage or shortage, note it in detail on the delivery receipt/bill of lading and take photos before the driver leaves. Refuse the shipment only if it is severely damaged. Report any damage to us within 2 business days of delivery.` },
        ],
      },
      { type: 'p', text: `Failure to note freight damage at the time of delivery may limit our and the carrier's ability to process a damage claim.`, strong: true }
    ],
  },
  {
    heading: `9. Lost or Delayed Shipments`,
    blocks: [
      { type: 'p', text: `If your tracking shows no movement or your shipment appears lost, contact us at Support@fleetxusa.com and we will work with the carrier to locate it or file a claim. Claims for lost shipments are subject to carrier investigation timelines.` }
    ],
  },
  {
    heading: `10. Address Accuracy`,
    blocks: [
      { type: 'p', text: `Please ensure your shipping address is complete and accurate. We are not responsible for delays, misdeliveries, or additional charges resulting from an incorrect or incomplete address. Address corrections or re-delivery after shipment may incur additional fees from the carrier.` }
    ],
  },
  {
    heading: `11. Backorders and Out-of-Stock Items`,
    blocks: [
      { type: 'p', text: `If an item is backordered or out of stock after you order, we will notify you with an estimated availability date and the option to wait, substitute, or cancel for a refund.` }
    ],
  },
  {
    heading: `12. Contact Us`,
    blocks: [
      { type: 'p', text: `Questions about shipping? Contact us:` },
      {
        type: 'ul',
        items: [
          { lead: `Company: `, text: `Fleet X USA` },
          { lead: `Email: `, text: `Support@fleetxusa.com` },
          { lead: `Website: `, text: `www.fleetxusa.com` },
          { lead: `Mailing Address: `, text: `1101 Milliken Ave, Ste E, Ontario, CA 91761` },
        ],
      }
    ],
  },
];

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      subtitle="Effective Date: October 14, 2026 | Last Updated: October 14, 2026"
      intro={[
        `This Shipping Policy explains how Fleet X USA ("we," "us," or "our") ships orders placed on www.fleetxusa.com. By placing an order, you agree to the terms below.`,
      ]}
      sections={SECTIONS}
    />
  );
}
