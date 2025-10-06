export const categoryColors = {
  Food: "hsl(var(--chart-1))",
  Travel: "hsl(var(--chart-2))",
  Shopping: "hsl(var(--chart-3))",
  Bills: "hsl(var(--chart-4))",
  Others: "hsl(var(--chart-5))",
} as const;

export type ExpenseCategory = keyof typeof categoryColors;
