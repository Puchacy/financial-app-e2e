import { test, expect } from "./playwright.setup";

test.describe("Header", () => {
  test("shows app logo and name", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByTestId("app-logo")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "MojeFinanse", exact: true })
    ).toBeVisible();
  });

  test("clicking logo redirects to homepage", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard");
    await page.getByTestId("app-logo").click();

    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("shows login button when user is not authenticated", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");
    await expect(
      page.getByRole("button", { name: "Zaloguj się" })
    ).toBeVisible();
  });

  test("opens auth modal on login button click", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.getByRole("button", { name: "Zaloguj się" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();

    const authButton = page.getByTestId("auth-submit-button");
    await expect(authButton).toBeVisible();
    await expect(authButton).toContainText("Zaloguj się");
  });

  test("shows avatar and menu for authenticated user", async ({ page }) => {
    await page.context().addCookies([
      {
        name: "auth_token",
        value: "FAKE_VALID_JWT",
        domain: "localhost",
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    await page.goto("http://localhost:3000");

    const avatar = page.getByTestId("account-circle-icon");
    await expect(avatar).toBeVisible();
    await expect(page.getByText("Witaj Jan Kowalski")).toBeVisible();

    await avatar.click();

    await expect(
      page.locator('[role="menuitem"]', {
        hasText: "Strona główna",
      })
    ).toBeVisible();
    await expect(
      page.locator('[role="menuitem"]', {
        hasText: "Mój panel",
      })
    ).toBeVisible();
    await expect(
      page.locator('[role="menuitem"]', {
        hasText: "Wyloguj się",
      })
    ).toBeVisible();
  });

  test("navigates to homepage when clicking 'Strona główna'", async ({
    page,
  }) => {
    await page.context().addCookies([
      {
        name: "auth_token",
        value: "FAKE_VALID_JWT",
        domain: "localhost",
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    await page.goto("http://localhost:3000");

    await page.getByTestId("account-circle-icon").click();
    await page
      .locator('[role="menuitem"]', { hasText: "Strona główna" })
      .click();

    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("navigates to dashboard when clicking 'Mój panel'", async ({ page }) => {
    await page.context().addCookies([
      {
        name: "auth_token",
        value: "FAKE_VALID_JWT",
        domain: "localhost",
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    await page.goto("http://localhost:3000");

    await page.getByTestId("account-circle-icon").click();
    await page.locator('[role="menuitem"]', { hasText: "Mój panel" }).click();

    await expect(page).toHaveURL("http://localhost:3000/dashboard");
  });

  test("shows logout confirmation modal when clicking 'Wyloguj się'", async ({
    page,
  }) => {
    await page.context().addCookies([
      {
        name: "auth_token",
        value: "FAKE_VALID_JWT",
        domain: "localhost",
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    await page.goto("http://localhost:3000");

    await page.getByTestId("account-circle-icon").click();
    await page.locator('[role="menuitem"]', { hasText: "Wyloguj się" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByText("Czy na pewno chcesz się wylogować?")
    ).toBeVisible();
  });
});
