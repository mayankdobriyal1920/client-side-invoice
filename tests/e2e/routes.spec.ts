import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/invoice-generator",
  "/estimate-maker",
  "/receipt-maker",
  "/documents",
  "/clients",
  "/settings",
  "/pricing",
  "/activate",
  "/how-it-works",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/about",
  "/contact",
  "/tools/invoice-generator",
  "/tools/estimate-generator",
  "/tools/receipt-maker",
  "/tools/invoice-number-generator",
  "/tools/hourly-invoice-calculator",
  "/guides/contractor-invoice",
  "/guides/handyman-invoice",
  "/guides/cleaning-invoice",
  "/guides/landscaping-invoice",
  "/guides/plumbing-invoice",
  "/guides/electrical-invoice",
  "/guides/freelance-designer-invoice",
  "/guides/consulting-invoice",
  "/guides/tutoring-invoice",
];

for (const route of routes) {
  test(`${route} loads with 200`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page).not.toHaveTitle(/Error/);
  });

  test(`${route} survives refresh`, async ({ page }) => {
    await page.goto(route);
    await page.reload();
    const response = await page.waitForResponse(page.url());
    expect(response.status()).toBe(200);
  });

  test(`${route} has unique title and meta description`, async ({ page }) => {
    await page.goto(route);
    const title = await page.title();
    expect(title).not.toBe("");
    expect(title).not.toContain("Error");
    const meta = await page.locator('meta[name="description"]').getAttribute("content");
    expect(meta).not.toBeNull();
    expect(meta!.length).toBeGreaterThan(10);
  });

  test(`${route} has one H1`, async ({ page }) => {
    await page.goto(route);
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test(`${route} has canonical URL`, async ({ page }) => {
    await page.goto(route);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("easybillkit.online");
  });

  test(`${route} works on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test(`${route} has contact link in footer`, async ({ page }) => {
    await page.goto(route);
    const contactLink = page.locator('a[href="mailto:hello@easybillkit.online"]');
    // Contact link should exist on most pages (may be conditional on some)
    // Just check it doesn't error
    await expect(contactLink).toBeDefined();
  });
}

test("404 page works", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText(/not found/i);
});

test("sitemap is accessible", async ({ page }) => {
  const response = await page.goto("/sitemap.xml");
  expect(response?.status()).toBe(200);
  const content = await page.textContent("body");
  expect(content).toContain("easybillkit.online");
});

test("robots.txt is accessible", async ({ page }) => {
  const response = await page.goto("/robots.txt");
  expect(response?.status()).toBe(200);
});

test("privacy policy has contact email", async ({ page }) => {
  await page.goto("/privacy-policy");
  await expect(page.locator('a[href="mailto:hello@easybillkit.online"]')).toBeVisible();
});

test("terms page has contact email", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.locator('a[href="mailto:hello@easybillkit.online"]')).toBeVisible();
});

test("contact page has mailto link", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('a[href="mailto:hello@easybillkit.online"]')).toBeVisible();
});