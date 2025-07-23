import { http, HttpResponse } from "next/experimental/testmode/playwright/msw";
import { getUserFromRequest } from "./utils/getUserFromRequest";
import {
  getMonthlyTransactionsResponse,
  getTransactionsHistoryResponse,
  getYearlyTransactionsResponse,
} from "./utils/transactions";
import {
  LoginUserRequestDto,
  LoginUserResponseDto,
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from "../../api";
import { UserToken } from "../constants/tokens";

export const handlers = [
  // GET /api/v1/users/me
  http.get("http://localhost:5228/api/v1/users/me", () => {
    return HttpResponse.json({
      id: 1,
      name: "Jan",
      surname: "Kowalski",
      email: "jan.kowalski@example.com",
    });
  }),

  // GET /api/v1/transactions
  http.get("http://localhost:5228/api/v1/transactions", ({ request }) => {
    const user = getUserFromRequest(request);

    if (!user)
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = getTransactionsHistoryResponse(user);

    return HttpResponse.json(response);
  }),

  // GET /api/v1/transactions/chart/monthly
  http.get(
    "http://localhost:5228/api/v1/transactions/chart/monthly",
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
    "http://localhost:5228/api/v1/transactions/chart/yearly",
    ({ request }) => {
      const user = getUserFromRequest(request);

      if (!user)
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

      const response = getYearlyTransactionsResponse(user);

      return HttpResponse.json(response);
    }
  ),

  // POST /api/v1/users/login
  http.post("http://localhost:5228/api/v1/users/login", async ({ request }) => {
    const body = (await request.json()) as LoginUserRequestDto;

    if (
      body.email === "existing@example.com" &&
      body.password === "password123"
    ) {
      const response: LoginUserResponseDto = {
        token: UserToken.EXISTING_USER_TOKEN,
        user: {
          id: 1,
          name: "Jan",
          surname: "Kowalski",
          email: "existing@example.com",
        },
      };

      return HttpResponse.json(response);
    }

    return HttpResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }),

  // POST /api/v1/users/register
  http.post(
    "http://localhost:5228/api/v1/users/register",
    async ({ request }) => {
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
    }
  ),
];
