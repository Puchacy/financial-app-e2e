/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTransactionRequestDto } from '../models/CreateTransactionRequestDto';
import type { MonthlyTransactionsResponseDto } from '../models/MonthlyTransactionsResponseDto';
import type { TransactionDto } from '../models/TransactionDto';
import type { TransactionDtoPagedResult } from '../models/TransactionDtoPagedResult';
import type { TransactionType } from '../models/TransactionType';
import type { YearlyTransactionsResponseDto } from '../models/YearlyTransactionsResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionService {
    /**
     * @returns TransactionDtoPagedResult OK
     * @throws ApiError
     */
    public static getApiV1Transactions({
        page = 1,
        pageSize = 5,
        transactionType,
        orderBy,
    }: {
        page?: number,
        pageSize?: number,
        transactionType?: TransactionType,
        orderBy?: string,
    }): CancelablePromise<TransactionDtoPagedResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/transactions',
            query: {
                'page': page,
                'pageSize': pageSize,
                'transactionType': transactionType,
                'orderBy': orderBy,
            },
        });
    }
    /**
     * @returns TransactionDto OK
     * @throws ApiError
     */
    public static postApiV1Transactions({
        requestBody,
    }: {
        requestBody?: CreateTransactionRequestDto,
    }): CancelablePromise<TransactionDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/transactions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns MonthlyTransactionsResponseDto OK
     * @throws ApiError
     */
    public static getApiV1TransactionsChartMonthly({
        year,
        month,
    }: {
        year?: number,
        month?: number,
    }): CancelablePromise<MonthlyTransactionsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/transactions/chart/monthly',
            query: {
                'year': year,
                'month': month,
            },
        });
    }
    /**
     * @returns YearlyTransactionsResponseDto OK
     * @throws ApiError
     */
    public static getApiV1TransactionsChartYearly({
        year,
    }: {
        year?: number,
    }): CancelablePromise<YearlyTransactionsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/transactions/chart/yearly',
            query: {
                'year': year,
            },
        });
    }
}
