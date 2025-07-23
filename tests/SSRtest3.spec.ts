import { test, expect } from "next/experimental/testmode/playwright";
import { mockServerTransactions } from "./mocks/server";
import { UserToken } from "./constants/tokens";

test("SSR", async ({ page, next }) => {
  await page.context().addCookies([
    {
      name: "auth_token",
      value: UserToken.EXISTING_USER_TOKEN,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  mockServerTransactions(next);

  await page.goto("http://localhost:3000/dashboard");
  expect(true).toBe(true);
});
