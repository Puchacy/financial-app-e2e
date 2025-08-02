import { TransactionCategory } from "../../api";

export const categoryLabels: Record<TransactionCategory, string> = {
  [TransactionCategory.FOOD]: "Jedzenie",
  [TransactionCategory.TRANSPORT]: "Transport",
  [TransactionCategory.ENTERTAINMENT]: "Rozrywka",
  [TransactionCategory.HOUSING]: "Mieszkanie",
  [TransactionCategory.HEALTH]: "Zdrowie",
  [TransactionCategory.SHOPPING]: "Zakupy",
  [TransactionCategory.EDUCATION]: "Edukacja",
  [TransactionCategory.TRAVEL]: "Podróże",
  [TransactionCategory.UTILITIES]: "Rachunki",
  [TransactionCategory.OTHER]: "Pozostałe",
};

export const MAX_DESCRIPTION_LENGTH = 200;

export const EXAMPLE_DESCRIPTION = "Przykładowy opis";
export const TOO_LONG_DESCRIPTION = "a".repeat(MAX_DESCRIPTION_LENGTH + 1);
export const ERROR_DESCRIPTION = "Zwróć błąd";
