# SHOPIT

![Laravel 13](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white)
![Inertia 3](https://img.shields.io/badge/Inertia-3-9553E9)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Tests](https://img.shields.io/badge/tests-86_passing-2F6B48)

A modern general-marketplace storefront and admin panel with an editorial warm-minimal design, built on **Laravel 13**, **Inertia v3**, **React 19**, **TypeScript**, **Tailwind CSS v4** and **Wayfinder**.

The storefront and the admin panel are both first-class React applications. There is no Livewire, Filament or Blade-rendered UI.

## Highlights

- **Editorial storefront** with light and dark themes, responsive navigation, product galleries and a full checkout flow.
- **Real commerce lifecycle**: server-priced cart, stock reservation, Cash on Delivery and Stripe Checkout, webhook-driven payment confirmation, and stock release for abandoned or cancelled orders.
- **Customer accounts**: order history, order detail, profile and password management, wishlists and verified product reviews.
- **Coupons**: percentage and fixed-amount discount codes with minimum order values, usage limits and availability windows.
- **Inertia admin panel**: dashboard, products, categories, brands, coupons, reviews, orders and customers.
- **Transactional email**: order confirmation and order status updates through Laravel notifications.
- **Tested**: 86 Pest tests and 555 assertions covering the storefront, payments, webhooks, stock, reviews, coupons, wishlists, admin CRUD and authorization.

## Stack

| Layer | Technology |
| --- | --- |
| Backend | Laravel 13, PHP 8.3+ (8.5 recommended) |
| Frontend | React 19, Inertia v3, TypeScript, Tailwind CSS v4 |
| Routing helpers | Laravel Wayfinder |
| Build | Vite 8, `@inertiajs/vite`, `laravel-vite-plugin` |
| Payments | Stripe Checkout (test mode ready), Cash on Delivery |
| Testing | Pest 5, Pest Laravel plugin |
| Formatting | Pint, ESLint, Prettier |
| Icons | Phosphor Icons |

## Requirements

- PHP 8.3 or newer with `pdo_sqlite`
- Composer 2
- Node.js 24 and npm
- A Stripe account only if you want to test card payments

## Getting started

```bash
git clone https://github.com/Jesse457/SHOPIT.git
cd SHOPIT

composer install
npm ci

cp .env.example .env
php artisan key:generate

touch database/database.sqlite
php artisan migrate:fresh --seed
php artisan storage:link

npm run build
php artisan serve --port=8001
```

Open [http://localhost:8001](http://localhost:8001).

For frontend development, keep Vite running in a second terminal:

```bash
npm run dev
```

The app uses SQLite by default. Set the usual `DB_*` variables in `.env` to use MySQL or MariaDB instead.

## Demo accounts

The seeder creates a fictional general-marketplace catalog, demo orders, approved reviews and discount codes.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@shopit.test` | `password` |
| Customer | `customer@shopit.test` | `password` |

Additional customer accounts: `nadia@shopit.test`, `kevin@shopit.test`, `claire@shopit.test`, all with the password `password`.

Demo coupons:

| Code | Discount | Minimum order |
| --- | --- | --- |
| `WELCOME10` | 10% | None |
| `SAVE5000` | 5,000 FCFA | 50,000 FCFA |
| `VIP15` | 15% | 100,000 FCFA |

The admin panel lives at `/admin`. Administrators are redirected there after signing in.

## Stripe

Cash on delivery works without any Stripe configuration. To test card payments, add test-mode keys to `.env`:

```dotenv
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Forward local webhooks with the Stripe CLI:

```bash
stripe listen --forward-to http://localhost:8001/stripe/webhook
```

Handled events:

- `checkout.session.completed`
- `checkout.session.expired`

The success page also verifies the Checkout Session server-side, so a valid signature and a matching order amount are both required before an order is marked paid. XAF is treated as a zero-decimal currency.

Orders reserve stock while the customer is on Stripe Checkout. Abandoned card orders release their stock after the hold window through the scheduled command:

```bash
php artisan orders:release-expired
```

The command runs every five minutes from `routes/console.php`.

## What is included

### Storefront

- Home with editorial hero, departments and new arrivals
- Product catalog with search, department, brand, price and availability filters, sorting and pagination
- Product detail with image gallery, real stock state, related products and reviews
- Cart with server-side pricing, quantity controls and coupon application
- Checkout with delivery address, payment method, order notes and order summary
- Success, cancelled and retry-payment pages
- Customer order history and order detail
- Account profile and password management
- Wishlist with header count
- Verified reviews with ratings and a moderation state
- Login, registration, forgot password and password reset
- Branded 404, 403 and 500 pages

### Commerce rules

- Cart prices are always recalculated from the database. Client-side price data is never trusted.
- Stock is clamped to what is actually available and decremented inside the order transaction.
- Order items store product name and image snapshots so history survives catalog changes.
- Coupon limits and availability are re-checked under a database lock when the order is placed.
- Stripe sessions are created after the order transaction commits.
- Admin cancellations and Stripe expiries release stock exactly once, guarded by `stock_released_at`.

### Admin

- Dashboard with paid revenue, order counts, customers, low stock, a 12-month revenue chart, order-status breakdown, visits, recent orders and a low-stock list
- Products with images, pricing, stock thresholds and visibility flags
- Categories and brands with uploads and delete guards
- Coupons with usage limits and date windows
- Review moderation with approve, reject and delete
- Orders with status transitions, payment status, internal notes and cancellation that restocks
- Customers with account editing and admin access management

## Commands

```bash
# Application
php artisan serve --port=8001
php artisan migrate:fresh --seed
php artisan storage:link
php artisan orders:release-expired

# Frontend
npm run dev          # Vite dev server
npm run build        # production build
npm run types:check  # Wayfinder generation + TypeScript
npm run lint         # ESLint with autofix
npm run lint:check
npm run format       # Prettier
npm run format:check

# Backend
php artisan test --compact
vendor/bin/pint --dirty
vendor/bin/pint --test
```

`npm run types:check` regenerates Wayfinder's `resources/js/actions`, `resources/js/routes` and `resources/js/wayfinder` directories. They are gitignored and are also regenerated by the Vite plugin during `npm run build`.

## Project structure

```text
app/
  Actions/Checkout/        Order placement, payment, cancellation and stock release
  Console/Commands/        orders:release-expired
  Contracts/               PaymentGateway
  Enums/                   Order, payment and coupon enums
  Http/Controllers/
    Admin/                 Dashboard and admin CRUD
    Auth/                  Sign in, registration and password reset
    Storefront/            Catalog, cart, checkout, orders, account, wishlist, reviews
  Http/Middleware/         Inertia sharing, admin guard, visitor tracking
  Http/Requests/           Form Requests for auth, checkout, reviews and admin
  Http/Resources/          Storefront and admin API resources
  Models/                  Product, Category, Brand, Order, Coupon, Review, Wishlist...
  Notifications/           Order confirmation and status emails
  Policies/                Order ownership
  Services/                Cart, coupon, Stripe and visitor services

resources/js/
  components/              UI, form, storefront, admin and common components
  layouts/                 Storefront, admin and auth shells
  pages/
    Storefront/            Home, catalog, cart, checkout, orders, account, wishlist
    Admin/                 Dashboard and management screens
    Auth/                  Sign in, registration and password reset
    Error/                 Branded error pages
  types/                   Shared TypeScript contracts

routes/web.php             Storefront, auth, checkout and admin routes
tests/Feature/             Storefront, auth and admin feature tests
```

## Testing and quality

```bash
php artisan test --compact
vendor/bin/pint --test
npm run lint:check
npm run format:check
npm run types:check
npm run build
```

The GitHub Actions workflow runs the same checks on PHP 8.5 and Node 24 with SQLite.

## Notes

- The demo catalog uses fictional brands and products. No trademarks or brand assets are bundled.
- Product imagery in the seeder uses Unsplash URLs with a local placeholder fallback.
- The design uses a system font stack (Georgia for display, Segoe UI for UI). The design tokens in `resources/css/app.css` are the single place to swap in self-hosted fonts.
- Local mail uses the `log` driver, so order emails appear in `storage/logs/laravel.log`.
- The admin panel and customer area share the same session; administrators are redirected to `/admin` after sign in.

## License

MIT, as declared in `composer.json`.
