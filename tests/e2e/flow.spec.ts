import { test, expect } from "@playwright/test";

test("pricing page shows buy button when not pro", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByText("Buy Pro with Paddle")).toBeVisible();
  await expect(page.getByPlaceholder("Enter discount code")).toBeVisible();
});

test("pricing page discount code input accepts TEST100", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByPlaceholder("Enter discount code").fill("TEST100");
  await expect(page.getByPlaceholder("Enter discount code")).toHaveValue("TEST100");
});

test("activate page shows email form", async ({ page }) => {
  await page.goto("/activate");
  await expect(page.getByPlaceholder("Purchase email")).toBeVisible();
  await expect(page.getByRole("button", { name: /Send verification code/i })).toBeVisible();
});

test("activate page requests OTP", async ({ page }) => {
  await page.goto("/activate");
  await page.getByPlaceholder("Purchase email").fill("test@example.com");
  await page.getByRole("button", { name: /Send verification code/i }).click();
  await expect(page.getByText(/If a licence exists/i)).toBeVisible({ timeout: 5000 });
});

test("homepage has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});