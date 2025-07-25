type Features = {
  title: string;
  text: string;
  dataTestId: string;
};

export const features: Features[] = [
  {
    title: "Zarządzaj finansami",
    text: "Rejestruj przychody i wydatki z podziałem na kategorie. Ustal daty, kwoty i opisy, by mieć pełną kontrolę nad swoim budżetem. Korzystaj z prostych formularzy, które automatycznie uzupełniają dane na podstawie tekstu lub zdjęcia paragonu.",
    dataTestId: "home-page-attachMoney-icon",
  },
  {
    title: "Przeglądaj historię",
    text: "Przeglądaj wszystkie dotychczasowe transakcje w jednym miejscu. Analizuj swoje wydatki i przychody w czasie – wszystko z zachowaniem przejrzystości i łatwego dostępu do szczegółów.",
    dataTestId: "home-page-history-icon",
  },
  {
    title: "Analizuj dane",
    text: "Otrzymuj czytelne wykresy słupkowe i kołowe przedstawiające strukturę Twoich finansów. Sprawdzaj, gdzie trafiają Twoje pieniądze i podejmuj lepsze decyzje finansowe na podstawie danych.",
    dataTestId: "home-page-barChart-icon",
  },
];
