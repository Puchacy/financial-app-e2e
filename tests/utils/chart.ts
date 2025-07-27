import dayjs from "dayjs";
import "dayjs/locale/pl";
import {
  ExpenseSummaryDto,
  MonthlyTransactionsResponseDto,
  TransactionCategory,
  TransactionType,
  YearlyTransactionsResponseDto,
} from "../../api";
import { categoryLabels } from "../constants/transaction";

dayjs.locale("pl");

type TransactionKey = "income" | "expense";

const transactionTypeToKeyMap: Record<TransactionType, TransactionKey> = {
  [TransactionType.INCOME]: "income",
  [TransactionType.EXPENSE]: "expense",
};

const isMonthly = (data: any): data is MonthlyTransactionsResponseDto => {
  return "month" in data;
};

export const getChartData = (
  data: MonthlyTransactionsResponseDto | YearlyTransactionsResponseDto,
  type: TransactionType
) => {
  const key = transactionTypeToKeyMap[type];

  const nonZeroDaysCount =
    data.transactions?.filter(
      (transaction) => transaction[key]?.total && transaction[key].total > 0
    ).length || 0;

  const clickedBarIndex = 0;

  const firstNonZeroDataIndex =
    data.transactions?.findIndex(
      (transaction) => transaction[key]?.total && transaction[key].total > 0
    ) || 0;

  const selectedDay = isMonthly(data)
    ? data.transactions?.[firstNonZeroDataIndex].day || 0
    : 0;

  const selectedMonth = !isMonthly(data)
    ? data.transactions?.[firstNonZeroDataIndex].month || 0
    : 0;

  const tooltipFirstTextMonthly = `Dzień: ${selectedDay}`;
  const tooltipFirstTextYearly = `Miesiąc: ${dayjs()
    .month(selectedMonth - 1)
    .format("MMMM")}`;

  const tooltipFirstText = isMonthly(data)
    ? tooltipFirstTextMonthly
    : tooltipFirstTextYearly;

  const tooltipSecondText = `${
    type === TransactionType.EXPENSE ? "Wydatki:" : "Wpływy:"
  } ${(
    (data.transactions?.[firstNonZeroDataIndex][key]?.total || 0) / 100
  ).toFixed(2)} zł`;

  return {
    barsCount: nonZeroDaysCount,
    clickedBarIndex,
    tooltip: {
      firstText: tooltipFirstText,
      secondText: tooltipSecondText,
    },
  };
};

export const getExpenseDetailsModalData = (
  data: MonthlyTransactionsResponseDto | YearlyTransactionsResponseDto
) => {
  const key = transactionTypeToKeyMap[TransactionType.EXPENSE];

  const clickedBarIndex = 0;

  const firstNonZeroDataIndex =
    data.transactions?.findIndex(
      (transaction) => transaction[key]?.total && transaction[key].total > 0
    ) || 0;

  const selectedDay = isMonthly(data)
    ? data.transactions?.[firstNonZeroDataIndex].day || 0
    : 0;

  const selectedMonth = !isMonthly(data)
    ? data.transactions?.[firstNonZeroDataIndex].month || 0
    : 0;

  const hoverCategory = isMonthly(data)
    ? TransactionCategory.HOUSING
    : TransactionCategory.ENTERTAINMENT;

  const tooltipFirstText = `Kategoria: ${categoryLabels[hoverCategory]}`;
  const tooltipSecondText = `Kwota: ${(
    (data.transactions?.[clickedBarIndex].expense?.[
      hoverCategory.toLowerCase() as keyof ExpenseSummaryDto
    ] || 0) / 100
  ).toFixed(2)} zł`;

  const nonZeroExpenseCategoriesCount = Object.entries(
    data.transactions?.[clickedBarIndex].expense ?? {}
  ).filter(([key, value]) => key !== "total" && value > 0).length;

  const hoverCellIndex = 2;

  const sortedNonZeroCategories = Object.entries(
    data.transactions?.[clickedBarIndex].expense ?? {}
  )
    .filter(([key, value]) => key !== "total" && value > 0)
    .sort(([, a], [, b]) => b - a);

  const totalValue = data.transactions?.[clickedBarIndex].expense?.total || 0;

  const formattedCategoryLabels = sortedNonZeroCategories.map(
    ([categoryKey, value]) => {
      const text =
        categoryLabels[
          TransactionCategory[
            categoryKey.toUpperCase() as keyof typeof TransactionCategory
          ]
        ];
      const amount = (value / 100).toFixed(2);
      const percentage = Math.round((value / totalValue) * 100);

      return `${text}: ${amount} zł (${percentage}%)`;
    }
  );

  const summaryText = `Suma: ${(totalValue / 100).toFixed(2)} zł`;

  return {
    cellsCount: nonZeroExpenseCategoriesCount,
    clickedBarIndex,
    selectedDay,
    selectedMonth,
    tooltip: {
      firstText: tooltipFirstText,
      secondText: tooltipSecondText,
    },
    hoverCellIndex,
    formattedCategoryLabels,
    summaryText,
  };
};
