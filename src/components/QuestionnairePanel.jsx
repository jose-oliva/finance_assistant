import { useState, useRef } from "react";
import { useBudgetStore } from "./BudgetStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Questionnaire() {
  const [step, setStep] = useState(1);
  const [editingBudget, setEditingBudget] = useState(true); // <- empieza con input visible
  const budgetInputRef = useRef(null);

  const cats      = useBudgetStore((s) => s.categories);
  const budget    = useBudgetStore((s) => s.budget);
  const setBudget = useBudgetStore((s) => s.setBudget);

  const alloc     = useBudgetStore((s) => s.allocation);
  const setAlloc  = useBudgetStore((s) => s.setAlloc);
  const sumAlloc  = useBudgetStore((s) => s.sumAlloc());

  const remaining = Math.max(0, Number(budget || 0) - sumAlloc);

  const COLORS = ["#4F46E5", "#22C55E", "#06B6D4"];
  const pie = cats.map((c, i) => ({
    name: c,
    value: Number(alloc[c] || 0),
    color: COLORS[i % COLORS.length],
  }));

  // --- helpers ---
  const parseDigits = (v) => {
    const n = Number(String(v).replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const confirmBudget = () => {
    const n = parseDigits(budgetInputRef.current?.value ?? budget);
    setBudget(n);
    setEditingBudget(false);              // <-- oculta el input
  };

  const onBudgetKeyDown = (e) => {
    if (e.key === "Enter") confirmBudget();
    if (e.key === "Escape") {
      setEditingBudget(false);
      if (budgetInputRef.current) budgetInputRef.current.value = budget;
    }
  };

  // Clear ALL allocations when advancing to step 2
  const handleNextFromBudget = () => {
    cats.forEach((c) => setAlloc(c, "")); // "" -> 0 in the setter
    setStep(2);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl p-8 bg-white/60 backdrop-blur border border-blue-300 shadow">
      {step === 1 && (
        <>
          <h2 className="text-3xl font-bold text-center mb-6">Total budget</h2>

          <div className="flex flex-col items-center gap-4">
            {/* Budget: input ↔ label + Edit */}
            {editingBudget ? (
              <input
                ref={budgetInputRef}
                defaultValue={budget ? String(budget) : ""}
                className="w-72 h-14 rounded-xl border border-slate-300 px-4 text-2xl text-center outline-none focus:ring-4 focus:ring-blue-200
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="text"
                inputMode="numeric"
                placeholder="Enter amount"
                onBlur={confirmBudget}
                onKeyDown={onBudgetKeyDown}
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-emerald-700">
                  ${Number(budget || 0).toLocaleString()} ✓
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBudget(true);
                    setTimeout(() => budgetInputRef.current?.focus(), 0);
                  }}
                  className="px-3 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
              </div>
            )}

            <button
              onClick={handleNextFromBudget}
              disabled={!Number(budget)}
              className="mt-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-3xl font-bold text-center mb-8">Allocation by category</h2>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              {cats.map((c) => (
                <div key={c} className="flex items-center gap-4 mb-3">
                  <span className="w-28 text-lg">{c}</span>
                  <input
                    className="w-64 h-12 rounded-xl border border-slate-300 px-4 text-lg outline-none focus:ring-4 focus:ring-blue-200
                               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={alloc[c] ? String(alloc[c]) : ""}
                    onChange={(e) => setAlloc(c, parseDigits(e.target.value))}
                  />
                </div>
              ))}

              <div className="mt-6 text-lg">
                <b>Assigned:</b> ${sumAlloc.toLocaleString()} / <b>Total:</b>{" "}
                ${Number(budget || 0).toLocaleString()}{" "}
                {remaining > 0 && (
                  <span className="text-sky-600 ml-2">Remaining ${remaining.toLocaleString()}</span>
                )}
                {sumAlloc === Number(budget || 0) && Number(budget || 0) > 0 && (
                  <span className="text-green-600 ml-2">✓ Balanced</span>
                )}
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-6 px-5 py-2.5 rounded-xl border text-slate-700 bg-white hover:bg-slate-50"
              >
                Back
              </button>
            </div>

            <div className="h-[340px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={80}
                    outerRadius={120}
                    isAnimationActive
                  >
                    {pie.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-sm opacity-70 mt-2">
                The chart animates as you change the inputs.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
