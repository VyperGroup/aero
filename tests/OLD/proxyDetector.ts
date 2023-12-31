import { defineConfig, test } from "@playwright/test";

test("ws", async ({ page }) => {
	await page.goto(`/tests/ws`);
	await page.screenshot({ path: `example.png` });
});
