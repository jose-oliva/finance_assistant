import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * BudgetBreakdown
 * A vertical chart that fills up as expenses are added, with simple input at bottom right.
 */
export default function BudgetBreakdown({
  initialTotal = 10000,
  currency = "USD",
}) {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

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
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, amount: amt, label: lbl },
      ...prev,
    ]);

    setInput("");
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-4xl flex flex-col bg-white/80 backdrop-blur rounded-2xl shadow border border-slate-200">
      {/* Main Content - Chart Left, List Right */}
      <div className="flex justify-center p-6 gap-6">
        {/* Left Side - Chart */}
        <div className="flex flex-col items-center gap-6">
          {/* Chart Container */}
          <div className="relative w-20 h-96 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200">
            {/* Spent Amount Fill */}
            <motion.div
              className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-red-400"
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
              {formatter.format(spent)} gastado
            </div>
            <div className="text-sm text-slate-500">
              {spentPercentage}% del presupuesto
            </div>
          </div>
        </div>

        {/* Right Side - Expense List */}
        <div className="w-80 flex flex-col">
          <div className="text-sm uppercase tracking-wide text-slate-500 mb-4">Gastos</div>
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
                  Aún no hay gastos
                </motion.div>
              ) : (
                <motion.div className="space-y-2">
                  {items.map((it) => (
                    <motion.div
                      key={it.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="text-base font-medium text-slate-800">
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
      <div className="p-8 pt-0">
        <form onSubmit={addItem} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <button
            type="submit"
            className="rounded-xl px-6 py-3 bg-slate-900 text-white text-base font-medium hover:opacity-90 transition disabled:opacity-40"
            disabled={!input.trim()}
          >
            Agregar
          </button>
        </form>
        
        {/* Budget Info */}
        <div className="mt-4 text-center text-sm text-slate-500">
          {formatter.format(remaining)} restante de {formatter.format(initialTotal)}
        </div>
      </div>
      </div>
    </div>
  );
}
