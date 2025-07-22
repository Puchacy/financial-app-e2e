import { http, HttpResponse } from "msw";
import { dummyData } from "./dummyData";
import { getUserFromRequest } from "./utils/getUserFromRequest";
import { UserToken } from "../constants/tokens";
import {
  LoginUserRequestDto,
  LoginUserResponseDto,
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from "../../api";

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
    const userKey = getUserFromRequest(request);

    if (!userKey)
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = dummyData[userKey].transactions;

    return HttpResponse.json({
      totalItemCount: data.length,
      pageCount: 1,
      pageNumber: 1,
      pageSize: 5,
      pageData: data,
    });
  }),

  // GET /api/v1/transactions/chart/monthly
  http.get(
    "http://localhost:5228/api/v1/transactions/chart/monthly",
    ({ request }) => {
      const userKey = getUserFromRequest(request);

      if (!userKey)
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

      const data = dummyData[userKey].monthlyChart;
      return HttpResponse.json(data);
    }
  ),

  // GET /api/v1/transactions/chart/yearly
  http.get(
    "http://localhost:5228/api/v1/transactions/chart/yearly",
    ({ request }) => {
      const userKey = getUserFromRequest(request);

      if (!userKey)
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

      const data = dummyData[userKey].yearlyChart;
      return HttpResponse.json(data);
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
