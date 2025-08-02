import { test, expect } from "next/experimental/testmode/playwright/msw";
import { handlers } from "./mocks/handlers";
import { existingUserCredentials } from "./constants/user";

test.use({
  mswHandlers: [handlers, { scope: "test" }],
});

test.describe("Login process", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Zaloguj się" }).click();

    await expect(page.getByTestId("auth-modal")).toBeVisible();
  });

  test("redirects to home page when accessing dashboard unauthenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL("/");
  });

  test("logs in successfully", async ({ page }) => {
    await page
      .getByTestId("auth-modal-email-input")
      .fill(existingUserCredentials.email as string);
    await page
      .getByTestId("auth-modal-password-input")
      .fill(existingUserCredentials.password as string);

    await page.getByTestId("auth-modal-submit-button").click();

    await expect(page.getByTestId("auth-modal")).toBeHidden();

    await expect(page).toHaveURL("/dashboard");
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.getByTestId("auth-modal-email-input").fill("wrong@example.com");
    await page.getByTestId("auth-modal-password-input").fill("wrongpass");

    await page.getByTestId("auth-modal-submit-button").click();

    await expect(
      page.getByText(
        "Nieprawidłowe dane. Sprawdź email lub hasło i spróbuj ponownie"
      )
    ).toBeVisible();
  });

  test("shows generic error message on server error", async ({ page }) => {
    await page
      .getByTestId("auth-modal-email-input")
      .fill("servererror@example.com");
    await page.getByTestId("auth-modal-password-input").fill("wrongpass");

    await page.getByTestId("auth-modal-submit-button").click();

    await expect(
      page.getByText("Wystąpił błąd. Proszę spróbować później")
    ).toBeVisible();
  });

  test("shows validation errors on empty login form submit", async ({
    page,
  }) => {
    await page.getByTestId("auth-modal-submit-button").click();

    await expect(page.getByText("Proszę podać email")).toBeVisible();
    await expect(page.getByText("Proszę podać hasło")).toBeVisible();
  });

  test("shows validation errors on invalid login data", async ({ page }) => {
    await page.getByTestId("auth-modal-email-input").fill("invalid-email");
    await page.getByTestId("auth-modal-password-input").fill("123");

    await page.getByTestId("auth-modal-submit-button").click();

    await expect(page.getByText("Nieprawidłowy email")).toBeVisible();
    await expect(page.getByText("Hasło musi mieć min. 6 znaków")).toBeVisible();
  });

  test("closes modal when clicking outside", async ({ page }) => {
    await page.mouse.click(10, 10);

    await expect(page.getByTestId("auth-modal")).toBeHidden();
  });

  test("toggles password visibility", async ({ page }) => {
    const passwordField = page.getByTestId("auth-modal-password-input");
    const visibilityIcon = page.getByTestId("auth-modal-visibility-icon");

    await passwordField.fill("password");
    await expect(passwordField).toHaveAttribute("type", "password");

    await visibilityIcon.click();
    await expect(passwordField).toHaveAttribute("type", "text");

    await visibilityIcon.click();
    await expect(passwordField).toHaveAttribute("type", "password");
  });
});
