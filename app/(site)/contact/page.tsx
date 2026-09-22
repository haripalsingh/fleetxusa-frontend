import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

const DESCRIPTION =
  'Get in touch with Fleet X Parts for help with parts, fitment, pricing, or an existing order.';

export const metadata: Metadata = {
  title: 'Contact Us | Fleet X Parts',
  description: DESCRIPTION,
  keywords: 'contact fleetx parts, truck parts support, customer service',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contact Us | Fleet X Parts',
    description: DESCRIPTION,
    siteName: 'Fleet X Parts',
    type: 'website'
  }
};

const ICON_PROPS = {
  className: 'w-5 h-5 text-[#00a550]',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  'aria-hidden': true
} as const;

const PATH_PROPS = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2
} as const;

const IconCircle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00a550]/10 flex items-center justify-center">
    <svg {...ICON_PROPS}>{children}</svg>
  </div>
);

const ContactPage = () => {
  return (
    <div className="w-full font-display">
      {/* ---- Header (black, full width) ---- */}
      <section className="w-full bg-black text-white">
        <div className="max-w-[1320px] mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">
            Contact FleetX
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mb-6" />
          <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg">
            Need help with a part, fitment, pricing, or an order? Send us a
            message and our team will get back to you as soon as possible. For
            the fastest support, please include your VIN (last 8 digits is okay)
            and the part number if you have it.
          </p>
        </div>
      </section>

      {/* ---- Body ---- */}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact information sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-6">
                  Contact Information
                </h2>

                {/* Email */}
                <div className="flex items-start gap-4 pb-5 mb-5 border-b border-gray-100">
                  <IconCircle>
                    <path
                      {...PATH_PROPS}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </IconCircle>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-gray-900 mb-1">
                      Email
                    </h3>
                    <a
                      href="mailto:support@fleetxusa.com"
                      className="text-[#00a550] hover:underline text-sm break-all"
                    >
                      support@fleetxusa.com
                    </a>
                  </div>
                </div>

                {/* Business hours */}
                <div className="flex items-start gap-4 pb-5 mb-5 border-b border-gray-100">
                  <IconCircle>
                    <path
                      {...PATH_PROPS}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </IconCircle>
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Mon–Fri 9:00 AM–6:00 PM ET
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 pb-5 mb-5 border-b border-gray-100">
                  <IconCircle>
                    <path
                      {...PATH_PROPS}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      {...PATH_PROPS}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </IconCircle>
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 mb-1">
                      Address
                    </h3>
                    <a
                      href="https://maps.app.goo.gl/FEtDjLpjWRWjnDTo7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#00a550] text-sm leading-relaxed block transition-colors"
                    >
                      415 E 31st Street
                      <br />
                      Anderson, IN 46016
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <IconCircle>
                    <path
                      {...PATH_PROPS}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </IconCircle>
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 mb-1">
                      Phone
                    </h3>
                    <a
                      href="tel:0000000000"
                      className="text-[#00a550] hover:underline text-sm"
                    >
                      000-000-0000
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>

          {/* Map */}
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=415+E+31st+St,+Anderson,+IN+46016&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Fleet X Parts Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
