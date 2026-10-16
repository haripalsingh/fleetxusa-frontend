import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import PolicyPage from '@/components/PolicyPage';
import type { PolicySection } from '@/components/PolicyPage';

const DESCRIPTION =
  `Read the Fleet X USA privacy policy to learn how we collect, use, share, and protect your personal information, and the privacy rights available to you.`;

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy | Fleet X Parts',
  description: DESCRIPTION,
  keywords: 'privacy policy, data protection, CCPA, Indiana privacy, Fleet X USA, Fleet X Parts',
  path: '/privacy-policy',
});

const SECTIONS: PolicySection[] = [
  {
    heading: `1. Who We Are`,
    blocks: [
      { type: 'p', text: `Fleet X USA is a heavy-duty truck parts retailer based in the State of Indiana, United States, serving both business customers (fleets, repair shops, resellers) and individual consumers.` },
      { type: 'p', lead: `Contact for privacy matters: `, text: `Email: Support@fleetxusa.com | Mailing Address: 1101 Milliken Ave, Ste E, Ontario, CA 91761` },
    ],
  },
  {
    heading: `2. Information We Collect`,
    blocks: [{ type: 'p', text: `We collect the following categories of information:` }],
  },
  {
    heading: `Information you provide to us`,
    level: 3,
    blocks: [
      {
        type: 'ul',
        items: [
          { lead: `Contact and identity information: `, text: `name, billing and shipping address, email address, telephone number.` },
          { lead: `Business/account information: `, text: `company name, business contact details, and, where applicable, tax-exempt or resale certificate information.` },
          { lead: `Order information: `, text: `products purchased, order history, and vehicle/part-fitment details you provide (such as make, model, year, VIN, or part numbers).` },
          { lead: `Payment information: `, text: `payment card or other payment details, which are processed securely by our payment processor (Stripe). We do not store full payment card numbers on our systems.` },
          { lead: `Communications: `, text: `information you provide when you contact customer support, submit a return request, or respond to surveys or promotions.` },
        ],
      },
    ],
  },
  {
    heading: `Information we collect automatically`,
    level: 3,
    blocks: [
      { type: 'p', text: `When you visit the Site, we and our service providers may automatically collect:` },
      {
        type: 'ul',
        items: [
          `Device and connection information (IP address, browser type, operating system).`,
          `Usage data (pages viewed, links clicked, time on site, referring URLs).`,
          `Cookies and similar tracking technologies (see Section 6).`,
        ],
      },
    ],
  },
  {
    heading: `Information from third parties`,
    level: 3,
    blocks: [
      {
        type: 'ul',
        items: [
          `Our payment processor (Stripe) and shipping carriers (such as DHL and freight carriers) may provide us with transaction, delivery, and fraud-prevention information.`,
          `Analytics and advertising providers may share aggregated usage information.`,
        ],
      },
    ],
  },
  {
    heading: `3. How We Use Your Information`,
    blocks: [
      { type: 'p', text: `We use your information to:` },
      {
        type: 'ul',
        items: [
          `Process, fulfill, and deliver your orders, including shipping and returns.`,
          `Verify part fitment and respond to your questions and support requests.`,
          `Process payments and prevent fraud.`,
          `Manage your account and business/reseller relationship.`,
          `Send order confirmations, shipping updates, and other transactional messages.`,
          `Send marketing communications where you have opted in (see Section 7).`,
          `Improve our Site, products, and customer experience.`,
          `Comply with legal obligations and enforce our Terms & Conditions.`,
        ],
      },
    ],
  },
  {
    heading: `4. Payment Processing`,
    blocks: [
      { type: 'p', text: `Payments are processed by Stripe, Inc. When you make a purchase, your payment information is transmitted directly to Stripe and handled in accordance with Stripe's privacy policy and PCI-DSS standards. We receive confirmation of payment and limited transaction details, but we do not receive or store your full card number. Please review Stripe's Privacy Policy for more information.` },
    ],
  },
  {
    heading: `5. How We Share Your Information`,
    blocks: [
      { type: 'p', text: `We do not sell your personal information for money. We may share information in the following circumstances:`, strong: true },
      {
        type: 'ul',
        items: [
          { lead: `Service providers: `, text: `with vendors who perform services on our behalf, such as payment processing (Stripe), shipping and freight carriers (such as DHL), analytics providers, email/SMS marketing platforms, and IT/hosting providers.` },
          { lead: `Business transfers: `, text: `in connection with a merger, acquisition, financing, or sale of all or part of our business.` },
          { lead: `Legal and safety: `, text: `to comply with the law, respond to lawful requests, protect our rights, or prevent fraud or harm.` },
          { lead: `With your consent: `, text: `for any other purpose disclosed to you at the time of collection.` },
        ],
      },
    ],
  },
  {
    heading: `6. Cookies and Tracking Technologies`,
    blocks: [
      { type: 'p', text: `We use cookies and similar technologies to operate the Site, remember your preferences, keep items in your cart, analyze traffic, and support marketing. You can control cookies through your browser settings; disabling certain cookies may affect Site functionality. Where required by law, we will request your consent for non-essential cookies.` },
    ],
  },
  {
    heading: `7. Marketing Communications`,
    blocks: [
      { type: 'p', text: `With your consent, we may send you promotional emails and/or SMS text messages about products, offers, and news. You can opt out at any time by:` },
      {
        type: 'ul',
        items: [
          `Clicking "unsubscribe" in any marketing email, or`,
          `Replying STOP to any marketing text message, or`,
          `Emailing us at Support@fleetxusa.com.`,
        ],
      },
      { type: 'p', text: `Opting out of marketing messages will not affect transactional messages related to your orders. Message and data rates may apply to SMS.` },
    ],
  },
  {
    heading: `8. Data Retention`,
    blocks: [
      { type: 'p', text: `We retain your personal information for as long as necessary to fulfill the purposes described in this Policy, including to complete transactions, provide warranty service, maintain business records, and comply with legal, tax, and accounting obligations. We then delete or anonymize it.` },
    ],
  },
  {
    heading: `9. Data Security`,
    blocks: [
      { type: 'p', text: `We use reasonable administrative, technical, and physical safeguards designed to protect your personal information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.` },
    ],
  },
  {
    heading: `10. Your Privacy Rights`,
    blocks: [
      { type: 'p', text: `Depending on your state of residence, you may have rights regarding your personal information, including the right to:` },
      {
        type: 'ul',
        items: [
          `Know/access the personal information we hold about you.`,
          `Correct inaccurate personal information.`,
          `Request deletion of your personal information.`,
          `Opt out of targeted advertising or the "sale" or "sharing" of personal information.`,
          `Not be discriminated against for exercising your rights.`,
        ],
      },
      { type: 'p', lead: `Indiana residents: `, text: `Under the Indiana Consumer Data Protection Act, you may exercise the rights described above.` },
      { type: 'p', lead: `California residents: `, text: `Under the California Consumer Privacy Act (CCPA/CPRA), you have the rights listed above, including the right to know, delete, correct, and opt out of sale/sharing of personal information.` },
      { type: 'p', text: `Residents of other states with applicable privacy laws may have similar rights.` },
      { type: 'p', text: `To exercise your rights, contact us at Support@fleetxusa.com with your request. We may need to verify your identity before responding. You may also designate an authorized agent to make a request on your behalf.` },
    ],
  },
  {
    heading: `11. "Do Not Sell or Share My Personal Information"`,
    blocks: [
      { type: 'p', text: `We do not sell your personal information for monetary consideration. If we use third-party advertising or analytics cookies that may qualify as "sharing" under certain state laws, you may opt out by adjusting your cookie settings or contacting us at Support@fleetxusa.com.` },
    ],
  },
  {
    heading: `12. Children's Privacy`,
    blocks: [
      { type: 'p', text: `Our Site is intended for users who are at least 18 years old and is not directed to children. We do not knowingly collect personal information from children under 16. If you believe a child has provided us information, please contact us and we will delete it.` },
    ],
  },
  {
    heading: `13. Third-Party Links`,
    blocks: [
      { type: 'p', text: `Our Site may contain links to third-party websites (such as manufacturers or carriers). We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies.` },
    ],
  },
  {
    heading: `14. Geographic Scope`,
    blocks: [
      { type: 'p', text: `Our Site is operated from the United States and intended for customers in the United States. If you access the Site from outside the U.S., you do so on your own initiative and are responsible for compliance with local laws.` },
    ],
  },
  {
    heading: `15. Changes to This Privacy Policy`,
    blocks: [
      { type: 'p', text: `We may update this Privacy Policy from time to time. The "Last Updated" date above reflects the most recent changes. Material changes will be posted on this page, and your continued use of the Site after changes take effect constitutes acceptance.` },
    ],
  },
  {
    heading: `16. Contact Us`,
    blocks: [
      { type: 'p', text: `If you have questions about this Privacy Policy or our data practices, contact us at:` },
      {
        type: 'ul',
        items: [
          { lead: `Company: `, text: `Fleet X USA` },
          { lead: `Email: `, text: `Support@fleetxusa.com` },
          { lead: `Website: `, text: `www.fleetxusa.com` },
          { lead: `Mailing Address: `, text: `1101 Milliken Ave, Ste E, Ontario, CA 91761` },
        ],
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      subtitle="Effective Date: October 14, 2026 | Last Updated: October 14, 2026"
      intro={[
        `Fleet X USA ("Fleet X USA," "we," "us," or "our") operates the website www.fleetxusa.com (the "Site") and sells heavy-duty truck parts and related products. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you visit our Site, create an account, place an order, or otherwise interact with us.`,
        `By using our Site or purchasing from us, you agree to the practices described in this Privacy Policy. If you do not agree, please do not use the Site.`,
      ]}
      sections={SECTIONS}
    />
  );
}
