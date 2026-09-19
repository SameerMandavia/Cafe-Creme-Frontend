# Cafe-Creme

Frontend-only cafe application built with HTML, CSS, Bootstrap, and JavaScript.

## Run locally

Open `html/home.html` with VS Code Live Server. The pages use browser `localStorage` for the cart, accounts, and menu products.

## Demo admin

- Email: `admin@cafecreme.local`
- Password: `admin123`

Log in, open `admin.html`, and add or remove menu products. Changes appear on the menu and order pages in the same browser.

## Important

Authentication and admin access are demo-only because this repository has no backend. Passwords and products are stored in the browser and must be moved to a secure server before production use.

## Frontend QA checklist

Run through these flows in a fresh browser session before each release:

- Browse menu, search, filter by category/dietary preference, sort, favourite, customise, add, decrease, and remove an item.
- Close the store in Admin and confirm that add-to-cart actions are blocked everywhere.
- Complete checkout for delivery and pickup, including invalid phone/address states, coupon application, map fallback, and order confirmation.
- Open order history, search/filter orders, expand tracking, view the receipt, and reorder an available item.
- In Admin, add/edit/delete a product, preview an image, change stock/availability, update an order status, export reports, and schedule a festival theme.
- Test keyboard navigation, focus states, mobile layout, reduced motion, broken images, empty states, and denied location permission.

## Browser-storage contract (temporary frontend mode)

The current prototype uses these keys. A future API should replace them without changing the page-level UX:

| Key | Purpose |
| --- | --- |
| `cafe-creme-current-user` | Signed-in demo user session |
| `cafe-creme-users` | Demo users and roles |
| `cafe-creme-menu` | Admin-managed menu catalog |
| `cafe-creme-cart` / `cafe-creme-cart-options` | Cart quantities and customisations |
| `cafe-creme-orders` / `cafe-creme-last-order` | Order history and confirmation |
| `cafe-creme-reservations` | Reservation requests |
| `cafe-creme-festival-campaigns` / `cafe-creme-active-festival` | Campaigns and theme scheduling |
| `cafe-creme-analytics` | Temporary browser analytics funnel |

Do not use this storage contract for real authentication, payments, inventory, or customer data.

## Automated browser tests

Install dependencies and the test browser once:

```bash
npm install
npx playwright install chromium
```

Run the customer/admin/mobile test suite:

```bash
npm run test:e2e
```

Useful variants:

```bash
npm run test:e2e:headed       # watch the browser while tests run
npm run test:e2e:report       # open the HTML report after a run
```

The suite is in `tests/app.spec.js`. It covers page smoke checks, account creation, menu search/favourites/filters, cart quantity changes, checkout validation and order creation, coupon application, location/map fallback, order history filtering, admin festival publishing, and mobile overflow.
