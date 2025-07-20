/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyTransactionSummaryDto } from './DailyTransactionSummaryDto';
export type MonthlyTransactionsResponseDto = {
    year?: number;
    month?: number;
    transactions?: Array<DailyTransactionSummaryDto> | null;
};

