# Fleet X Parts — Next.js storefront

Next.js 16 · TypeScript · Tailwind CSS 4. All data comes from the PHP REST API in `fleetxusa-backend`
(Next.js never connects to MySQL).

```
Next.js (this app)  ──fetch──▶  PHP REST API  ──PDO──▶  MySQL
```

## Setup

1. Set up the backend first (see `fleetxusa-backend/README.md`).
2. API URL — defaults to `https://fleetxusa.com/fleetxusa-backend/api` (XAMPP). For any other location create `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://fleetxusa.com/fleetxusa-backend/api
   ```
3. `npm install` then `npm run dev` → <http://localhost:3000>

Production: `npm run build && npm run start` (or deploy to Vercel / a Node host) with
`NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/backend/api`, and add the site URL to the backend's `CORS_ALLOWED_ORIGINS`.

## Pages

| Route | What it does |
|---|---|
| `/` | Home (categories from the API) |
| `/products` | Shop — server-side filters (category, type, color, brand, price), sort, pagination, `?q=` search |
| `/categories` | All categories |
| `/products/[category]` | Category listing |
| `/products/[category]/[product]` | Product details — gallery, variants/options, live stock, add to cart, related parts |
| `/cart` | Cart (server-side cart, guest or logged in) |
| `/checkout` | Guest or account checkout, saved addresses, coupons, payment methods from the API |
| `/orders/[number]` | Order details / confirmation (owner, or guest via the secret `?key=` link), cancel, pay now |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Auth (optional email OTP supported) |
| `/account` | My Account overview |
| `/account/orders`, `/account/addresses`, `/account/profile`, `/account/password` | Account sections |

## Code map

| File | Purpose |
|---|---|
| `lib/api.ts` | The only HTTP client: base URL, Bearer token, guest cart token, `ApiError` with field errors |
| `lib/types.ts` | TypeScript types for every API response |
| `lib/catalog.ts` | Server-side catalog reads (cached 60 s) for server components & metadata |
| `lib/cart.ts` | Shared cart store (`useCart`, `addToCart`, `setCartQuantity`, …) backed by `/api/cart` |
| `context/AuthContext.tsx` | Login / signup / OTP / logout, session restore, guest-cart merge on login |
| `components/account/*` | My Account screens |

The admin panel lives in the backend: `https://fleetxusa.com/fleetxusa-backend/admin/`.
