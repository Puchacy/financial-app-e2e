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
