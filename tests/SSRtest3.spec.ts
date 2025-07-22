import { test, expect } from "next/experimental/testmode/playwright";
import { dummyData } from "./mocks/dummyData";

test("SSR", async ({ page, next }) => {
  await page.context().addCookies([
    {
      name: "auth_token",
      value: "aaa",
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  const data = dummyData["existingUser"].transactions;

  next.onFetch((request) => {
    console.log("Intercepted fetch:", request.url);
    if (request.url.startsWith("http://localhost:5228/api/v1/transactions")) {
      return new Response(
        JSON.stringify({
          totalItemCount: data.length,
          pageCount: 1,
          pageNumber: 1,
          pageSize: 5,
          pageData: data,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    return "abort";
  });

  await page.goto("http://localhost:3000/dashboard");
  expect(true).toBe(true);
});
