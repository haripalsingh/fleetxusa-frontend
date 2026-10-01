import Link from 'next/link';

// Shown when the PHP API can't be reached (server down, wrong NEXT_PUBLIC_API_BASE_URL...).
export default function CatalogUnavailable({ error }: { error?: unknown }) {
  const detail =
    process.env.NODE_ENV !== 'production' && error
      ? (error as { detail?: string }).detail || (error instanceof Error ? error.message : String(error))
      : null;
  return (
    <div className="w-full bg-[#f0f0f0] font-display">
      <div className="max-w-[700px] mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">We can&apos;t load the catalog right now</h1>
        <p className="text-gray-600 mb-8">Please refresh the page in a moment. If the problem continues, contact us.</p>
        {detail && (
          <pre className="mb-8 whitespace-pre-wrap break-all border border-red-300 bg-red-50 p-4 text-left text-xs text-red-800">
            [dev only] {detail}
          </pre>
        )}
        <Link
          href="/contact"
          className="inline-block px-8 py-3 text-sm font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
