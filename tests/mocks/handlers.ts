import { http, HttpResponse } from "next/experimental/testmode/playwright/msw";
import {
  getLoginUserResponse,
  getRegisterUserResponse,
  getUserFromRequest,
  getUserMeResponse,
} from "./utils/users";
import {
  createTransactionResponse,
  getMonthlyTransactionsResponse,
  getTransactionsHistoryResponse,
  getYearlyTransactionsResponse,
} from "./utils/transactions";
import {
  CreateTransactionRequestDto,
  LoginUserRequestDto,
  RegisterUserRequestDto,
} from "../../api";
import { API_BASE_URL } from "./constants/api";

export const handlers = [
  http.get(`${API_BASE_URL}/api/v1/users/me`, ({ request }) => {
    const user = getUserFromRequest(request);

    return getUserMeResponse(user);
  }),

  http.get(`${API_BASE_URL}/api/v1/transactions`, ({ request }) => {
    const user = getUserFromRequest(request);

    if (!user)
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = getTransactionsHistoryResponse({
      userType: user,
      requestUrl: request.url,
    });

    return HttpResponse.json(response);
  }),

  http.post(`${API_BASE_URL}/api/v1/transactions`, async ({ request }) => {
    const user = getUserFromRequest(request);

    if (!user)
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateTransactionRequestDto;

    return createTransactionResponse(body);
  }),

  http.get(
    `${API_BASE_URL}/api/v1/transactions/chart/monthly`,
    ({ request }) => {
      const user = getUserFromRequest(request);

      if (!user)
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

      const response = getMonthlyTransactionsResponse(user);

      return HttpResponse.json(response);
    }
  ),

  http.get(
    `${API_BASE_URL}/api/v1/transactions/chart/yearly`,
    ({ request }) => {
      const user = getUserFromRequest(request);

      if (!user)
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

      const response = getYearlyTransactionsResponse(user);

      return HttpResponse.json(response);
    }
  ),

  http.post(`${API_BASE_URL}/api/v1/users/login`, async ({ request }) => {
    const body = (await request.json()) as LoginUserRequestDto;

    return getLoginUserResponse(body);
  }),

  http.post(`${API_BASE_URL}/api/v1/users/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterUserRequestDto;

    return getRegisterUserResponse(body);
  }),
];
