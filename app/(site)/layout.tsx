import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Public pages that share the site header + footer.
// Auth pages (login, signup, forgot-password) live in app/(auth) and render standalone.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
