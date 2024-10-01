import { test, expect } from "@playwright/test";
import { chromium } from "playwright";

import "../../../examples/config.js"; // load aeroConfig

(async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	test.describe("site support", () => {
		test("https://example.com", async ({ page }) => {
			page.goto(`${aeroConfig.prefix}https://example.com`);
			test("HTML title check", ({ page }) => {
				expect(page).toHaveTitle(/Example Domain/);
			});
			test("HTML light body check", ({ page }) => {
				expect(page.content()).toContain(
					"This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission."
				);
			});
			test("SW successfully registered", async ({ page }) => {
				expect(
					await page.evaluate(
						() => navigator.serviceWorker.controller
					)
				).toBeTruthy();
			});
			test("Bare-Mux 2.0 successfully registered", async ({ page }) => {
				expect(await page.evaluate(() => window.bareMux)).toBeTruthy();
				// TODO: Check if the transport was set
				// TODO: Try to make an example request using Bare-Mux 2.0 to prove it works
			});
		});
	});

	// TODO: Also test Discord with the option of even logging in (as a subtest) if DISCORD_TOKEN is set as an env variable. If not it will look and make sure the
	// TODO: Also test to see if YouTube loads
	// TODO: Also test to see if a Google search can be made and have another subtest to see if the Google is the modern layout (instead of the 2010 because of a broken rewriter)
})();
