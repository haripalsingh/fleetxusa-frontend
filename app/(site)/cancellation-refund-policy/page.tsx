import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import PolicyPage from '@/components/PolicyPage';
import type { PolicySection } from '@/components/PolicyPage';

const DESCRIPTION =
  `Fleet X USA return & refund policy: 30-day returns, RMA process, 20% restocking fee, non-returnable items, warranty claims, refunds, and order cancellations.`;

export const metadata: Metadata = pageMetadata({
  title: "Return & Refund Policy | Fleet X Parts",
  description: DESCRIPTION,
  keywords: "return policy, refund policy, RMA, restocking fee, truck parts warranty, order cancellation, Fleet X USA, Fleet X Parts",
  path: "/cancellation-refund-policy",
});

const SECTIONS: PolicySection[] = [
  {
    heading: `1. Return Window`,
    blocks: [
      { type: 'p', text: `You may request a return within 30 days of the delivery date. Returns requested after 30 days will not be accepted unless covered by a product warranty (see Section 7).` }
    ],
  },
  {
    heading: `2. Return Eligibility`,
    blocks: [
      { type: 'p', text: `To be eligible for a return, items must be:` },
      {
        type: 'ul',
        items: [
          `New, unused, and uninstalled, in resalable condition.`,
          `In their original packaging, with all hardware, accessories, manuals, and labels included.`,
          `Accompanied by proof of purchase (order number or receipt).`,
        ],
      },
      { type: 'p', text: `Parts that have been installed, used, disassembled, modified, painted, or damaged by the customer are not eligible for return (except for valid warranty or defect claims).` }
    ],
  },
  {
    heading: `3. Restocking Fee`,
    blocks: [
      { type: 'p', text: `Approved returns are subject to a 20% restocking fee, which is deducted from your refund.`, strong: true },
      { type: 'p', text: `The restocking fee does not apply when the return is due to our error (wrong item shipped) or a defective product (see Sections 7 and 9).` }
    ],
  },
  {
    heading: `4. How to Start a Return (RMA Required)`,
    blocks: [
      { type: 'p', text: `All returns require a Return Merchandise Authorization (RMA) before sending anything back. To start a return:` },
      {
        type: 'ul',
        items: [
          `Email Support@fleetxusa.com with your order number, the item(s) you wish to return, and the reason.`,
          `We will review your request and, if approved, issue an RMA number and return instructions.`,
          `Clearly mark the RMA number on the return and ship it to the address we provide.`,
        ],
      },
      { type: 'p', text: `Returns sent without an RMA number may be refused or delayed.`, strong: true }
    ],
  },
  {
    heading: `5. Return Shipping Costs`,
    blocks: [
      {
        type: 'ul',
        items: [
          { lead: `Customer-initiated returns (e.g., no longer needed, ordered in error, incorrect fitment selected by the customer): `, text: `the customer is responsible for return shipping costs, and the original shipping charges are non-refundable.` },
          { lead: `Our error or defective item: `, text: `we will cover return shipping and provide a prepaid label or arrange freight pickup.` },
        ],
      },
      { type: 'p', text: `We recommend using a trackable shipping method, as we are not responsible for returns lost in transit.` }
    ],
  },
  {
    heading: `6. Non-Returnable Items`,
    blocks: [
      { type: 'p', text: `The following are not eligible for return (except for a valid defect or warranty claim):` },
      {
        type: 'ul',
        items: [
          `Electrical and electronic parts (once opened or installed).`,
          `Special-order, custom, or made-to-order items.`,
          `Installed, used, or disassembled parts.`,
          `Clearance, closeout, or "final sale" items.`,
          `Items returned without original packaging or missing components.`,
        ],
      }
    ],
  },
  {
    heading: `7. Warranty Claims`,
    blocks: [
      { type: 'p', text: `Select parts carry a limited warranty, with a maximum warranty period of one (1) year from the date of purchase (or a shorter period as specified for the product or by the manufacturer). Warranty coverage applies to defects in materials or workmanship under normal use and does not cover damage from improper installation, misuse, abuse, modification, or normal wear and tear.` },
      { type: 'p', text: `To file a warranty claim, contact Support@fleetxusa.com with your order number, a description of the issue, and photos if applicable. Approved warranty claims may be resolved by repair, replacement, or refund at our discretion. Proof of purchase is required. Some products are covered only by the manufacturer's warranty, in which case the claim will be handled according to the manufacturer's terms.` }
    ],
  },
  {
    heading: `8. Core Charges`,
    blocks: [
      { type: 'p', text: `Fleet X USA does not charge core deposits or core charges on its products. No core return is required.` }
    ],
  },
  {
    heading: `9. Damaged or Incorrect Items`,
    blocks: [
      {
        type: 'ul',
        items: [
          { lead: `Damaged in transit: `, text: `Please inspect your order upon delivery. Report shipping damage within 2 business days (see our Shipping Policy for freight inspection requirements). We will arrange a replacement or refund for verified transit damage.` },
          { lead: `Wrong item received: `, text: `If we shipped the wrong item, contact us within 5 business days of delivery and we will correct the order at no additional cost to you, including return shipping.` },
        ],
      }
    ],
  },
  {
    heading: `10. Refunds`,
    blocks: [
      { type: 'p', text: `Once we receive and inspect your return, we will notify you of the approval or rejection of your refund.` },
      {
        type: 'ul',
        items: [
          `Approved refunds are issued to the original payment method via Stripe, less any applicable restocking fee.`,
          `Please allow 5–10 business days after inspection for the refund to be processed; your bank or card issuer may take additional time to post it.`,
          `Original shipping charges are non-refundable except where the return is due to our error or a defective item.`,
        ],
      }
    ],
  },
  {
    heading: `11. Exchanges`,
    blocks: [
      { type: 'p', text: `If you need a different part, the fastest method is to return the eligible item for a refund (subject to this policy) and place a new order for the item you need. Contact Support@fleetxusa.com if you'd like help arranging an exchange.` }
    ],
  },
  {
    heading: `12. Order Cancellations`,
    blocks: [
      { type: 'p', text: `You may request to cancel an order before it ships by contacting Support@fleetxusa.com as soon as possible. If the order has already shipped, standard return terms apply. Special-order and custom items may not be cancellable once processing has begun.` }
    ],
  },
  {
    heading: `13. Contact Us`,
    blocks: [
      { type: 'p', text: `To start a return or ask a question:` },
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

export default function ReturnRefundPolicyPage() {
  return (
    <PolicyPage
      title="Return & Refund Policy"
      subtitle="Effective Date: October 14, 2026 | Last Updated: October 14, 2026"
      intro={[
        `At Fleet X USA ("we," "us," or "our"), we want you to be satisfied with your purchase. This Return & Refund Policy explains how returns, refunds, exchanges, and warranty claims work for orders placed on www.fleetxusa.com.`,
      ]}
      sections={SECTIONS}
    />
  );
}
