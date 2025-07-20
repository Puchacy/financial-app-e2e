import { test, expect } from "@playwright/test";
import { testimonials } from "./data/testimonials";
import { features } from "./data/features";

test.describe("Home Page", () => {
  test("displays the title, description, and testimonials", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    // Check the title
    await expect(
      page.getByRole("heading", { name: "Aplikacja MojeFinanse", level: 1 })
    ).toBeVisible();

    // Check the subtitle
    await expect(
      page.getByRole("heading", {
        name: "Zadbaj o swoje finanse w prosty i nowoczesny sposób – rejestruj transakcje, analizuj dane i korzystaj z automatycznych ułatwień opartych o AI.",
        level: 2,
      })
    ).toBeVisible();

    // Feature tiles
    for (const { title, text, testId } of features) {
      await expect(page.getByTestId(testId)).toBeVisible();
      await expect(
        page.getByRole("heading", { name: title, level: 3 })
      ).toBeVisible();
      await expect(page.getByText(text)).toBeVisible();
    }

    // Check the testimonials section
    await expect(
      page.getByRole("heading", { name: "Co mówią nasi użytkownicy", level: 4 })
    ).toBeVisible();

    for (const { name, content } of testimonials) {
      await expect(
        page
          .locator(`[data-testid="${name}Avatar"]`)
          .filter({ has: page.locator(":visible") })
          .first()
      ).toBeVisible();

      await expect(
        page.locator("p", { hasText: content }).first()
      ).toBeVisible();

      await expect(
        page.locator("p", { hasText: `— ${name}` }).first()
      ).toBeVisible();
    }
  });
});
