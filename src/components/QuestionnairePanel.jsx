import { useState } from "react";
import { useBudgetStore } from "./BudgetStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Questionnaire() {
  const [step, setStep] = useState(1);

  const cats      = useBudgetStore((s) => s.categories);
  const budget    = useBudgetStore((s) => s.budget);
  const setBudget = useBudgetStore((s) => s.setBudget);

  const alloc     = useBudgetStore((s) => s.allocation);
  const setAlloc  = useBudgetStore((s) => s.setAlloc);
  const sumAlloc  = useBudgetStore((s) => s.sumAlloc());

  const faltante  = Math.max(0, Number(budget || 0) - sumAlloc);

  const COLORS = ["#4F46E5", "#22C55E", "#06B6D4"];
  const pie = cats.map((c, i) => ({
    name: c,
    value: Number(alloc[c] || 0),
    color: COLORS[i % COLORS.length],
  }));

  // Limpia TODAS las asignaciones al pasar al paso 2
  const handleNextFromBudget = () => {
    cats.forEach((c) => setAlloc(c, "")); // "" -> 0 en el setter
    setStep(2);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl p-8 bg-white/60 backdrop-blur border border-blue-300 shadow">
      {step === 1 && (
        <>
          <h2 className="text-3xl font-bold text-center mb-6">Presupuesto total</h2>
          <div className="flex flex-col items-center gap-4">
            <input
              className="w-72 h-14 rounded-xl border border-slate-300 px-4 text-2xl text-center outline-none focus:ring-4 focus:ring-blue-200
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              type="text"
              inputMode="numeric"
              placeholder="Ingresa monto"
              value={budget ? String(budget) : ""}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/[^\d]/g, "");
                setBudget(onlyDigits);
              }}
            />

            <span className={`text-2xl font-semibold ${budget ? "text-green-600" : "text-slate-400"}`}>
              {budget ? `$${Number(budget).toLocaleString()} ✓` : "$0"}
            </span>

            <button
              onClick={handleNextFromBudget}
              disabled={!budget}
              className="mt-4 px-6 py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-3xl font-bold text-center mb-8">Asignación por categoría</h2>
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
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/[^\d]/g, "");
                      setAlloc(c, onlyDigits);
                    }}
                  />
                </div>
              ))}

              <div className="mt-6 text-lg">
                <b>Asignado:</b> ${sumAlloc.toLocaleString()} / <b>Total:</b>{" "}
                ${Number(budget || 0).toLocaleString()}{" "}
                {faltante > 0 && (
                  <span className="text-sky-600 ml-2">Faltan ${faltante.toLocaleString()}</span>
                )}
                {sumAlloc === Number(budget || 0) && Number(budget || 0) > 0 && (
                  <span className="text-green-600 ml-2">✓ Balanceado</span>
                )}
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-6 px-5 py-2.5 rounded-xl border text-slate-700 bg-white hover:bg-slate-50"
              >
                Atrás
              </button>
            </div>

            <div className="h-[340px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius={80} outerRadius={120}>
                    {pie.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-sm opacity-70 mt-2">
                La gráfica se anima conforme cambias los inputs.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
