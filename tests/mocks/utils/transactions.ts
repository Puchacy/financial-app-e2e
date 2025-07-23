import {
  MonthlyTransactionsResponseDto,
  TransactionDtoPagedResult,
  YearlyTransactionsResponseDto,
} from "../../../api";
import { UserType } from "../../constants/tokens";
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

export const getTransactionsHistoryResponse = (
  userType: UserType
): TransactionDtoPagedResult => {
  const data =
    userType === UserType.EXISTING_USER
      ? transactionsHistoryExistingUser
      : transactionsHistoryNewUser;

  return {
    totalItemCount: data.length,
    pageCount: 1,
    pageNumber: 1,
    pageSize: 5,
    pageData: data,
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
