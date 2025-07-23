import {
  TransactionCategory,
  TransactionDto,
  TransactionType,
} from "../../../api";

export const transactionsHistoryExistingUser: TransactionDto[] = [
  {
    amount: 11099,
    category: TransactionCategory.UTILITIES,
    date: "2025-06-23",
    description: "Rachunek za gaz",
    type: TransactionType.EXPENSE,
  },
  {
    amount: 7048,
    category: TransactionCategory.FOOD,
    date: "2025-06-22",
    description: "Kolacja w barze",
    type: TransactionType.EXPENSE,
  },
  {
    amount: 9999,
    category: TransactionCategory.ENTERTAINMENT,
    date: "2025-06-21",
    type: TransactionType.EXPENSE,
  },
  {
    amount: 300,
    date: "2025-06-20",
    description: "Zlecenie",
    type: TransactionType.INCOME,
  },
  {
    amount: 499,
    category: TransactionCategory.FOOD,
    date: "2025-06-19",
    description: "Drożdżówka",
    type: TransactionType.EXPENSE,
  },
  {
    amount: 2500,
    category: TransactionCategory.TRANSPORT,
    date: "2025-06-18",
    description: "Bilet miesięczny",
    type: TransactionType.EXPENSE,
  },
  {
    amount: 100000,
    date: "2025-06-17",
    description: "Wypłata",
    type: TransactionType.INCOME,
  },
  {
    amount: 8000,
    category: TransactionCategory.FOOD,
    date: "2025-06-16",
    description: "Kolacja w restauracji",
    type: TransactionType.EXPENSE,
  },
];

export const transactionsHistoryNewUser: TransactionDto[] = [];
