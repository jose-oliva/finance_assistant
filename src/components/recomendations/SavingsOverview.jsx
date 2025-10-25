// src/components/finance/SavingsOverview.jsx
import React from "react";

export default function SavingsOverview({
  monthlyExpenses = 20000,        // caja 1
  emergencyMonthlyDeposit = 5000, // caja 1
  shortTermGoalCost = 15000,      // caja 2
  shortTermDepositA = 2000,       // caja 2
  longTermMonthly = 2000,         // caja 3
  onSelect,                       // callback para abrir el detalle
}) {
  // cálculos mínimos para mostrar números rápidos
  const monthsToOneMonthFund = Math.ceil(
    monthlyExpenses / emergencyMonthlyDeposit
  );
  const monthsShortA = Math.ceil(shortTermGoalCost / shortTermDepositA);
  const year5 = longTermMonthly * 60;

  return (
    <section className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-md p-4 space-y-6">
      {/* HEADER */}
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 leading-tight">
          <span role="img" aria-label="plan">
            💼
          </span>
          Tu plan financiero
        </h2>
        
      </header>

      {/* CAJA 1 */}
      <button
        onClick={() => onSelect && onSelect("emergency")}
        className="w-full text-left rounded-xl border border-slate-200 bg-white/60 p-4 hover:bg-slate-50 transition"
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex flex-col">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-full px-2 py-0.5 w-fit">
              Caja 1
            </div>

            <div className="mt-2">
              <div className="text-slate-900 font-semibold text-base leading-snug">
                Fondo de emergencia
              </div>
              <div className="text-[13px] text-slate-600 leading-snug">
                Tu escudo anti-préstamo (que no tengas que endeudarte si algo
                sale mal).
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-900 font-semibold leading-tight">
              1 mes de vida ≈ $
              {monthlyExpenses.toLocaleString("es-MX")} MXN
            </div>
            <div className="text-[12px] text-slate-500 leading-tight">
              Aportando $
              {emergencyMonthlyDeposit.toLocaleString("es-MX")}/mes
              lo completas en ~{monthsToOneMonthFund} meses.
            </div>
            <div className="text-[12px] text-blue-600 font-medium mt-2">
              Ver plan →
            </div>
          </div>
        </div>
      </button>

      {/* CAJA 2 */}
      <button
        onClick={() => onSelect && onSelect("shortTerm")}
        className="w-full text-left rounded-xl border border-slate-200 bg-white/60 p-4 hover:bg-slate-50 transition"
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex flex-col">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700 bg-blue-100 border border-blue-300 rounded-full px-2 py-0.5 w-fit">
              Caja 2
            </div>

            <div className="mt-2">
              <div className="text-slate-900 font-semibold text-base leading-snug">
                Meta 3–12 meses
              </div>
              <div className="text-[13px] text-slate-600 leading-snug">
                Comprar algo grande sin deuda (laptop, curso, viaje).
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-900 font-semibold leading-tight">
              Objetivo: $
              {shortTermGoalCost.toLocaleString("es-MX")} MXN
            </div>
            <div className="text-[12px] text-slate-500 leading-tight">
              Guardando $
              {shortTermDepositA.toLocaleString("es-MX")}/mes
              lo logras en ~{monthsShortA} meses.
            </div>
            <div className="text-[12px] text-blue-600 font-medium mt-2">
              Ver plan →
            </div>
          </div>
        </div>
      </button>

      {/* CAJA 3 */}
      <button
        onClick={() => onSelect && onSelect("longTerm")}
        className="w-full text-left rounded-xl border border-slate-200 bg-white/60 p-4 hover:bg-slate-50 transition"
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex flex-col">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-purple-700 bg-purple-100 border border-purple-300 rounded-full px-2 py-0.5 w-fit">
              Caja 3
            </div>

            <div className="mt-2">
              <div className="text-slate-900 font-semibold text-base leading-snug">
                Largo plazo
              </div>
              <div className="text-[13px] text-slate-600 leading-snug">
                Yo futura no quiere estar ahogada a los 30.
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-900 font-semibold leading-tight">
              $ {longTermMonthly.toLocaleString("es-MX")}/mes
            </div>
            <div className="text-[12px] text-slate-500 leading-tight">
              En 5 años ≈ $
              {year5.toLocaleString("es-MX")} MXN
              acumulados.
            </div>
            <div className="text-[12px] text-blue-600 font-medium mt-2">
              Ver plan →
            </div>
          </div>
        </div>
      </button>

      
    </section>
  );
}
