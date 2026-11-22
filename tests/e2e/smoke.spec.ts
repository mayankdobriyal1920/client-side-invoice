import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/SimpleInvoice/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("invoice generator loads", async ({ page }) => {
  await page.goto("/invoice-generator");
  await expect(page.getByRole("heading", { name: /Free Invoice Generator/i })).toBeVisible();
});

test("no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});