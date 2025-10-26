import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const defaultCategories = ["Home", "Leisure", "Food"];

export default function BudgetBreakdown({
  initialTotals = { Home: 0, Food: 0, Transport: 0 },
  currency = "USD",
  onExpensesChange,
}) {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategories[0]);
  const [itemsByCategory, setItemsByCategory] = useState(() => {
    const init = {};
    defaultCategories.forEach((cat) => {
      init[cat] = [];
    });
    return init;
  });
  const [input, setInput] = useState("");

  const items = itemsByCategory[selectedCategory] || [];
  const spent = items.reduce((sum, it) => sum + it.amount, 0);
  const initialTotal = initialTotals[selectedCategory] || 0;
  const remaining = Math.max(0, initialTotal - spent);
  const spentPercentage = initialTotal > 0 ? Math.min(100, Math.round((spent / initialTotal) * 100)) : 0;

  function createExpensesSeries() {
    const today = new Date().getDate();
    const totalSpent = Object.values(itemsByCategory).reduce(
      (total, arr) => total + arr.reduce((sum, it) => sum + it.amount, 0),
      0
    );

    const dailySpend = totalSpent / today;

    const series = Array.from({ length: 30 }, (_, i) =>
      i < today ? Math.round(dailySpend * (i + 1)) : 0
    );

    return series;
  }

  useEffect(() => {
    if (onExpensesChange) {
      Object.entries(itemsByCategory).forEach(([cat, its]) => {
        const totalSpent = its.reduce((sum, it) => sum + it.amount, 0);
        onExpensesChange({ category: cat, spent: totalSpent });
      });

      const expensesSeries = createExpensesSeries();
      onExpensesChange({ expensesSeries });
    }
  }, [itemsByCategory, onExpensesChange]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency]
  );

  function addItem(e) {
    e.preventDefault();
    const trimmedInput = input.trim();
    const match = trimmedInput.match(/^(\d+)\s*(.+)$/);
    if (!match) return;

    const amt = parseInt(match[1], 10);
    const lbl = match[2].trim();

    if (!Number.isFinite(amt) || isNaN(amt)) return;
    if (amt <= 0) return;
    if (!lbl) return;
    if (amt > remaining) return;

    setItemsByCategory((prev) => ({
      ...prev,
      [selectedCategory]: [
        ...prev[selectedCategory],
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, amount: amt, label: lbl },
      ],
    }));

    setInput("");
  }

  function removeItem(id) {
    setItemsByCategory((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].filter((it) => it.id !== id),
    }));
  }

  return (
    <div className="flex w-full h-full flex-col items-center p-0">
      <div className="flex space-x-4 mb-4">
        {defaultCategories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg font-semibold ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => setSelectedCategory(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="flex justify-center p-3 gap-6 w-full max-w-4xl">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-96 bg-slate-100 rounded-2xl overflow-hidden border border-gray-400">
              <motion.div
                className="absolute bottom-0 w-full bg-red-500"
                initial={{ height: 0 }}
                animate={{ height: `${spentPercentage}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-3 text-sm font-medium text-slate-600">
                <div className="text-center">{formatter.format(initialTotal)}</div>
                <div className="text-center">{formatter.format(initialTotal * 0.75)}</div>
                <div className="text-center">{formatter.format(initialTotal * 0.5)}</div>
                <div className="text-center">{formatter.format(initialTotal * 0.25)}</div>
                <div className="text-center">$0</div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col">
            <div className="flex-1 overflow-y-auto border border-gray-400 rounded-2xl">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-slate-500 text-center py-8"
                  >
                    No expenses yet
                  </motion.div>
                ) : (
                  <motion.div className="space-y-2">
                    {items.map((it) => (
                      <motion.div
                        key={it.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div className="text-lg font-medium text-slate-800">
                            -{formatter.format(it.amount)} {it.label}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(it.id)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-slate-400 hover:text-red-500 transition"
                          title="Remove"
                          type="button"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <form onSubmit={addItem} className="flex gap-3 items-center justify-center mt-4 w-full max-w-xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej. 200 Gasolina"
            className="flex w-3/4 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-slate-400"
          />
          <button
            type="submit"
            className="rounded-xl px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
            disabled={!input.trim()}
          >
            Add
          </button>
        </form>

        <div className="mt-3 text-center text-xs text-slate-500">
          {formatter.format(remaining)} remaining out of {formatter.format(initialTotal)}
        </div>
      </div>
    </div>
  );
}
