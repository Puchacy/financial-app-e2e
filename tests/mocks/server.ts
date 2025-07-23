import {
  getMonthlyTransactionsResponse,
  getTransactionsHistoryResponse,
  getYearlyTransactionsResponse,
} from "./utils/transactions";
import { getUserFromRequest } from "./utils/users";

type RequestInterceptorAPI = {
  onFetch: (
    handler: (request: Request) => Response | Promise<Response> | "abort"
  ) => void;
};

export const mockServerTransactions = (next: RequestInterceptorAPI) => {
  next.onFetch((request) => {
    const user = getUserFromRequest(request);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { pathname } = new URL(request.url);

    if (pathname === "/api/v1/transactions") {
      const response = getTransactionsHistoryResponse(user);

      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname === "/api/v1/transactions/chart/monthly") {
      const response = getMonthlyTransactionsResponse(user);

      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname === "/api/v1/transactions/chart/yearly") {
      const response = getYearlyTransactionsResponse(user);

      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return "abort";
  });
};
