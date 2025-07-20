export const dummyData = {
  existingUser: {
    transactions: [
      {
        id: 1,
        description: "Zakupy spożywcze",
        amount: 15000,
        type: "Expense",
        date: "2025-07-01",
        category: "Food",
      },
    ],
    monthlyChart: {
      month: 7,
      year: 2025,
      data: [
        /* some chart data */
      ],
    },
    yearlyChart: {
      year: 2025,
      data: [
        /* some yearly chart data */
      ],
    },
  },
  newUser: {
    transactions: [],
    monthlyChart: {
      month: 7,
      year: 2025,
      data: [],
    },
    yearlyChart: {
      year: 2025,
      data: [],
    },
  },
};
