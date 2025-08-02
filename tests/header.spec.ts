import { test, expect } from "next/experimental/testmode/playwright/msw";
import { UserToken } from "./constants/user";
import { handlers } from "./mocks/handlers";

test.use({
  mswHandlers: [handlers, { scope: "test" }],
});

test.describe("Header – unauthenticated user", () => {
  test("shows app logo, title and login button", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("header-logo")).toBeVisible();
    await expect(page.getByTestId("header-title")).toBeVisible();
    await expect(page.getByTestId("header-title")).toHaveText("MojeFinanse");
    await expect(
      page.getByRole("button", { name: "Zaloguj się" })
    ).toBeVisible();
  });

  test("shows login form", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Zaloguj się" }).click();

    await expect(page.getByTestId("auth-modal")).toBeVisible();
    await expect(page.getByTestId("auth-modal-login-avatar")).toBeVisible();
    await expect(page.getByTestId("auth-modal-email-field")).toBeVisible();
    await expect(page.getByTestId("auth-modal-password-field")).toBeVisible();

    const submitButton = page.getByTestId("auth-modal-submit-button");
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Zaloguj się");

    await expect(page.getByText("Nie masz konta?")).toBeVisible();

    const modeButton = page.getByTestId("auth-modal-mode-button");
    await expect(modeButton).toBeVisible();
    await expect(modeButton).toContainText("Zarejestruj się");
  });

  test("shows register form", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Zaloguj się" }).click();
    await page.getByTestId("auth-modal-mode-button").click();

    await expect(page.getByTestId("auth-modal")).toBeVisible();
    await expect(page.getByTestId("auth-modal-register-avatar")).toBeVisible();
    await expect(page.getByTestId("auth-modal-name-field")).toBeVisible();
    await expect(page.getByTestId("auth-modal-surname-field")).toBeVisible();
    await expect(page.getByTestId("auth-modal-email-field")).toBeVisible();
    await expect(page.getByTestId("auth-modal-password-field")).toBeVisible();

    const submitButton = page.getByTestId("auth-modal-submit-button");
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Zarejestruj się");

    await expect(page.getByText("Masz konto?")).toBeVisible();

    const modeButton = page.getByTestId("auth-modal-mode-button");
    await expect(modeButton).toBeVisible();
    await expect(modeButton).toContainText("Zaloguj się");
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
  });

  test("shows avatar and greeting", async ({ page }) => {
    await page.goto("/");

    const avatar = page.getByTestId("header-avatar-icon");
    await expect(avatar).toBeVisible();
    await expect(page.getByText("Witaj Jan Kowalski")).toBeVisible();

    await avatar.click();

    await expect(page.getByTestId("menu-item-home-page")).toBeVisible();
    await expect(page.getByTestId("menu-item-home-page-icon")).toBeVisible();
    await expect(page.getByTestId("menu-item-home-page-text")).toBeVisible();
    await expect(page.getByTestId("menu-item-home-page-text")).toHaveText(
      "Strona główna"
    );

    await expect(page.getByTestId("menu-item-dashboard")).toBeVisible();
    await expect(page.getByTestId("menu-item-dashboard-icon")).toBeVisible();
    await expect(page.getByTestId("menu-item-dashboard-text")).toBeVisible();
    await expect(page.getByTestId("menu-item-dashboard-text")).toHaveText(
      "Mój panel"
    );

    await expect(page.getByTestId("menu-item-logout")).toBeVisible();
    await expect(page.getByTestId("menu-item-logout-icon")).toBeVisible();
    await expect(page.getByTestId("menu-item-logout-text")).toBeVisible();
    await expect(page.getByTestId("menu-item-logout-text")).toHaveText(
      "Wyloguj się"
    );
  });

  test("navigates to homepage when clicking 'Strona główna'", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await page.getByTestId("header-avatar-icon").click();
    await page.getByTestId("menu-item-home-page").click();

    await expect(page).toHaveURL("/");
  });

  test("navigates to dashboard when clicking 'Mój panel'", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("header-avatar-icon").click();
    await page.getByTestId("menu-item-dashboard").click();

    await expect(page).toHaveURL("/dashboard");
  });

  test("shows logout confirmation modal when clicking 'Wyloguj się'", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("header-avatar-icon").click();
    await page.getByTestId("menu-item-logout").click();

    await expect(page.getByTestId("confirmation-modal")).toBeVisible();
    await expect(
      page.getByText("Czy na pewno chcesz się wylogować?")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Anuluj" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Wyloguj" })).toBeVisible();
  });

  test("clicking logo redirects to homepage", async ({ page }) => {
    await page.goto("/dashboard");

    await page.getByTestId("header-logo").click();

    await expect(page).toHaveURL("/");
  });

  test("clicking app title redirects to homepage", async ({ page }) => {
    await page.goto("/dashboard");

    await page.getByTestId("header-title").click();

    await expect(page).toHaveURL("/");
  });
});
