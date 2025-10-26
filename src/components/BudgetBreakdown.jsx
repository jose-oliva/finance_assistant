import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * BudgetBreakdown
 * A vertical chart that fills up as expenses are added, with simple input at bottom right.
 */
export default function BudgetBreakdown({
  category = "Home",
  initialTotal = 3400,
  currency = "USD",
  onNextCategory,
  onComplete,
  onExpensesChange,
}) {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // Notify parent of expense changes
  useEffect(() => {
    if (onExpensesChange) {
      const spent = items.reduce((sum, it) => sum + it.amount, 0);
      onExpensesChange({ category, spent });
    }
  }, [items, category, onExpensesChange]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency]
  );

  const spent = items.reduce((sum, it) => sum + it.amount, 0);
  const remaining = Math.max(0, initialTotal - spent);
  const spentPercentage = initialTotal > 0 ? Math.min(100, Math.round((spent / initialTotal) * 100)) : 0;
  
  const isComplete = remaining === 0;
  const isLastCategory = category === "Food";

  function addItem(e) {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    // Parse input like "100 towels" or "100towels"
    const match = trimmedInput.match(/^(\d+)\s*(.+)$/);
    if (!match) return;
    
    const amt = parseInt(match[1], 10);
    const lbl = match[2].trim();

    if (!Number.isFinite(amt) || isNaN(amt)) return;
    if (amt <= 0) return;
    if (!lbl) return;
    if (amt > remaining) return;

    setItems((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, amount: amt, label: lbl },
    ]);

    setInput("");
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-4xl flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200">
        {/* Category Header */}
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-slate-800 text-center">{category}</h2>
          <p className="text-sm text-slate-500 text-center mt-1">Budget: {formatter.format(initialTotal)}</p>
        </div>
      {/* Main Content - Chart Left, List Right */}
      <div className="flex justify-center p-6 gap-6">
        {/* Left Side - Chart */}
        <div className="flex flex-col items-center gap-6">
          {/* Chart Container */}
          <div className="relative w-20 h-96 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
            {/* Spent Amount Fill */}
            <motion.div
              className="absolute bottom-0 w-full bg-red-500"
              initial={{ height: 0 }}
              animate={{ height: `${spentPercentage}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
            {/* Chart Labels */}
            <div className="absolute inset-0 flex flex-col justify-between p-3 text-sm font-medium text-slate-600">
              <div className="text-center">{formatter.format(initialTotal)}</div>
              <div className="text-center">{formatter.format(initialTotal * 0.75)}</div>
              <div className="text-center">{formatter.format(initialTotal * 0.5)}</div>
              <div className="text-center">{formatter.format(initialTotal * 0.25)}</div>
              <div className="text-center">$0</div>
            </div>
          </div>
          
          {/* Chart Info */}
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-800">
              {formatter.format(spent)} spent
            </div>
            <div className="text-sm text-slate-500">
              {spentPercentage}% of budget
            </div>
          </div>
        </div>

        {/* Right Side - Expense List */}
        <div className="w-80 flex flex-col">
          <div className="text-sm uppercase tracking-wide text-slate-500 mb-4">Expenses</div>
          <div className="flex-1 overflow-y-auto">
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

      {/* Input Form - Bottom */}
      <div className="p-6 pt-0">
        <form onSubmit={addItem} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <button
            type="submit"
            className="rounded-xl px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
            disabled={!input.trim()}
          >
            Add
          </button>
        </form>
        
        {/* Budget Info */}
        <div className="mt-3 text-center text-xs text-slate-500">
          {formatter.format(remaining)} remaining out of {formatter.format(initialTotal)}
        </div>
        
        {/* Continue Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              if (isLastCategory) {
                onComplete?.();
              } else {
                onNextCategory?.();
              }
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            {isLastCategory ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
