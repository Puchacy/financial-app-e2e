import { Cookie } from "./../../node_modules/@types/tough-cookie/index.d";
import { http, HttpResponse } from "msw";
import { dummyData } from "./dummyData";
import { getUserFromRequest } from "./utils/getUserFromRequest";

export const handlers = [
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
];
