import dayjs from "dayjs";
import "dayjs/locale/pl";
import { test, expect } from "next/experimental/testmode/playwright/msw";
import { handlers } from "./mocks/client";
import { existingUser, newUser, UserToken } from "./constants/user";
import { monthlyTransactionsExistingUser } from "./mocks/data/monthlyTransactions";
import { yearlyTransactionsExistingUser } from "./mocks/data/yearlyTransactions";
import { TransactionCategory, TransactionType } from "../api";
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

  test.describe("Check header", () => {
    test("shows app logo, title and avatar", async ({ page }) => {
      await expect(page.getByTestId("header-logo")).toBeVisible();
      await expect(page.getByTestId("header-title")).toBeVisible();
      await expect(page.getByTestId("header-title")).toHaveText("MojeFinanse");
      await expect(page.getByTestId("header-avatar-icon")).toBeVisible();
      await expect(
        page.getByText(`Witaj ${existingUser.name} ${existingUser.surname}`)
      ).toBeVisible();
    });
  });

  test.describe("Check transaction input section", () => {
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

      await expect(
        page.getByTestId("transaction-add-image-icon")
      ).toBeVisible();
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

      for (const category of Object.values(TransactionCategory)) {
        await expect(
          page.getByTestId(
            `transaction-add-modal-category-item-${category.toLowerCase()}`
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
  });

  test.describe("Check monthly transactions chart", () => {
    test("shows transaction type buttons", async ({ page }) => {
      await expect(
        page.getByText("Podsumowanie Twoich finansów:")
      ).toBeVisible();

      const expenseButton = page.getByTestId("transaction-type-expense-button");
      await expect(expenseButton).toBeVisible();
      await expect(expenseButton).toContainText("Wydatki");

      const incomeButton = page.getByTestId("transaction-type-income-button");
      await expect(incomeButton).toBeVisible();
      await expect(incomeButton).toContainText("Wpływy");
    });

    test("shows monthly transactions chart for expenses", async ({ page }) => {
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

    test("shows expense details modal for monthly transactions chart", async ({
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

    test("shows monthly transactions chart for incomes", async ({ page }) => {
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

  test.describe("Check yearly transactions chart", () => {
    test("shows yearly transactions chart for expenses", async ({ page }) => {
      const { barsCount, clickedBarIndex, tooltip } = getChartData(
        yearlyTransactionsExistingUser,
        TransactionType.EXPENSE
      );

      await expect(page.getByTestId("yearly-chart-container")).toBeVisible();

      const previousButton = page
        .getByTestId("chart-header-previous-button")
        .nth(1);
      await expect(previousButton).toBeVisible();
      await expect(previousButton).toBeEnabled();

      const title = page.getByTestId("chart-header-title").nth(1);
      await expect(title).toBeVisible();
      await expect(title).toHaveText(dayjs().format("YYYY"));

      const nextButton = page.getByTestId("chart-header-next-button").nth(1);
      await expect(nextButton).toBeVisible();
      await expect(nextButton).toBeDisabled();

      const chartBars = page.getByTestId("yearly-chart-bar");
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

    test("shows expense details modal for yearly transactions chart", async ({
      page,
    }) => {
      const {
        cellsCount,
        clickedBarIndex,
        selectedMonth,
        tooltip,
        hoverCellIndex,
        formattedCategoryLabels,
        summaryText,
      } = getExpenseDetailsModalData(yearlyTransactionsExistingUser);

      const chartBars = page.getByTestId("yearly-chart-bar");
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
        dayjs()
          .month(selectedMonth - 1)
          .format("MMMM YYYY")
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

    test("shows yearly transactions chart for incomes", async ({ page }) => {
      const { barsCount, clickedBarIndex, tooltip } = getChartData(
        yearlyTransactionsExistingUser,
        TransactionType.INCOME
      );

      const incomeButton = page.getByTestId("transaction-type-income-button");
      await expect(incomeButton).toBeVisible();

      await incomeButton.click();

      await expect(page.getByTestId("yearly-chart-container")).toBeVisible();

      const previousButton = page
        .getByTestId("chart-header-previous-button")
        .nth(1);
      await expect(previousButton).toBeVisible();
      await expect(previousButton).toBeEnabled();

      const title = page.getByTestId("chart-header-title").nth(1);
      await expect(title).toBeVisible();
      await expect(title).toHaveText(dayjs().format("YYYY"));

      const nextButton = page.getByTestId("chart-header-next-button").nth(1);
      await expect(nextButton).toBeVisible();
      await expect(nextButton).toBeDisabled();

      const chartBars = page.getByTestId("yearly-chart-bar");
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

  test.describe("Check transaction history table", () => {
    test("shows filter buttons", async ({ page }) => {
      await expect(page.getByText("Historia transakcji:")).toBeVisible();

      const allTransactionsButton = page.getByTestId(
        "transaction-history-all-button"
      );
      await expect(allTransactionsButton).toBeVisible();
      await expect(allTransactionsButton).toHaveText("Wszystkie");

      const expensesButton = page.getByTestId(
        "transaction-history-expense-button"
      );
      await expect(expensesButton).toBeVisible();
      await expect(expensesButton).toHaveText("Wydatki");

      const incomesButton = page.getByTestId(
        "transaction-history-income-button"
      );
      await expect(incomesButton).toBeVisible();
      await expect(incomesButton).toHaveText("Wpływy");
    });

    test("shows transaction history table", async ({ page }) => {
      await expect(page.getByTestId("transaction-history-table")).toBeVisible();
      await expect(
        page.getByTestId("transaction-history-table-header")
      ).toBeVisible();

      const tableHeaderDate = page.getByTestId(
        "transaction-history-table-header-date"
      );
      await expect(tableHeaderDate).toBeVisible();
      await expect(tableHeaderDate).toHaveText("Data");

      const tableHeaderAmount = page.getByTestId(
        "transaction-history-table-header-amount"
      );
      await expect(tableHeaderAmount).toBeVisible();
      await expect(tableHeaderAmount).toHaveText("Kwota");

      const tableHeaderType = page.getByTestId(
        "transaction-history-table-header-type"
      );
      await expect(tableHeaderType).toBeVisible();
      await expect(tableHeaderType).toHaveText("Rodzaj");

      const tableHeaderCategory = page.getByTestId(
        "transaction-history-table-header-category"
      );
      await expect(tableHeaderCategory).toBeVisible();
      await expect(tableHeaderCategory).toHaveText("Kategoria");

      const tableHeaderDescription = page.getByTestId(
        "transaction-history-table-header-description"
      );
      await expect(tableHeaderDescription).toBeVisible();
      await expect(tableHeaderDescription).toHaveText("Opis");

      const rows = page.getByTestId("transaction-history-table-row");
      await expect(rows).toHaveCount(5);

      const showMoreButton = page.getByTestId(
        "transaction-history-show-more-button"
      );
      await expect(showMoreButton).toBeVisible();
      await expect(showMoreButton).toHaveText("Pokaż więcej");

      await showMoreButton.click();

      await expect(rows).toHaveCount(8);
      await expect(showMoreButton).not.toBeVisible();

      const expensesButton = page.getByTestId(
        "transaction-history-expense-button"
      );

      await expensesButton.click();

      await expect(rows).toHaveCount(5);
      await expect(showMoreButton).not.toBeVisible();

      const expensesRowsCount = await rows.count();
      for (let i = 0; i < expensesRowsCount; i++) {
        await expect(rows.nth(i)).not.toContainText("Wpływ");
      }

      const incomesButton = page.getByTestId(
        "transaction-history-income-button"
      );

      await incomesButton.click();

      await expect(rows).toHaveCount(3);
      await expect(showMoreButton).not.toBeVisible();

      const incomesRowsCount = await rows.count();
      for (let i = 0; i < incomesRowsCount; i++) {
        await expect(rows.nth(i)).not.toContainText("Wydatek");
      }
    });
  });

  test.describe("Check footer", () => {
    test("shows footer with all required elements", async ({ page }) => {
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
});

test.describe("Dashboard - new user", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      {
        name: "auth_token",
        value: UserToken.NEW_USER_TOKEN,
        domain: "localhost",
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    await page.goto("/dashboard");
  });

  test.describe("Check header", () => {
    test("shows app logo, title and avatar", async ({ page }) => {
      await expect(page.getByTestId("header-logo")).toBeVisible();
      await expect(page.getByTestId("header-title")).toBeVisible();
      await expect(page.getByTestId("header-title")).toHaveText("MojeFinanse");
      await expect(page.getByTestId("header-avatar-icon")).toBeVisible();
      await expect(
        page.getByText(`Witaj ${newUser.name} ${newUser.surname}`)
      ).toBeVisible();
    });
  });

  test.describe("Check transaction input section", () => {
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

      await expect(
        page.getByTestId("transaction-add-image-icon")
      ).toBeVisible();
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

      for (const category of Object.values(TransactionCategory)) {
        await expect(
          page.getByTestId(
            `transaction-add-modal-category-item-${category.toLowerCase()}`
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
  });

  test.describe("Check empty transactions charts", () => {
    test("shows disabled transaction type buttons", async ({ page }) => {
      await expect(
        page.getByText("Podsumowanie Twoich finansów:")
      ).toBeVisible();

      const expenseButton = page.getByTestId("transaction-type-expense-button");
      await expect(expenseButton).toBeVisible();
      await expect(expenseButton).toContainText("Wydatki");
      await expect(expenseButton).toBeDisabled();

      const incomeButton = page.getByTestId("transaction-type-income-button");
      await expect(incomeButton).toBeVisible();
      await expect(incomeButton).toContainText("Wpływy");
      await expect(incomeButton).toBeDisabled();
    });

    test("shows empty monthly transactions chart", async ({ page }) => {
      await expect(
        page.getByTestId("monthly-empty-chart-container")
      ).toBeVisible();
      await expect(
        page.getByTestId("empty-transactions-notice").nth(0)
      ).toBeVisible();
      await expect(
        page.getByTestId("empty-transactions-notice-icon").nth(0)
      ).toBeVisible();
      await expect(
        page.getByTestId("empty-transactions-notice-text").nth(0)
      ).toContainText(
        "Dodaj swoją pierwszą transakcję, aby zobaczyć miesięczne podsumowanie wydatków i wpływów."
      );
      await expect(page.getByTestId("monthly-chart-bar")).toHaveCount(0);
    });

    test("shows empty yearly transactions chart", async ({ page }) => {
      await expect(
        page.getByTestId("yearly-empty-chart-container")
      ).toBeVisible();
      await expect(
        page.getByTestId("empty-transactions-notice").nth(1)
      ).toBeVisible();
      await expect(
        page.getByTestId("empty-transactions-notice-icon").nth(1)
      ).toBeVisible();
      await expect(
        page.getByTestId("empty-transactions-notice-text").nth(1)
      ).toContainText(
        "Dodaj swoją pierwszą transakcję, aby zobaczyć roczne podsumowanie wydatków i wpływów."
      );
      await expect(page.getByTestId("monthly-chart-bar")).toHaveCount(0);
    });
  });

  test.describe("Check empty transaction history table", () => {
    test("shows disabled filter buttons", async ({ page }) => {
      await expect(page.getByText("Historia transakcji:")).toBeVisible();

      const allTransactionsButton = page.getByTestId(
        "transaction-history-all-button"
      );
      await expect(allTransactionsButton).toBeVisible();
      await expect(allTransactionsButton).toHaveText("Wszystkie");
      await expect(allTransactionsButton).toBeDisabled();

      const expensesButton = page.getByTestId(
        "transaction-history-expense-button"
      );
      await expect(expensesButton).toBeVisible();
      await expect(expensesButton).toHaveText("Wydatki");
      await expect(expensesButton).toBeDisabled();

      const incomesButton = page.getByTestId(
        "transaction-history-income-button"
      );
      await expect(incomesButton).toBeVisible();
      await expect(incomesButton).toHaveText("Wpływy");
      await expect(incomesButton).toBeDisabled();
    });

    test("shows empty transaction history table", async ({ page }) => {
      await expect(
        page.getByTestId("transaction-history-empty-table")
      ).toBeVisible();
      await expect(
        page.getByTestId("transaction-history-empty-table-header")
      ).toBeVisible();

      const tableHeaderDate = page.getByTestId(
        "transaction-history-empty-table-header-date"
      );
      await expect(tableHeaderDate).toBeVisible();
      await expect(tableHeaderDate).toHaveText("Data");

      const tableHeaderAmount = page.getByTestId(
        "transaction-history-empty-table-header-amount"
      );
      await expect(tableHeaderAmount).toBeVisible();
      await expect(tableHeaderAmount).toHaveText("Kwota");

      const tableHeaderType = page.getByTestId(
        "transaction-history-empty-table-header-type"
      );
      await expect(tableHeaderType).toBeVisible();
      await expect(tableHeaderType).toHaveText("Rodzaj");

      const tableHeaderCategory = page.getByTestId(
        "transaction-history-empty-table-header-category"
      );
      await expect(tableHeaderCategory).toBeVisible();
      await expect(tableHeaderCategory).toHaveText("Kategoria");

      const tableHeaderDescription = page.getByTestId(
        "transaction-history-empty-table-header-description"
      );
      await expect(tableHeaderDescription).toBeVisible();
      await expect(tableHeaderDescription).toHaveText("Opis");

      const rows = page.getByTestId("transaction-history-empty-table-row");
      await expect(rows).toHaveCount(5);

      const showMoreButton = page.getByTestId(
        "transaction-history-show-more-button"
      );
      await expect(showMoreButton).not.toBeVisible();

      await expect(
        page.getByTestId("empty-transactions-notice").nth(2)
      ).toBeVisible();
      await expect(
        page.getByTestId("empty-transactions-notice-icon").nth(2)
      ).toBeVisible();
      await expect(
        page.getByTestId("empty-transactions-notice-text").nth(2)
      ).toContainText(
        "Dodaj swoją pierwszą transakcję, aby zobaczyć historię wydatków i wpływów."
      );
    });
  });

  test.describe("Check footer", () => {
    test("shows footer with all required elements", async ({ page }) => {
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
});
