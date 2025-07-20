/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionDto } from './TransactionDto';
export type TransactionDtoPagedResult = {
    pageCount?: number;
    totalItemCount?: number;
    pageNumber?: number;
    pageSize?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
    isFirstPage?: boolean;
    isLastPage?: boolean;
    firstItemOnPage?: number;
    lastItemOnPage?: number;
    pageData?: Array<TransactionDto> | null;
};

