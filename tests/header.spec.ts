import { UserToken } from "./constants/tokens";
import { test, expect } from "./playwright.setup";

test.describe("Header – public", () => {
  test("shows app logo and name", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByTestId("app-logo")).toBeVisible();
    await expect(page.getByTestId("app-title")).toBeVisible();
  });
});

test.describe("Header – unauthenticated user", () => {
  test("shows login button", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(
      page.getByRole("button", { name: "Zaloguj się" })
    ).toBeVisible();
  });

  test("opens auth modal on login button click", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.getByRole("button", { name: "Zaloguj się" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByTestId("login-avatar")).toBeVisible();
    await expect(page.getByTestId("email-input")).toBeVisible();
    await expect(page.getByTestId("password-input")).toBeVisible();

    const authButton = page.getByTestId("auth-submit-button");
    await expect(authButton).toBeVisible();
    await expect(authButton).toContainText("Zaloguj się");

    await expect(page.getByText("Nie masz konta?")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Zarejestruj się" })
    ).toBeVisible();
  });
});

test.describe("Header – authenticated user", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      {
        name: "auth_token",
        value: UserToken.EXISTING_USER_TOKEN,
        domain: "localhost",
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("shows avatar and greeting", async ({ page }) => {
    const avatar = page.getByTestId("account-circle-icon");
    await expect(avatar).toBeVisible();
    await expect(page.getByText("Witaj Jan Kowalski")).toBeVisible();

    await avatar.click();
    await expect(
      page.locator('[role="menuitem"]', { hasText: "Strona główna" })
    ).toBeVisible();
    await expect(
      page.locator('[role="menuitem"]', { hasText: "Mój panel" })
    ).toBeVisible();
    await expect(
      page.locator('[role="menuitem"]', { hasText: "Wyloguj się" })
    ).toBeVisible();
  });

  test("navigates to homepage when clicking 'Strona główna'", async ({
    page,
  }) => {
    await page.getByTestId("account-circle-icon").click();
    await page
      .locator('[role="menuitem"]', { hasText: "Strona główna" })
      .click();

    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("navigates to dashboard when clicking 'Mój panel'", async ({ page }) => {
    await page.getByTestId("account-circle-icon").click();
    await page.locator('[role="menuitem"]', { hasText: "Mój panel" }).click();

    await expect(page).toHaveURL("http://localhost:3000/dashboard");
  });

  test("shows logout confirmation modal when clicking 'Wyloguj się'", async ({
    page,
  }) => {
    await page.getByTestId("account-circle-icon").click();
    await page.locator('[role="menuitem"]', { hasText: "Wyloguj się" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByText("Czy na pewno chcesz się wylogować?")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Anuluj" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Wyloguj" })).toBeVisible();
  });

  test("clicking logo redirects to homepage", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard");
    await page.getByTestId("app-logo").click();

    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("clicking app title redirects to homepage", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard");
    await page.getByTestId("app-title").click();

    await expect(page).toHaveURL("http://localhost:3000/");
  });
});
