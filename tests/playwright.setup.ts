import { expect } from "@playwright/test";
import { test as base } from "@playwright/test";
import { createWorkerFixture } from "playwright-msw";
import { handlers } from "./mocks/handlers";

type WorkerFixtures = {
  worker: ReturnType<typeof createWorkerFixture> extends (
    arg: infer T
  ) => infer R
    ? R
    : unknown;
};

const workerFixture = createWorkerFixture(handlers);

const test = base.extend<WorkerFixtures>({
  worker: workerFixture,
});

export { test, expect };
