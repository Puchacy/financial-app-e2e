import { test, expect } from "next/experimental/testmode/playwright/msw";
import { handlers } from "./mocks/client";
import { UserToken } from "./constants/user";
import {
  categoryLabels,
  ERROR_DESCRIPTION,
  EXAMPLE_DESCRIPTION,
  MAX_DESCRIPTION_LENGTH,
  TOO_LONG_DESCRIPTION,
} from "./constants/transaction";
import { TransactionCategory } from "../api";

test.use({
  mswHandlers: [handlers, { scope: "test" }],
});

test.describe("Adding transaction", () => {
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

    await page.goto("/dashboard");
    await page.getByTestId("transaction-add-button").click();
    await expect(page.getByTestId("transaction-add-modal")).toBeVisible();
  });

  test("shows add transaction modal", async ({ page }) => {
    await expect(page.getByText("Wprowadź transakcję")).toBeVisible();
    await expect(page.getByText("Rodzaj *")).toBeVisible();

    const expenseButton = page.getByTestId(
      "transaction-add-modal-expense-button"
    );
    await expect(expenseButton).toBeVisible();
    await expect(expenseButton).toHaveText("Wydatek");

    const incomeButton = page.getByTestId(
      "transaction-add-modal-income-button"
    );
    await expect(incomeButton).toBeVisible();
    await expect(incomeButton).toHaveText("Wpływ");

    await expect(
      page.getByTestId("transaction-add-modal-amount-field")
    ).toBeVisible();
    await expect(
      page.getByTestId("transaction-add-modal-amount-input")
    ).toBeVisible();

    const amountFieldCurrency = page.getByTestId(
      "transaction-add-modal-amount-currency"
    );
    await expect(amountFieldCurrency).toBeVisible();
    await expect(amountFieldCurrency).toHaveText("zł");

    await expect(
      page.getByTestId("transaction-add-modal-date-input")
    ).toBeVisible();
    await expect(page.getByTestId("CalendarIcon")).toBeVisible();

    const categoryLabel = page.getByTestId(
      "transaction-add-modal-category-label"
    );
    await expect(categoryLabel).toBeVisible();
    await expect(categoryLabel).toHaveText("Kategoria *");

    const categorySelect = page.getByTestId(
      "transaction-add-modal-category-select"
    );
    await expect(categorySelect).toBeVisible();

    await categorySelect.click();

    for (const category of Object.values(TransactionCategory)) {
      const categoryItem = page.getByTestId(
        `transaction-add-modal-category-item-${category.toLowerCase()}`
      );
      await expect(categoryItem).toBeVisible();
      await expect(categoryItem).toHaveText(categoryLabels[category]);
    }

    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).not.toBeVisible();

    await expect(
      page.getByTestId("transaction-add-modal-description-field")
    ).toBeVisible();
    await expect(
      page.getByTestId("transaction-add-modal-description-input")
    ).toBeVisible();

    const maxLength = page.getByTestId(
      "transaction-add-modal-description-max-length"
    );
    await expect(maxLength).toBeVisible();
    await expect(maxLength).toHaveText("0/200");

    const cancelButton = page.getByTestId(
      "transaction-add-modal-cancel-button"
    );
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toContainText("Anuluj");

    const saveButton = page.getByTestId("transaction-add-modal-save-button");
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toContainText("Zapisz");

    await incomeButton.click();
    await expect(page.getByRole("combobox")).toBeDisabled();

    await categorySelect.click();
    await expect(page.getByRole("listbox")).not.toBeVisible();
  });

  test("adds expense transaction successfully", async ({ page }) => {
    await page.getByTestId("transaction-add-modal-amount-input").fill("100");
    await page.getByTestId("transaction-add-modal-category-select").click();
    await page
      .getByTestId("transaction-add-modal-category-item-entertainment")
      .click();
    await page
      .getByTestId("transaction-add-modal-description-input")
      .fill(EXAMPLE_DESCRIPTION);
    await expect(
      page.getByTestId("transaction-add-modal-description-max-length")
    ).toHaveText(`${EXAMPLE_DESCRIPTION.length}/${MAX_DESCRIPTION_LENGTH}`);

    await page.getByTestId("transaction-add-modal-save-button").click();

    await expect(page.getByTestId("transaction-add-modal")).toBeHidden();
  });

  test("adds income transaction successfully", async ({ page }) => {
    await page.getByTestId("transaction-add-modal-income-button").click();
    await page.getByTestId("transaction-add-modal-amount-input").fill("500");
    await page
      .getByTestId("transaction-add-modal-description-input")
      .fill(EXAMPLE_DESCRIPTION);
    await expect(
      page.getByTestId("transaction-add-modal-description-max-length")
    ).toHaveText(`${EXAMPLE_DESCRIPTION.length}/${MAX_DESCRIPTION_LENGTH}`);

    await page.getByTestId("transaction-add-modal-save-button").click();

    await expect(page.getByTestId("transaction-add-modal")).toBeHidden();
  });

  test("shows validation errors on empty expense transaction form submit", async ({
    page,
  }) => {
    await page.getByTestId("transaction-add-modal-save-button").click();

    await expect(page.getByText("Wpisz kwotę")).toBeVisible();
    await expect(page.getByText("Wybierz kategorię")).toBeVisible();

    await page.getByTestId("transaction-add-modal-save-button").click();

    await expect(page.getByTestId("transaction-add-modal")).not.toBeHidden();
  });

  test("shows validation errors on empty income transaction form submit", async ({
    page,
  }) => {
    await page.getByTestId("transaction-add-modal-income-button").click();
    await page.getByTestId("transaction-add-modal-save-button").click();

    await expect(page.getByText("Wpisz kwotę")).toBeVisible();
    await expect(page.getByText("Wybierz kategorię")).not.toBeVisible();

    await page.getByTestId("transaction-add-modal-save-button").click();

    await expect(page.getByTestId("transaction-add-modal")).not.toBeHidden();
  });

  test("shows validation errors on invalid form data", async ({ page }) => {
    await page.getByTestId("transaction-add-modal-amount-input").fill("0");
    await expect(page.getByText("Kwota musi być większa niż 0")).toBeVisible();

    await page
      .getByTestId("transaction-add-modal-date-input")
      .click({ force: true });
    await page.keyboard.press("Control+A");
    await page.keyboard.type("11111");
    await expect(page.getByText("Wybierz datę")).toBeVisible();

    await page
      .getByTestId("transaction-add-modal-description-input")
      .fill(TOO_LONG_DESCRIPTION);
    await expect(
      page.getByTestId("transaction-add-modal-description-max-length")
    ).toHaveText(`${TOO_LONG_DESCRIPTION.length}/${MAX_DESCRIPTION_LENGTH}`);
    await expect(
      page.getByText(
        `Opis może mieć maksymalnie ${MAX_DESCRIPTION_LENGTH} znaków`
      )
    ).toBeVisible();

    await page.getByTestId("transaction-add-modal-save-button").click();

    await expect(page.getByTestId("transaction-add-modal")).not.toBeHidden();
  });

  test("shows generic error message on server error", async ({ page }) => {
    await page.getByTestId("transaction-add-modal-amount-input").fill("100");
    await page.getByTestId("transaction-add-modal-category-select").click();
    await page
      .getByTestId(
        `transaction-add-modal-category-item-${TransactionCategory.ENTERTAINMENT.toLowerCase()}`
      )
      .click();
    await page
      .getByTestId("transaction-add-modal-description-input")
      .fill(ERROR_DESCRIPTION);
    await expect(
      page.getByTestId("transaction-add-modal-description-max-length")
    ).toHaveText(`${ERROR_DESCRIPTION.length}/${MAX_DESCRIPTION_LENGTH}`);
    await page.getByTestId("transaction-add-modal-save-button").click();

    const errorAlert = page.getByTestId("transaction-add-modal-error-alert");
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(
      "Nie udało się zapisać danych. Spróbuj ponownie później."
    );

    await expect(page.getByTestId("transaction-add-modal")).not.toBeHidden();
  });
});
