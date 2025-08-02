import { HttpResponse } from "next/experimental/testmode/playwright/msw";
import {
  CreateTransactionRequestDto,
  MonthlyTransactionsResponseDto,
  TransactionDto,
  TransactionDtoPagedResult,
  TransactionType,
  YearlyTransactionsResponseDto,
} from "../../../api";
import { UserType } from "../../constants/user";
import {
  monthlyTransactionsExistingUser,
  monthlyTransactionsNewUser,
} from "../data/monthlyTransactions";
import {
  transactionsHistoryExistingUser,
  transactionsHistoryNewUser,
} from "../data/transactionsHistory";
import {
  yearlyTransactionsExistingUser,
  yearlyTransactionsNewUser,
} from "../data/yearlyTransactions";
import { ERROR_DESCRIPTION } from "../../constants/transaction";

type getTransactionsHistoryResponseOptions = {
  userType: UserType;
  requestUrl: string;
};

export const getTransactionsHistoryResponse = ({
  userType,
  requestUrl,
}: getTransactionsHistoryResponseOptions): TransactionDtoPagedResult => {
  const { searchParams } = new URL(requestUrl);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
  const transactionType = searchParams.get(
    "transactionType"
  ) as TransactionType | null;
  const orderBy = searchParams.get("orderBy") || "dateDesc";

  const allData: TransactionDto[] =
    userType === UserType.EXISTING_USER
      ? transactionsHistoryExistingUser
      : transactionsHistoryNewUser;

  const filteredData = transactionType
    ? allData.filter((transaction) => transaction.type === transactionType)
    : allData;

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.date ?? 0).getTime();
    const dateB = new Date(b.date ?? 0).getTime();

    return orderBy === "dateAsc" ? dateA - dateB : dateB - dateA;
  });

  const totalItemCount = sortedData.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = sortedData.slice(startIndex, endIndex);

  return {
    totalItemCount,
    pageCount: Math.ceil(totalItemCount / pageSize),
    pageNumber: page,
    pageSize,
    pageData,
  };
};

export const getMonthlyTransactionsResponse = (
  userType: UserType
): MonthlyTransactionsResponseDto =>
  userType === UserType.EXISTING_USER
    ? monthlyTransactionsExistingUser
    : monthlyTransactionsNewUser;

export const getYearlyTransactionsResponse = (
  userType: UserType
): YearlyTransactionsResponseDto =>
  userType === UserType.EXISTING_USER
    ? yearlyTransactionsExistingUser
    : yearlyTransactionsNewUser;

export const createTransactionResponse = (
  body: CreateTransactionRequestDto
): HttpResponse<TransactionDto | { error: string }> => {
  if (body.description === ERROR_DESCRIPTION) {
    return HttpResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return HttpResponse.json({
    id: 1,
    ...body,
  });
};
