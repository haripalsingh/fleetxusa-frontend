import type { Metadata } from 'next';
import PolicyPage from '@/components/PolicyPage';
import type { PolicySection } from '@/components/PolicyPage';

const DESCRIPTION =
  `Review the terms and conditions governing your use of the Fleet X Parts website and services.`;

export const metadata: Metadata = {
  title: 'Terms of Service & Terms and Conditions | Fleet X Parts',
  description: DESCRIPTION,
  keywords: 'terms of service, terms and conditions, Fleet X Parts',
  robots: { index: true, follow: true },
  openGraph: { title: 'Terms of Service & Terms and Conditions | Fleet X Parts', description: DESCRIPTION, siteName: 'Fleet X Parts', type: 'website' },
};

const p = (text: string) => ({ type: 'p' as const, text });

const SECTIONS: PolicySection[] = [
  { level: 3, heading: `1) Updates to These Terms`, blocks: [
    p(`We may update these Terms from time to time at our sole discretion. If we make material changes, we may post a notice on the Service or provide other electronic notice. Changes become effective when posted (or on a stated effective date). Changes will not apply retroactively to completed transactions unless required by law. Your continued use of the Service confirms your acceptance of the updated Terms.`),
  ] },
  { level: 3, heading: `2) Eligibility (Age Requirement)`, blocks: [
    p(`The Service is not intended for anyone under 18 years of age (or the age of majority where you live). If you are under the applicable age, you must not use the Service.`),
  ] },

  { level: 2, heading: `Service Ownership, Content, and Permitted Use` },
  { level: 3, heading: `3) Ownership of the Service and Content`, blocks: [
    p(`The Service and all content made available through it—including text, product descriptions, images, graphics, logos, videos, audio, and other materials (collectively, "Service Content")—are owned by FLEET X PARTS or our licensors, and are protected by intellectual property laws.`),
    p(`We may include content owned by third parties; we do not claim ownership over third-party content.`),
  ] },
  { level: 3, heading: `4) Limited License`, blocks: [
    p(`You may view, download, and print reasonable portions of Service Content for your personal, non-commercial use. Except as permitted by law or expressly authorized in writing by us, you may not copy, reproduce, modify, distribute, display, publish, transmit, create derivative works from, or exploit any Service Content.`),
  ] },
  { level: 3, heading: `5) Linking Policy`, blocks: [
    p(`You may link to our homepage in a manner that does not imply our sponsorship or endorsement. We may revoke linking permission at any time.`),
  ] },

  { level: 2, heading: `Prohibited Activities` },
  { level: 3, heading: `6) Prohibited Uses`, blocks: [
    p(`You agree not to, and not to assist others to:`),
    { type: 'ul', items: [
      `Use scraping tools, crawlers, robots, spiders, data-mining tools, or automated means to access, collect, or copy data from the Service`,
      `Access the Service by any means other than the interfaces we provide`,
      `Attempt to hack, bypass security, disrupt, or interfere with the Service, servers, or networks`,
      `Overload the Service with unreasonable requests or otherwise interfere with normal operation`,
      `Frame, mirror, or repurpose the Service or Service Content for commercial use`,
      `Use the Service for any illegal purpose or in violation of applicable laws`,
      `Misrepresent your identity, impersonate others, or submit false information`,
    ] },
    p(`We may suspend or terminate access for actual or suspected violations.`),
  ] },

  { level: 2, heading: `Product Information, Fitment, and Orders` },
  { level: 3, heading: `7) Product Information and Fitment`, blocks: [
    p(`Truck parts fitment can vary by VIN, engine, model year, trim, axle ratio, emissions configuration, and other factors. While we may provide guidance, you are responsible for verifying compatibility and fitment before purchasing.`),
  ] },
  { level: 3, heading: `8) Pricing, Availability, and Errors`, blocks: [
    p(`Prices, promotions, and availability may change without notice. We reserve the right to correct pricing or listing errors and to cancel or refuse orders affected by errors (and refund amounts paid, if any).`),
  ] },
  { level: 3, heading: `9) Order Acceptance and Cancellation`, blocks: [
    p(`We reserve the right to accept, refuse, or cancel any order for any reason permitted by law (including suspected fraud, inventory issues, or verification problems).`),
    p(`Order cancellations and refunds are governed by our Cancellation & Refund Policy, which is incorporated by reference into these Terms.`),
  ] },

  { level: 2, heading: `Accounts and Security` },
  { level: 3, heading: `10) User Accounts (If Offered)`, blocks: [
    p(`If you create an account, you agree to provide accurate and current information and to maintain the confidentiality of your login credentials. You are responsible for all activity under your account, including unauthorized activity resulting from your failure to safeguard credentials. Notify us immediately if you believe your account has been compromised.`),
  ] },

  { level: 2, heading: `User-Generated Content (UGC)` },
  { level: 3, heading: `11) UGC and Acceptable Conduct (If Offered)`, blocks: [
    p(`If the Service allows reviews, comments, chat, uploads, or other user-submitted content ("UGC"), you agree not to submit content that is unlawful, defamatory, harassing, obscene, fraudulent, infringing, or otherwise objectionable. You also agree not to post personal information of others (such as addresses, phone numbers, or financial information).`),
  ] },
  { level: 3, heading: `12) License to UGC`, blocks: [
    p(`If you submit UGC, you grant FLEET X PARTS a non-exclusive, royalty-free, worldwide, perpetual, irrevocable, transferable, and sublicensable license to use, reproduce, modify, publish, display, distribute, and create derivative works from your UGC for purposes related to operating, promoting, and improving the Service, without additional compensation to you.`),
    p(`You represent that you have all rights necessary to grant this license and that your UGC does not violate law or third-party rights.`),
  ] },

  { level: 2, heading: `Copyright Complaints (DMCA)` },
  { level: 3, heading: `13) DMCA Takedown Notices`, blocks: [
    p(`If you believe content on the Service infringes your copyright, you may send a notice to our designated agent with: identification of the copyrighted work, identification of the allegedly infringing material (with URL/location), your contact info, a good-faith statement, a statement under penalty of perjury, and your signature (physical or electronic).`),
    { type: 'p', text: ``, lead: `Copyright Agent:` },
    p(`Email: support@fleetxusa.com`),
  ] },

  { level: 2, heading: `Third-Party Links` },
  { level: 3, heading: `14) Links to Third Parties`, blocks: [
    p(`The Service may contain links to third-party websites or services. We do not control and are not responsible for third-party content, policies, or practices. Your use of third-party services is at your own risk.`),
  ] },

  { level: 2, heading: `Indemnification` },
  { level: 3, heading: `15) Indemnity`, blocks: [
    p(`You agree to indemnify and hold harmless FLEET X PARTS, its owners, employees, affiliates, and agents from claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising from or related to your use of the Service, your violation of these Terms, your violation of any law, or your infringement of any third-party rights.`),
  ] },

  { level: 2, heading: `Disclaimers and Limitation of Liability` },
  { level: 3, heading: `16) Disclaimer of Warranties`, blocks: [
    p(`The Service is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, we disclaim all warranties, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, secure, or error-free.`),
  ] },
  { level: 3, heading: `17) Limitation of Liability`, blocks: [
    p(`To the maximum extent permitted by law, Fleet X Parts and its affiliates will not be liable for indirect, incidental, special, consequential, or exemplary damages (including lost profits, lost data, or business interruption) arising out of or related to the Service or these Terms.`),
    p(`Our total liability for any claim arising out of or relating to the Service or these Terms will not exceed the greater of: (a) $50, or (b) the net amount you paid to us for products or services in the 12 months before the event giving rise to the claim.`),
    p(`Some jurisdictions do not allow certain limitations; in that case, liability will be limited to the maximum extent permitted by applicable law.`),
  ] },

  { level: 2, heading: `General Legal Terms` },
  { level: 3, heading: `18) Governing Law`, blocks: [
    p(`These Terms are governed by the laws of the State of Indiana, without regard to conflict-of-law rules.`),
  ] },
  { level: 3, heading: `19) Dispute Resolution; Arbitration; Class Action Waiver`, blocks: [
    p(`Any dispute arising out of or relating to these Terms or the Service shall be resolved by binding arbitration administered by the American Arbitration Association under its applicable rules, conducted in Indiana, before a single arbitrator.`),
    { type: 'p', lead: `Class action waiver: `, text: `To the fullest extent permitted by law, you waive any right to bring or participate in class actions or class arbitration against us.` },
    { type: 'p', lead: `Jury trial waiver: `, text: `To the fullest extent permitted by law, you waive the right to a trial by jury.` },
    p(`Notwithstanding arbitration, we may seek injunctive or equitable relief in a court of competent jurisdiction to protect our intellectual property or prevent unauthorized use of the Service.`),
  ] },
  { level: 3, heading: `20) Time Limit to Bring Claims`, blocks: [
    p(`You must bring any claim within one (1) year after the claim arises, unless a longer period is required by law.`),
  ] },
  { level: 3, heading: `21) Severability; No Waiver; Assignment`, blocks: [
    p(`If any provision is found unenforceable, the remaining provisions remain in effect. Our failure to enforce any provision is not a waiver. You may not assign these Terms without our written consent; we may assign them as part of business operations.`),
  ] },
  { level: 3, heading: `22) Entire Agreement`, blocks: [
    p(`These Terms, plus any policies incorporated by reference (including our Privacy Policy, Shipping & Return Policy, and Cancellation & Refund Policy), constitute the entire agreement between you and us regarding the Service.`),
  ] },
];

export default function TermsConditionsPage() {
  return (
    <PolicyPage
      title="Terms of Service & Terms and Conditions"
      subtitle="Last updated: December 17, 2025"
      intro={[
        `This website and any related online services, tools, accounts, customer support channels, and features (together, the "Service") are provided by FLEET X PARTS ("Company," "we," "us," or "our"). These Terms of Service & Terms and Conditions (the "Terms") govern your access to and use of the Service.`,
        `By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not access or use the Service. These Terms apply whether you access the Service via a computer, mobile device, or any other device or technology.`,
      ]}
      sections={SECTIONS}
      contact="For questions about these Terms, please contact us at support@fleetxusa.com."
    />
  );
}
