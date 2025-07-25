import { test, expect } from "next/experimental/testmode/playwright/msw";
import { handlers } from "./mocks/client";
import { existingUserCredentials, newUserCredentials } from "./constants/user";

test.use({
  mswHandlers: [handlers, { scope: "test" }],
});

test.describe("Registration process", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Zaloguj się" }).click();

    await expect(page.getByTestId("auth-modal")).toBeVisible();

    await page.getByTestId("auth-modal-mode-button").click();
  });

  test("registers successfully", async ({ page }) => {
    await page
      .getByTestId("auth-modal-name-input")
      .fill(newUserCredentials.name as string);
    await page
      .getByTestId("auth-modal-surname-input")
      .fill(newUserCredentials.surname as string);
    await page
      .getByTestId("auth-modal-email-input")
      .fill(newUserCredentials.email as string);
    await page
      .getByTestId("auth-modal-password-input")
      .fill(newUserCredentials.password as string);

    await page.getByTestId("auth-modal-submit-button").click();

    await expect(page.getByTestId("auth-modal")).toBeHidden();

    await expect(page).toHaveURL("/dashboard");
  });

  test("shows error if the email already exists", async ({ page }) => {
    await page.getByTestId("auth-modal-name-input").fill("John");
    await page.getByTestId("auth-modal-surname-input").fill("Rambo");
    await page
      .getByTestId("auth-modal-email-input")
      .fill(existingUserCredentials.email as string);
    await page.getByTestId("auth-modal-password-input").fill("password");

    await page.getByTestId("auth-modal-submit-button").click();

    await expect(
      page.getByText(
        "Podany adres e-mail już istnieje. Spróbuj użyć innego adresu lub zaloguj się do konta"
      )
    ).toBeVisible();
  });

  test("shows generic error message on server error", async ({ page }) => {
    await page.getByTestId("auth-modal-name-input").fill("John");
    await page.getByTestId("auth-modal-surname-input").fill("Rambo");
    await page
      .getByTestId("auth-modal-email-input")
      .fill("servererror@example.com");
    await page.getByTestId("auth-modal-password-input").fill("password");

    await page.getByTestId("auth-modal-submit-button").click();

    await expect(
      page.getByText("Wystąpił błąd. Proszę spróbować później")
    ).toBeVisible();
  });

  test("shows validation errors on empty registration form submit", async ({
    page,
  }) => {
    await page.getByTestId("auth-modal-submit-button").click();

    await expect(page.getByText("Proszę podać imię")).toBeVisible();
    await expect(page.getByText("Proszę podać nazwisko")).toBeVisible();
    await expect(page.getByText("Proszę podać email")).toBeVisible();
    await expect(page.getByText("Proszę podać hasło")).toBeVisible();
  });

  test("shows validation errors on invalid login data", async ({ page }) => {
    await page.getByTestId("auth-modal-name-input").fill("");
    await page.getByTestId("auth-modal-surname-input").fill("");
    await page.getByTestId("auth-modal-email-input").fill("invalid-email");
    await page.getByTestId("auth-modal-password-input").fill("123");

    await page.getByTestId("auth-modal-submit-button").click();

    await expect(page.getByText("Proszę podać imię")).toBeVisible();
    await expect(page.getByText("Proszę podać nazwisko")).toBeVisible();
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
