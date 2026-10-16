import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import PolicyPage from '@/components/PolicyPage';
import type { PolicySection } from '@/components/PolicyPage';

const DESCRIPTION =
  `Read the Fleet X USA Terms & Conditions covering orders, pricing, part fitment, payment, shipping, returns, warranty, and use of www.fleetxusa.com.`;

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions | Fleet X Parts",
  description: DESCRIPTION,
  keywords: "terms and conditions, terms of service, truck parts warranty, part fitment, Fleet X USA, Fleet X Parts",
  path: "/terms-conditions",
});

const SECTIONS: PolicySection[] = [
  {
    heading: `1. Eligibility and Accounts`,
    blocks: [
      { type: 'p', text: `You must be at least 18 years old and able to form a legally binding contract to purchase from us. Business customers represent that they are authorized to bind the business on whose behalf they purchase. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.` }
    ],
  },
  {
    heading: `2. Products and Fitment`,
    blocks: [
      { type: 'p', text: `We sell heavy-duty truck parts and related products. We make reasonable efforts to describe products accurately, but product descriptions, images, specifications, and availability may contain errors or change without notice.` },
      { type: 'p', lead: `Fitment responsibility. `, text: `It is the customer's responsibility to verify that a part is correct and compatible with their vehicle or application before ordering and before installation. This includes confirming make, model, year, engine, VIN, OEM/part numbers, and specifications. Fleet X USA is not responsible for parts ordered in error due to incorrect fitment information provided by the customer. If you are unsure, contact us at Support@fleetxusa.com before purchasing.` }
    ],
  },
  {
    heading: `3. Pricing, Availability, and Errors`,
    blocks: [
      {
        type: 'ul',
        items: [
          `All prices are listed in U.S. dollars (USD) and are subject to change without notice.`,
          `Product availability is not guaranteed, and items may be backordered or discontinued.`,
          `We reserve the right to correct any errors, inaccuracies, or omissions (including pricing and availability errors) and to cancel orders affected by such errors, even after an order has been submitted or confirmed.`,
          `Applicable sales taxes will be added at checkout unless a valid tax-exemption/resale certificate is on file.`,
        ],
      }
    ],
  },
  {
    heading: `4. Orders and Acceptance`,
    blocks: [
      { type: 'p', text: `Your submission of an order is an offer to purchase. All orders are subject to acceptance by us. We may, at our discretion, limit quantities, refuse, or cancel any order (for example, due to suspected fraud, pricing errors, or stock availability). If we cancel an order after payment, we will issue a refund to the original payment method.` }
    ],
  },
  {
    heading: `5. Payment`,
    blocks: [
      { type: 'p', text: `Payments are processed securely through Stripe. By submitting payment information, you represent that you are authorized to use the payment method. You agree to pay all charges, including applicable taxes and shipping fees, incurred under your account.` }
    ],
  },
  {
    heading: `6. Shipping and Delivery`,
    blocks: [
      { type: 'p', text: `Shipping is governed by our Shipping Policy, which is incorporated into these Terms. Title and risk of loss pass to you upon delivery to the carrier, unless otherwise required by law. Delivery dates are estimates and not guaranteed.` }
    ],
  },
  {
    heading: `7. Returns and Refunds`,
    blocks: [
      { type: 'p', text: `Returns and refunds are governed by our Return & Refund Policy, which is incorporated into these Terms.` }
    ],
  },
  {
    heading: `8. Limited Warranty and Disclaimer`,
    blocks: [
      { type: 'p', lead: `Limited warranty. `, text: `Select parts carry a limited warranty, with a maximum warranty period of one (1) year from the date of purchase (or a shorter period as stated for the specific product or by the manufacturer). Warranty coverage, where offered, applies only to the original purchaser and covers defects in materials or workmanship under normal use. Warranty claims require proof of purchase and are handled as described in our Return & Refund Policy.` },
      { type: 'p', text: `Some products are covered only by the manufacturer's warranty, in which case warranty service is provided per the manufacturer's terms.` },
      { type: 'p', lead: `Warranty exclusions. `, text: `Warranties do not cover damage or failure resulting from improper installation, misuse, abuse, accident, modification, normal wear and tear, failure to follow instructions, or use in an application for which the part was not intended.` },
      { type: 'p', lead: `Disclaimer. `, text: `EXCEPT FOR ANY EXPRESS LIMITED WARRANTY STATED ABOVE, ALL PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE." TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL OTHER WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.` }
    ],
  },
  {
    heading: `9. Installation and Professional Use`,
    blocks: [
      { type: 'p', text: `Heavy-duty truck parts should be installed by a qualified professional in accordance with manufacturer specifications and all applicable safety regulations. You are responsible for safe and lawful installation and use. We are not liable for improper installation or use.` }
    ],
  },
  {
    heading: `10. Limitation of Liability`,
    blocks: [
      { type: 'p', text: `TO THE FULLEST EXTENT PERMITTED BY LAW, FLEET X USA AND ITS OWNERS, EMPLOYEES, AND SUPPLIERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST REVENUE, VEHICLE DOWNTIME, OR TOWING/LABOR COSTS, ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR PRODUCTS. OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE PRODUCT GIVING RISE TO THE CLAIM. Some jurisdictions do not allow certain limitations, so some of the above may not apply to you.` }
    ],
  },
  {
    heading: `11. Indemnification`,
    blocks: [
      { type: 'p', text: `You agree to indemnify and hold harmless Fleet X USA and its owners, employees, and suppliers from any claims, damages, liabilities, and expenses (including reasonable attorneys' fees) arising out of your breach of these Terms, your misuse of products, or your violation of any law or third-party right.` }
    ],
  },
  {
    heading: `12. Intellectual Property`,
    blocks: [
      { type: 'p', text: `All content on the Site—including text, graphics, logos, images, and software—is the property of Fleet X USA or its licensors and is protected by applicable intellectual property laws. You may not copy, reproduce, or use our content without prior written permission. Manufacturer names, part numbers, and trademarks are used for reference only and remain the property of their respective owners.` }
    ],
  },
  {
    heading: `13. Prohibited Uses`,
    blocks: [
      { type: 'p', text: `You agree not to use the Site to: violate any law; infringe others' rights; submit false or fraudulent information; interfere with the Site's security or operation; or engage in unauthorized data collection (scraping). We may suspend or terminate access for violations.` }
    ],
  },
  {
    heading: `14. Third-Party Links`,
    blocks: [
      { type: 'p', text: `The Site may link to third-party websites. We are not responsible for the content, products, or practices of those sites.` }
    ],
  },
  {
    heading: `15. Governing Law and Dispute Resolution`,
    blocks: [
      { type: 'p', text: `These Terms are governed by the laws of the State of Indiana, without regard to its conflict-of-laws rules. You agree that any dispute arising out of or relating to these Terms or your purchase shall be brought exclusively in the state or federal courts located in Indiana, and you consent to the jurisdiction of those courts.` }
    ],
  },
  {
    heading: `16. Changes to These Terms`,
    blocks: [
      { type: 'p', text: `We may update these Terms at any time. Changes are effective when posted on this page with an updated "Last Updated" date. Your continued use of the Site or placement of orders after changes take effect constitutes acceptance.` }
    ],
  },
  {
    heading: `17. Severability and Entire Agreement`,
    blocks: [
      { type: 'p', text: `If any provision of these Terms is found unenforceable, the remaining provisions remain in full effect. These Terms, together with our Privacy Policy, Shipping Policy, and Return & Refund Policy, constitute the entire agreement between you and Fleet X USA regarding your use of the Site and purchases.` }
    ],
  },
  {
    heading: `18. Contact Us`,
    blocks: [
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

export default function TermsConditionsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      subtitle="Effective Date: October 14, 2026 | Last Updated: October 14, 2026"
      intro={[
        `These Terms & Conditions ("Terms") govern your access to and use of the website www.fleetxusa.com (the "Site") and your purchase of products from Fleet X USA ("Fleet X USA," "we," "us," or "our"). By accessing the Site or placing an order, you agree to these Terms. If you do not agree, do not use the Site or purchase from us.`,
      ]}
      sections={SECTIONS}
    />
  );
}
