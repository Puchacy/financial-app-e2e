/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionCategory } from './TransactionCategory';
import type { TransactionType } from './TransactionType';
export type TransactionDto = {
    id?: number;
    type?: TransactionType;
    date?: string;
    amount?: number;
    category?: TransactionCategory;
    description?: string | null;
};

