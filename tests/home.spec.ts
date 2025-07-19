import { test, expect } from "@playwright/test";

test("home page displays the title, description, and references", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  // Check the title
  await expect(
    page.getByRole("heading", { name: "Aplikacja MojeFinanse", level: 1 })
  ).toBeVisible();

  // Check the subtitle
  await expect(
    page.getByRole("heading", {
      name: "Zadbaj o swoje finanse w prosty i nowoczesny sposób – rejestruj transakcje, analizuj dane i korzystaj z automatycznych ułatwień opartych o AI.",
      level: 2,
    })
  ).toBeVisible();

  // Feature tiles
  await expect(page.getByTestId("AttachMoneyIcon")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Zarządzaj finansami",
      level: 3,
    })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Rejestruj przychody i wydatki z podziałem na kategorie. Ustal daty, kwoty i opisy, by mieć pełną kontrolę nad swoim budżetem. Korzystaj z prostych formularzy, które automatycznie uzupełniają dane na podstawie tekstu lub zdjęcia paragonu."
    )
  ).toBeVisible();

  await expect(page.getByTestId("HistoryIcon")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Przeglądaj historię",
      level: 3,
    })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Przeglądaj wszystkie dotychczasowe transakcje w jednym miejscu. Analizuj swoje wydatki i przychody w czasie – wszystko z zachowaniem przejrzystości i łatwego dostępu do szczegółów."
    )
  ).toBeVisible();

  await expect(page.getByTestId("BarChartIcon")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Analizuj dane",
      level: 3,
    })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Otrzymuj czytelne wykresy słupkowe i kołowe przedstawiające strukturę Twoich finansów. Sprawdzaj, gdzie trafiają Twoje pieniądze i podejmuj lepsze decyzje finansowe na podstawie danych."
    )
  ).toBeVisible();

  // Check the testimonials section
  await expect(
    page.getByRole("heading", { name: "Co mówią nasi użytkownicy", level: 4 })
  ).toBeVisible();

  // References from Krzysztof
  await expect(
    page
      .locator('[data-testid="KrzysztofAvatar"]')
      .filter({ has: page.locator(":visible") })
      .first()
  ).toBeVisible();

  await expect(
    page
      .locator("p", {
        hasText:
          /Świetna aplikacja! Dzięki niej mam pełną kontrolę nad swoimi finansami/,
      })
      .first()
  ).toBeVisible();

  await expect(
    page
      .locator("p", {
        hasText: /— Krzysztof/,
      })
      .first()
  ).toBeVisible();

  // References from Jan
  await expect(
    page
      .locator('[data-testid="JanAvatar"]')
      .filter({ has: page.locator(":visible") })
      .first()
  ).toBeVisible();

  await expect(
    page
      .locator("p", {
        hasText:
          /Dodawanie paragonów przez zdjęcia to genialna funkcja. Oszczędza mi mnóstwo czasu./,
      })
      .first()
  ).toBeVisible();

  await expect(
    page
      .locator("p", {
        hasText: /— Jan/,
      })
      .first()
  ).toBeVisible();

  // References from Karolina
  await expect(
    page
      .locator('[data-testid="KarolinaAvatar"]')
      .filter({ has: page.locator(":visible") })
      .first()
  ).toBeVisible();

  await expect(
    page
      .locator("p", {
        hasText:
          /Przejrzyste wykresy i łatwy dostęp do historii wydatków. Polecam każdemu!/,
      })
      .first()
  ).toBeVisible();

  await expect(
    page
      .locator("p", {
        hasText: /— Karolina/,
      })
      .first()
  ).toBeVisible();
});
