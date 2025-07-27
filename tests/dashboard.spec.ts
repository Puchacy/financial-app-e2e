import { test, expect } from "next/experimental/testmode/playwright/msw";
import { handlers } from "./mocks/client";
import { existingUser, UserToken } from "./constants/user";
import { categoryLabels } from "./constants/transaction";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { monthlyTransactionsExistingUser } from "./mocks/data/monthlyTransactions";
import { TransactionType } from "../api";
import { getChartData, getExpenseDetailsModalData } from "./utils/chart";

dayjs.locale("pl");

test.use({
  mswHandlers: [handlers, { scope: "test" }],
});

test.describe("Dashboard - existing user", () => {
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
  });

  test("shows app logo, title and avatar", async ({ page }) => {
    await expect(page.getByTestId("header-logo")).toBeVisible();
    await expect(page.getByTestId("header-title")).toBeVisible();
    await expect(page.getByTestId("header-title")).toHaveText("MojeFinanse");
    await expect(page.getByTestId("header-avatar-icon")).toBeVisible();
    await expect(
      page.getByText(`Witaj ${existingUser.name} ${existingUser.surname}`)
    ).toBeVisible();
  });

  test("shows transaction input section", async ({ page }) => {
    await expect(page.getByTestId("transaction-input-field")).toBeVisible();

    const infoIcon = page.getByTestId("transaction-info-icon");
    await expect(infoIcon).toBeVisible();

    await infoIcon.click();

    const infoAlert = page.getByTestId("transaction-info-alert");
    await expect(infoAlert).toBeVisible();
    await expect(infoAlert).toHaveText(
      "Wpisz swój wydatek lub wpływ w formie opisowej. Nasza aplikacja zinterpretuje wprowadzony tekst i automatycznie uzupełni formularz. Możesz także dodać zdjęcie paragonu, a my odczytamy z niego dane. Jeśli wolisz – kliknij „Dodaj transakcję” i wypełnij formularz ręcznie."
    );

    await page.mouse.click(10, 10);
    await expect(infoAlert).not.toBeVisible();

    const addTransactionButton = page.getByTestId("transaction-add-button");
    await expect(addTransactionButton).toBeVisible();
    await expect(addTransactionButton).toHaveText("Dodaj transakcję");

    const addImageButton = page.getByTestId("transaction-add-image-button");
    await expect(addImageButton).toBeVisible();
    await expect(addImageButton).toHaveText("Dodaj zdjęcie");

    await expect(page.getByTestId("transaction-add-image-icon")).toBeVisible();
  });

  test("shows add transaction modal", async ({ page }) => {
    await page.getByTestId("transaction-add-button").click();
    await expect(page.getByTestId("transaction-add-modal")).toBeVisible();
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

    for (const label of Object.values(categoryLabels)) {
      await expect(
        page.getByTestId(
          `transaction-add-modal-category-item-${label.toLowerCase()}`
        )
      ).toBeVisible();
    }

    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).not.toBeVisible();

    await expect(
      page.getByTestId("transaction-add-modal-description-field")
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
  });

  test("shows transaction type buttons", async ({ page }) => {
    await expect(page.getByText("Podsumowanie Twoich finansów:")).toBeVisible();

    const expenseButton = page.getByTestId("transaction-type-expense-button");
    await expect(expenseButton).toBeVisible();
    await expect(expenseButton).toContainText("Wydatki");

    const incomeButton = page.getByTestId("transaction-type-income-button");
    await expect(incomeButton).toBeVisible();
    await expect(incomeButton).toContainText("Wpływy");
  });

  test("shows monthly transaction chart for expenses", async ({ page }) => {
    const { barsCount, clickedBarIndex, tooltip } = getChartData(
      monthlyTransactionsExistingUser,
      TransactionType.EXPENSE
    );

    await expect(page.getByTestId("monthly-chart-container")).toBeVisible();

    const previousButton = page
      .getByTestId("chart-header-previous-button")
      .nth(0);
    await expect(previousButton).toBeVisible();
    await expect(previousButton).toBeEnabled();

    const title = page.getByTestId("chart-header-title").nth(0);
    await expect(title).toBeVisible();
    await expect(title).toHaveText(dayjs().format("MMMM YYYY"));

    const nextButton = page.getByTestId("chart-header-next-button").nth(0);
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeDisabled();

    const chartBars = page.getByTestId("monthly-chart-bar");
    await expect(chartBars).toHaveCount(barsCount);

    await chartBars.nth(clickedBarIndex).click();
    await expect(page.getByTestId("expense-details-modal")).toBeVisible();

    await page.keyboard.press("Escape");

    await chartBars.nth(clickedBarIndex).hover();
    await expect(page.getByTestId("bar-chart-tooltip")).toBeVisible();

    const barChartTooltipFirstText = page.getByTestId(
      "bar-chart-tooltip-first-text"
    );
    await expect(barChartTooltipFirstText).toBeVisible();
    await expect(barChartTooltipFirstText).toHaveText(tooltip.firstText);

    const barChartTooltipSecondText = page.getByTestId(
      "bar-chart-tooltip-second-text"
    );
    await expect(barChartTooltipSecondText).toBeVisible();
    await expect(barChartTooltipSecondText).toHaveText(tooltip.secondText);
  });

  test("shows expense details modal for monthly transaction chart", async ({
    page,
  }) => {
    const {
      cellsCount,
      clickedBarIndex,
      selectedDay,
      tooltip,
      hoverCellIndex,
      formattedCategoryLabels,
      summaryText,
    } = getExpenseDetailsModalData(monthlyTransactionsExistingUser);

    const chartBars = page.getByTestId("monthly-chart-bar");
    await expect(chartBars.nth(clickedBarIndex)).toBeVisible();

    await chartBars.nth(clickedBarIndex).click();

    const expenseDetailsModal = page.getByTestId("expense-details-modal");
    await expect(expenseDetailsModal).toBeVisible();

    const modalTitle = page.getByTestId("expense-details-modal-title");
    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).toHaveText("Podsumowanie wydatków");

    const modalSubtitle = page.getByTestId("expense-details-modal-subtitle");
    await expect(modalSubtitle).toBeVisible();
    await expect(modalSubtitle).toHaveText(
      dayjs().date(selectedDay).format("DD.MM.YYYY")
    );

    await expect(
      page.getByTestId("expense-details-modal-close-icon")
    ).toBeVisible();
    await expect(
      page.getByTestId("expense-details-modal-pie-chart")
    ).toBeVisible();

    const pieChartCells = page.getByTestId(
      "expense-details-modal-pie-chart-cell"
    );
    await expect(pieChartCells).toHaveCount(cellsCount);

    await pieChartCells.nth(hoverCellIndex).hover();
    await expect(page.getByTestId("pie-chart-tooltip")).toBeVisible();

    const pieChartTooltipFirstText = page.getByTestId(
      "pie-chart-tooltip-first-text"
    );
    await expect(pieChartTooltipFirstText).toBeVisible();
    await expect(pieChartTooltipFirstText).toHaveText(tooltip.firstText);

    const pieChartTooltipSecondText = page.getByTestId(
      "pie-chart-tooltip-second-text"
    );
    await expect(pieChartTooltipSecondText).toBeVisible();

    await expect(pieChartTooltipSecondText).toHaveText(tooltip.secondText);

    await expect(
      page.getByTestId("expense-details-modal-category-labels-container")
    ).toBeVisible();
    await expect(
      page.getByTestId("expense-details-modal-category-label")
    ).toHaveCount(cellsCount);
    await expect(
      page.getByTestId("expense-details-modal-category-label-icon")
    ).toHaveCount(cellsCount);

    const categorLabelTexts = page.getByTestId(
      "expense-details-modal-category-label-text"
    );

    for (let i = 0; i < formattedCategoryLabels.length; i++) {
      await expect(categorLabelTexts.nth(i)).toHaveText(
        formattedCategoryLabels[i]
      );
    }

    await expect(
      page.getByTestId("expense-details-modal-category-label-divider")
    ).toBeVisible();

    const summary = page.getByTestId(
      "expense-details-modal-category-label-summary"
    );
    await expect(summary).toBeVisible();
    await expect(summary).toHaveText(summaryText);

    const closeIcon = page.getByTestId("expense-details-modal-close-icon");
    await expect(closeIcon).toBeVisible();

    await closeIcon.click();

    await expect(expenseDetailsModal).not.toBeVisible();
  });

  test("shows monthly transaction chart for incomes", async ({ page }) => {
    const { barsCount, clickedBarIndex, tooltip } = getChartData(
      monthlyTransactionsExistingUser,
      TransactionType.INCOME
    );

    const incomeButton = page.getByTestId("transaction-type-income-button");
    await expect(incomeButton).toBeVisible();

    await incomeButton.click();

    await expect(page.getByTestId("monthly-chart-container")).toBeVisible();

    const previousButton = page
      .getByTestId("chart-header-previous-button")
      .nth(0);
    await expect(previousButton).toBeVisible();
    await expect(previousButton).toBeEnabled();

    const title = page.getByTestId("chart-header-title").nth(0);
    await expect(title).toBeVisible();
    await expect(title).toHaveText(dayjs().format("MMMM YYYY"));

    const nextButton = page.getByTestId("chart-header-next-button").nth(0);
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeDisabled();

    const chartBars = page.getByTestId("monthly-chart-bar");
    await expect(chartBars).toHaveCount(barsCount);

    await chartBars.nth(clickedBarIndex).click();
    await expect(page.getByTestId("expense-details-modal")).not.toBeVisible();

    await chartBars.nth(clickedBarIndex).hover();
    await expect(page.getByTestId("bar-chart-tooltip")).toBeVisible();

    const barChartTooltipFirstText = page.getByTestId(
      "bar-chart-tooltip-first-text"
    );
    await expect(barChartTooltipFirstText).toBeVisible();
    await expect(barChartTooltipFirstText).toHaveText(tooltip.firstText);

    const barChartTooltipSecondText = page.getByTestId(
      "bar-chart-tooltip-second-text"
    );
    await expect(barChartTooltipSecondText).toBeVisible();
    await expect(barChartTooltipSecondText).toHaveText(tooltip.secondText);
  });
});
