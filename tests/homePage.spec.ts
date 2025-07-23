import { test, expect } from "next/experimental/testmode/playwright/msw";
import { testimonials } from "./data/testimonials";
import { features } from "./data/features";

test.describe("Home Page", () => {
  test("displays header, footer and the page content", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Header
    await expect(page.getByTestId("header-logo")).toBeVisible();
    await expect(page.getByTestId("header-title")).toBeVisible();
    await expect(page.getByTestId("header-title")).toHaveText("MojeFinanse");
    await expect(
      page.getByRole("button", { name: "Zaloguj się" })
    ).toBeVisible();

    // Title
    await expect(
      page.getByRole("heading", { name: "Aplikacja MojeFinanse", level: 1 })
    ).toBeVisible();

    // Subtitle
    await expect(
      page.getByRole("heading", {
        name: "Zadbaj o swoje finanse w prosty i nowoczesny sposób – rejestruj transakcje, analizuj dane i korzystaj z automatycznych ułatwień opartych o AI.",
        level: 2,
      })
    ).toBeVisible();

    // Feature tiles
    for (const { title, text, dataTestId } of features) {
      await expect(page.getByTestId(dataTestId)).toBeVisible();
      await expect(
        page.getByRole("heading", { name: title, level: 3 })
      ).toBeVisible();
      await expect(page.getByText(text)).toBeVisible();
    }

    // Testimonials
    await expect(
      page.getByRole("heading", { name: "Co mówią nasi użytkownicy", level: 4 })
    ).toBeVisible();

    for (const { name, content } of testimonials) {
      await expect(
        page
          .locator(`[data-testid="home-page-${name}-avatar"]`)
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

    // Footer
    await expect(
      page.getByRole("heading", { name: "MojeFinanse", level: 5 })
    ).toBeVisible();

    const linkAbout = page.getByRole("link", { name: "O nas" });
    await expect(linkAbout).toBeVisible();
    await expect(linkAbout).toHaveAttribute("href", "/about");

    const linkContact = page.getByRole("link", { name: "Kontakt" });
    await expect(linkContact).toBeVisible();
    await expect(linkContact).toHaveAttribute("href", "/contact");

    const linkPrivacy = page.getByRole("link", {
      name: "Polityka prywatności",
    });
    await expect(linkPrivacy).toBeVisible();
    await expect(linkPrivacy).toHaveAttribute("href", "/privacy");

    await expect(
      page
        .locator("p", {
          hasText: `© ${new Date().getFullYear()} Aplikacja MojeFinanse. Wszelkie prawa zastrzeżone.`,
        })
        .first()
    ).toBeVisible();
  });
});
