import { test, expect } from "@playwright/test";

const customerPages = [
  "home.html", "menu.html", "offers.html", "about.html", "contact.html",
  "reservations.html", "account.html", "orders.html", "cart.html",
  "login.html", "signup.html",
];

async function clearBrowserState(page) {
  await page.goto("/html/home.html");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function seedUser(page, user = { name: "Test Customer", email: "test@example.com", phone: "9876543210", role: "user" }) {
  await page.addInitScript((value) => {
    localStorage.setItem("cafe-creme-current-user", JSON.stringify(value));
    localStorage.setItem("cafe-creme-users", JSON.stringify([value]));
  }, user);
}

async function seedCart(page, cart = { "velvet-latte": 1 }) {
  await page.addInitScript((value) => {
    localStorage.setItem("cafe-creme-cart", JSON.stringify(value));
  }, cart);
}

test.describe("application smoke coverage", () => {
  test("customer pages load without page errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    for (const pageName of customerPages) {
      await page.goto(`/html/${pageName}`);
      await expect(page.locator("#site-header")).toBeAttached();
      await expect(page.locator("#site-footer")).toBeAttached();
    }

    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("signup creates a local demo account", async ({ page }) => {
    await clearBrowserState(page);
    await page.goto("/html/signup.html");
    await page.fill("#signup-name", "New Customer");
    await page.fill("#signup-email", `customer-${Date.now()}@example.com`);
    await page.fill("#signup-phone", "9876543210");
    await page.fill("#signup-password", "coffee123");
    await page.locator("#signup-form button[type=submit]").click();
    await expect(page.locator("#auth-status")).toContainText("Account created");
    await expect.poll(() => page.evaluate(() => Boolean(localStorage.getItem("cafe-creme-current-user")))).toBe(true);
  });

  test("menu search, favourites, filters, and cart quantity work", async ({ page }) => {
    await clearBrowserState(page);
    await page.goto("/html/menu.html");
    await expect(page.locator(".menu-item").first()).toBeVisible();

    const firstItem = page.locator(".menu-item").first();
    const firstId = await firstItem.getAttribute("data-item-id");
    await firstItem.locator("[data-favourite-id]").click();
    await expect(firstItem.locator("[data-favourite-id]")).toHaveAttribute("aria-pressed", "true");

    await page.locator("#menu-favorites").click();
    await expect(page.locator(`.menu-item[data-item-id="${firstId}"]`)).toBeVisible();
    await page.locator("#menu-favorites").click();

    await page.locator("#menu-search").fill("zzzz-no-match");
    await expect(page.locator("#menu-result-count")).toContainText("No items match");
    await page.locator("#menu-search").fill("");

    await firstItem.locator("[data-change=\"1\"]").click();
    await expect(page.locator("#cart-count")).toHaveText("1");
    await firstItem.locator("[data-change=\"-1\"]").click();
    await expect(page.locator("#cart-count")).toHaveText("0");
  });

  test("checkout validates details, applies coupon, and places an order", async ({ page }) => {
    await clearBrowserState(page);
    await seedUser(page);
    await seedCart(page);
    await page.goto("/html/cart.html");

    await expect(page.locator("#cart-content")).toBeVisible();
    await page.locator("#checkout-coupon").fill("CAFE10");
    await page.locator("#apply-coupon").click();
    await expect(page.locator("#coupon-status")).toContainText("10% off");

    await page.locator("#checkout-name").fill("Test Customer");
    await page.locator("#checkout-phone").fill("9876543210");
    await page.locator("#checkout-address").fill("12 Cafe Street, Pune");
    await page.locator("#checkout-time").selectOption({ label: "As soon as possible" });
    await page.locator("#checkout-form").locator("button[type=submit]").click();

    await expect(page).toHaveURL(/order-success\.html/);
    await expect(page.locator("#confirmation-card")).toContainText("Order");
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("cafe-creme-cart") || "{}"))).toEqual({});
    await expect.poll(() => page.evaluate(() => (JSON.parse(localStorage.getItem("cafe-creme-orders") || "[]")).length)).toBe(1);
  });

  test("location fallback and map toggle remain usable", async ({ page }) => {
    await clearBrowserState(page);
    await seedUser(page);
    await seedCart(page);
    await page.goto("/html/cart.html");
    await page.locator("#toggle-map").click();
    await expect(page.locator("#toggle-map")).toHaveAttribute("aria-expanded", "true");

    await page.context().grantPermissions([], { origin: new URL(page.url()).origin });
    await page.locator("#use-current-location").click();
    await expect(page.locator("#location-status")).toContainText(/location|address/i);
  });

  test("orders page shows seeded order and supports filtering", async ({ page }) => {
    await clearBrowserState(page);
    await seedUser(page);
    await page.addInitScript(() => localStorage.setItem("cafe-creme-orders", JSON.stringify([{
      id: "CC-TEST01", userEmail: "test@example.com", customer: "Test Customer",
      status: "Delivered", total: 259, createdAt: new Date().toISOString(),
      items: [{ name: "Velvet Latte", quantity: 1, price: 259 }], fulfilment: "pickup",
    }])));
    await page.goto("/html/orders.html");
    await expect(page.locator("#orders-total-count")).toHaveText("1");
    await expect(page.locator("#orders-list")).toContainText("CC-TEST01");
    await page.locator('[data-filter="Delivered"]').click();
    await expect(page.locator("#orders-list")).toContainText("Velvet Latte");
  });

  test("admin dashboard can update a festival theme", async ({ page }) => {
    await clearBrowserState(page);
    await page.addInitScript(() => localStorage.setItem("cafe-creme-current-user", JSON.stringify({ name: "Cafe Admin", email: "admin@cafecreme.local", role: "admin" })));
    await page.goto("/html/admin.html");
    await expect(page.locator("h1")).toContainText("Operations dashboard");
    await page.locator("#festival-theme-enabled").check();
    await page.locator("#active-festival-id").selectOption({ index: 1 });
    await page.locator("#save-festival-theme").click();
    await expect(page.locator("#festival-theme-status")).toContainText(/saved|updated/i);
    await expect.poll(() => page.evaluate(() => Boolean(localStorage.getItem("cafe-creme-active-festival")))).toBe(true);
  });

  test("mobile layout does not create horizontal overflow", async ({ page }) => {
    await page.goto("/html/home.html");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
  });
});
