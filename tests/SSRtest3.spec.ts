import { test, expect } from "next/experimental/testmode/playwright/msw";
import { UserToken } from "./constants/user";
import { handlers } from "./mocks/client";

test.use({
  mswHandlers: [handlers, { scope: "test" }],
});

test("SSR", async ({ page }) => {
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

  await page.goto("http://localhost:3000/dashboard");

  await expect(page.getByTestId("bar-chart-bar").first()).toBeVisible();
});
