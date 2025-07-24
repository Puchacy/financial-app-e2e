import { http, HttpResponse } from "next/experimental/testmode/playwright/msw";
import { getLoginUserResponse, getUserFromRequest } from "./utils/users";
import {
  getMonthlyTransactionsResponse,
  getTransactionsHistoryResponse,
  getYearlyTransactionsResponse,
} from "./utils/transactions";
import {
  LoginUserRequestDto,
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from "../../api";
import { UserToken } from "../constants/user";
import { API_BASE_URL } from "./constants/api";

export const handlers = [
  // GET /api/v1/users/me
  http.get(`${API_BASE_URL}/api/v1/users/me`, () => {
    return HttpResponse.json({
      id: 1,
      name: "Jan",
      surname: "Kowalski",
      email: "jan.kowalski@example.com",
    });
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
    const credentials = (await request.json()) as LoginUserRequestDto;

    return getLoginUserResponse(credentials);
  }),

  // POST /api/v1/users/register
  http.post(`${API_BASE_URL}/api/v1/users/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterUserRequestDto;

    if (!body.email || !body.password || !body.name || !body.surname) {
      return HttpResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const response: RegisterUserResponseDto = {
      token: UserToken.NEW_USER_TOKEN,
      user: {
        id: 2,
        name: body.name,
        surname: body.surname,
        email: body.email,
      },
    };

    return HttpResponse.json(response);
  }),
];
