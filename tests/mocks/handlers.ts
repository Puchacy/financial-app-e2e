import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost:5228/api/v1/users/me", () => {
    return HttpResponse.json({
      id: 1,
      name: "Jan",
      surname: "Kowalski",
      email: "jan.kowalski@example.com",
    });
  }),
];
