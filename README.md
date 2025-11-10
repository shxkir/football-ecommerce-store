# Liquid Ether FC – Football E-Commerce Experience

React Native web storefront for premium football kits. The landing hero uses the Liquid Ether background component from [React Bits](https://reactbits.dev) while the rest of the experience covers store browsing, real authentication, cart management, and a checkout flow that syncs orders to Google Sheets via a Service Account.

## Highlights

- ⚡️ **React Native Web UI** – UI primitives from `react-native-web` with `StyleSheet` styling for a native-feeling website.
- 🌌 **React Bits Liquid Ether** – Imported TypeScript/CSS component powers the animated hero background with configurable palette/intensity.
- 🔐 **NextAuth + Firebase** – Credential-based auth (NextAuth v5) backed by Firebase Firestore with bcrypt hashing for multi-device persistence.
- 🛒 **Product Grid + Cart** – Curated kits with palette chips, limited tags, size selection, persistent cart, and live totals.
- 📤 **Checkout to Google Sheets** – `/api/orders` appends placed orders (user, line items, totals, shipping) to your Sheet using a Google Service Account.
- 🧰 **Tooling** – Next.js 16 (App Router), TypeScript, Firebase Admin SDK, ESLint (core-web-vitals rules).

## Quick Start

```bash
npm install --legacy-peer-deps
npm run dev
```

Visit `http://localhost:3000` to explore the storefront. All sections live on the landing page:

1. Liquid Ether hero with CTA.
2. Store grid of curated kits.
3. Account panel (sign up/in/out via NextAuth).
4. Cart manager + totals.
5. Checkout form that sends data to Google Sheets.

Lint the project with:

```bash
npm run lint
```

## Environment Variables

Create a `.env.local` file (copy `.env.local.example`) with the following keys:

| Variable | Description |
| --- | --- |
| `NEXTAUTH_URL` | Base URL for NextAuth callbacks (usually `http://localhost:3000` in dev). |
| `NEXTAUTH_SECRET` | Random string used to sign NextAuth JWTs (`openssl rand -base64 32`). |
| `FIREBASE_PROJECT_ID` | Firebase project ID used by the Admin SDK. |
| `FIREBASE_CLIENT_EMAIL` | Service account email from the Firebase Admin SDK credentials. |
| `FIREBASE_PRIVATE_KEY` | Multiline private key for the Firebase service account (escape newlines as `\n`). |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email (e.g. `orders-bot@project.iam.gserviceaccount.com`). |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Multiline private key. Keep the `-----BEGIN PRIVATE KEY-----` block and replace literal `\n` with actual new lines or escape them as `\\n`. |
| `GOOGLE_SPREADSHEET_ID` | ID of the target spreadsheet (the long ID inside the sheet URL). |

### Google Sheets setup

1. Create / pick a Google Sheet and add a tab named `Orders` (first row can contain headers like `Timestamp`, `Customer`, etc.).
2. In Google Cloud Console, create a Service Account and generate a JSON key.
3. Share the sheet with the service account email and grant **Editor** access.
4. Copy the email, key, and sheet ID into `.env.local`.

When checkout succeeds, each order appends a row containing metadata, totals, and a serialized line item summary.

## Project Structure

```
src/
  app/
    api/
      auth/[...nextauth]/route.ts  # NextAuth handler
      auth/register/route.ts       # Sign-up endpoint
      orders/route.ts              # Google Sheets append endpoint
    page.tsx                       # Page shell + section order
  components/
    backgrounds/LiquidEther        # React Bits background
    sections/*                     # Hero, Store, Auth, Cart, Checkout
  context/CartContext.tsx          # Persistent cart provider
  data/kits.ts                     # Static catalogue
  hooks/useAuth.ts                 # NextAuth-aware client helper
  lib/{authOptions,firebaseAdmin}.ts      # Server utilities
  providers/AppProviders.tsx       # Session + cart composition
  types/                           # Shared types & NextAuth module augments
```

## Notes

- Configure your Firebase service account before running `npm run dev`, otherwise server routes will throw due to missing credentials.
- Product images reference Unsplash assets; replace with your catalogue as needed.
- The Google Sheets integration requires the worksheet to exist ahead of time. Errors from Google are surfaced in the checkout status helper text.

Enjoy the drop!
