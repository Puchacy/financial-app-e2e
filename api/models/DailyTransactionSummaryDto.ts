/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseSummaryDto } from './ExpenseSummaryDto';
import type { IncomeSummaryDto } from './IncomeSummaryDto';
export type DailyTransactionSummaryDto = {
    day?: number;
    expense?: ExpenseSummaryDto;
    income?: IncomeSummaryDto;
};

