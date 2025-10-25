// usando zustand v4+
import create from "zustand";

const CATS = ["Hogar", "Oseo", "Comida"];

export const useBudgetStore = create((set, get) => ({
  budget: 0,
  categories: ["Hogar", "Ocio", "Comida"],
  allocation: { Hogar: 0, Ocio: 0, Comida: 0 },

  demoDay: 10,

  expenses: [],

  setBudget: (n) => set({ budget: Math.max(0, Number(n) || 0) }),
  setAlloc: (cat, n) => set((s) => ({
    allocation: { ...s.allocation, [cat]: Math.max(0, Number(n) || 0) },
  })),
  clearAllocations: () =>
    set({ allocation: Object.fromEntries(["Hogar","Ocio","Comida"].map(c => [c, 0])) }),

  addExpense: (payload) => {
    const id = crypto.randomUUID();
    const now = new Date();
    const dday = get().demoDay;
    const date = payload?.date
      ? new Date(payload.date)
      : (dday != null ? new Date(now.getFullYear(), now.getMonth(), dday) : new Date());
    const amt = Math.max(0, Number(payload.amount) || 0);
    const category = ["Hogar","Ocio","Comida"].includes(payload.category) ? payload.category : "Otros";
    set((s) => ({ expenses: [...s.expenses, { id, category, amount: amt, date }] }));
  },

  clearExpenses: () => set({ expenses: [] }),

  sumAlloc() {
    return Object.values(get().allocation).reduce((a, b) => a + Number(b || 0), 0);
  },

  spentUntil(date) {
    const t = new Date(date).getTime();
    return get().expenses.reduce((acc, e) => (e.date.getTime() <= t ? acc + e.amount : acc), 0);
  },

  realByDay() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // normalizamos fechas al mes actual; si llegan de otro mes se ignoran
    const exps = get().expenses.filter(
      (e) => e.date.getFullYear() === year && e.date.getMonth() === month
    );

    // acumulado día a día
    const sums = Array.from({ length: daysInMonth }, () => 0);
    for (const e of exps) {
      const d = e.date.getDate();       // 1..N
      for (let i = d - 1; i < daysInMonth; i++) sums[i] += e.amount;
    }
    return sums;
  },
}));

if (typeof window !== "undefined") {
  window.useBudgetStore = useBudgetStore;
}