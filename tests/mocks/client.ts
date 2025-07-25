import { http, HttpResponse } from "next/experimental/testmode/playwright/msw";
import {
  getLoginUserResponse,
  getRegisterUserResponse,
  getUserFromRequest,
  getUserMeResponse,
} from "./utils/users";
import {
  getMonthlyTransactionsResponse,
  getTransactionsHistoryResponse,
  getYearlyTransactionsResponse,
} from "./utils/transactions";
import { LoginUserRequestDto, RegisterUserRequestDto } from "../../api";
import { API_BASE_URL } from "./constants/api";

export const handlers = [
  // GET /api/v1/users/me
  http.get(`${API_BASE_URL}/api/v1/users/me`, ({ request }) => {
    const user = getUserFromRequest(request);

    return getUserMeResponse(user);
  }),

  // GET /api/v1/transactions
  http.get(`${API_BASE_URL}/api/v1/transactions`, ({ request }) => {
    const user = getUserFromRequest(request);

    if (!user)
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = getTransactionsHistoryResponse(user);

    return HttpResponse.json(response);
  }),

  // GET /api/v1/transactions/chart/monthly
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

  // GET /api/v1/transactions/chart/yearly
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

  // POST /api/v1/users/login
  http.post(`${API_BASE_URL}/api/v1/users/login`, async ({ request }) => {
    const body = (await request.json()) as LoginUserRequestDto;

    return getLoginUserResponse(body);
  }),

  // POST /api/v1/users/register
  http.post(`${API_BASE_URL}/api/v1/users/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterUserRequestDto;

    return getRegisterUserResponse(body);
  }),
];
