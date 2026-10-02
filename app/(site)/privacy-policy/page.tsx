import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import PolicyPage from '@/components/PolicyPage';
import type { PolicySection } from '@/components/PolicyPage';

const DESCRIPTION =
  `Read the Fleet X Parts privacy policy to learn how we collect, use, and protect your information.`;

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy | Fleet X Parts',
  description: DESCRIPTION,
  keywords: 'privacy policy, data protection, Fleet X Parts',
  path: '/privacy-policy',
});

const SECTIONS: PolicySection[] = [
  {
    heading: `Information We Collect`,
    blocks: [
      { type: 'p', text: `We may collect:` },
      {
        type: 'ul',
        items: [
          `Contact information (name, email, phone, billing/shipping address)`,
          `Order and customer support details (items purchased, order history, communications)`,
          `Payment-related data (processed securely by third-party payment processors; we do not store full card numbers)`,
          `Website/device data (IP address, browser type, pages visited) via cookies and analytics tools`,
        ],
      },
    ],
  },
  {
    heading: `How We Use Information`,
    blocks: [
      { type: 'p', text: `We use information to:` },
      {
        type: 'ul',
        items: [
          `Process orders, payments, shipping, and returns`,
          `Provide customer service and order updates`,
          `Prevent fraud and secure transactions`,
          `Improve our website, products, and services`,
          `Send marketing messages where permitted (you can opt out at any time)`,
        ],
      },
    ],
  },
  {
    heading: `Sharing of Information`,
    blocks: [
      { type: 'p', text: `We may share information with trusted service providers only as needed to operate our business, such as:` },
      {
        type: 'ul',
        items: [`Payment processors`, `Shipping carriers`, `E-commerce/website hosting providers`, `Customer support systems`],
      },
      { type: 'p', text: `We do not sell your personal information.`, strong: true },
    ],
  },
  {
    heading: `Cookies`,
    blocks: [
      { type: 'p', text: `Cookies help the website function and allow analytics. You can control cookies via your browser settings (some site features may not work properly if cookies are disabled).` },
    ],
  },
  {
    heading: `Data Security`,
    blocks: [
      { type: 'p', text: `We use reasonable administrative, technical, and physical safeguards to protect your data. No method of transmission or storage is 100% secure.` },
    ],
  },
  {
    heading: `Your Choices`,
    blocks: [
      { type: 'p', text: `You may request access, correction, or deletion of your personal information where applicable by contacting us at support@fleetxusa.com.` },
    ],
  },
  {
    heading: `Updates`,
    blocks: [
      { type: 'p', text: `We may update this Privacy Policy from time to time. The updated version will be posted with a revised effective date.` },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      subtitle="Effective Date: December 17, 2025"
      intro={[`FLEET X PARTS respects your privacy. This policy describes how we collect, use, and share information.`]}
      sections={SECTIONS}
      contact="Privacy Contact: support@fleetxusa.com"
    />
  );
}
