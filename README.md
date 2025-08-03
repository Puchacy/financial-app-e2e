# Financial App E2E

End-to-end tests for the financial app, ensuring the reliability and correctness of user flows from start to finish. This project uses Playwright for browser automation and TypeScript for writing robust and maintainable test scripts.

## Installation

To get started with the project, clone the repository and install the dependencies.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Puchacy/financial-app-e2e.git
    cd financial-app-e2e
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    ```bash
    npx playwright install
    ```

## Usage

The primary way to interact with this project is through the npm scripts defined in `package.json`.

### Available Scripts

- **`test`**: Runs all end-to-end tests in headless mode.

  ```bash
  npm run test
  ```

- **`test:report`**: Opens the Playwright test report to view the results of the last test run.

  ```bash
  npm run test:report
  ```

- **`test:ui`**: Runs the tests in UI mode, which provides a more interactive debugging experience.

  ```bash
  npm run test:ui
  ```

- **`tsc`**: Compiles the TypeScript files to check for type errors.

  ```bash
  npm run tsc
  ```

- **`generate:api`**: Generates the API client from the OpenAPI specification.
  ```bash
  npm run generate:api
  ```

## Technology Stack

- **Testing Framework**: [Playwright](https://playwright.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Test Runner**: [ts-node](https://typestrong.org/ts-node/)
- **Date/Time Library**: [dayjs](https://day.js.org/)
- **Web Framework (for testing context)**: [Next.js](https://nextjs.org/)
- **API Client Generation**: [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)
- **Mocking**: [playwright-msw](https://github.com/valendres/playwright-msw)

## Repository

The source code is available on GitHub:
[https://github.com/Puchacy/financial-app-e2e](https://github.com/Puchacy/financial-app-e2e)

## Bug Reports

Please report any bugs or issues at the following URL:
[https://github.com/Puchacy/financial-app-e2e/issues](https://github.com/Puchacy/financial-app-e2e/issues)
