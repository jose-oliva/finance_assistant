import React from "react";

export default function ShortTermGoalsPlan({
  shortTermGoalCost = 15000,
  depositSlow = 2000,
  depositFast = 3000,
  onBack,
}) {
  const monthsSlow = Math.ceil(shortTermGoalCost / depositSlow);
  const monthsFast = Math.ceil(shortTermGoalCost / depositFast);


  const slowPct = Math.min((depositSlow / shortTermGoalCost) * 100, 100);
  const fastPct = Math.min((depositFast / shortTermGoalCost) * 100, 100);

  return (
    <section className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-md p-6 space-y-6">
      {/* HEADER */}
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700 bg-blue-100 border border-blue-300 rounded-full px-2 py-0.5 w-fit">
            Caja 2
          </div>

          <h2 className="text-lg font-semibold text-slate-900 leading-tight flex items-center gap-2">
            <span role="img" aria-label="target">🎯</span>
            Meta 3–12 meses
          </h2>

        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            ← Regresar
          </button>
        )}
      </header>

      {/* BLOQUE: OBJETIVO Y REGLA */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Costo objetivo */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Objetivo
          </div>
          <div className="text-slate-900 font-semibold text-xl leading-tight">
            ${shortTermGoalCost.toLocaleString("es-MX")} MXN
          </div>
          <div className="text-[12px] text-slate-600 leading-snug mt-1">
            Laptop / curso / viaje
          </div>
        </div>

        {/* Regla clave */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Regla
          </div>
          <div className="text-slate-900 font-semibold text-base leading-tight">
            Cero crédito.
          </div>
          <div className="text-[12px] text-slate-600 leading-snug mt-1">
            Lo compras en efectivo. Sin pagos mensuales después.
          </div>
        </div>
      </div>

      {/* BLOQUE: COMPARA PLANES */}
      <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
        <div className="text-[11px] font-semibold text-slate-500 uppercase mb-3">
          Elige tu modo de ahorro
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Plan relajado */}
          <div className="rounded-lg border border-slate-200 bg-white/70 p-4 flex flex-col">
            <div className="text-[11px] font-medium uppercase text-slate-500 mb-1">
              Ahorro relajado
            </div>

            <div className="text-slate-900 font-semibold text-lg leading-tight">
              ${depositSlow.toLocaleString("es-MX")}/mes
            </div>

            <div className="text-[12px] text-slate-600 leading-snug mb-3">
              Listo en ~{monthsSlow} meses
            </div>

            {/* mini timeline visual */}
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Mes 1</span>
                <span className="font-semibold text-slate-900">
                  ${depositSlow.toLocaleString("es-MX")}
                </span>
              </div>
              <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${slowPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span>Mes {monthsSlow}</span>
                <span className="font-semibold text-slate-900">
                  ${shortTermGoalCost.toLocaleString("es-MX")} ✅
                </span>
              </div>
              <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="mt-4 text-[12px] text-slate-500 leading-snug">
              Pagas poco al mes • llegas más lento • sin intereses.
            </div>
          </div>

          {/* Plan agresivo */}
          <div className="rounded-lg border border-slate-200 bg-white/70 p-4 flex flex-col">
            <div className="text-[11px] font-medium uppercase text-slate-500 mb-1">
              Ahorro rápido
            </div>

            <div className="text-slate-900 font-semibold text-lg leading-tight">
              ${depositFast.toLocaleString("es-MX")}/mes
            </div>

            <div className="text-[12px] text-slate-600 leading-snug mb-3">
              Listo en ~{monthsFast} meses
            </div>

            {/* mini timeline visual */}
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Mes 1</span>
                <span className="font-semibold text-slate-900">
                  ${depositFast.toLocaleString("es-MX")}
                </span>
              </div>
              <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${fastPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span>Mes {monthsFast}</span>
                <span className="font-semibold text-slate-900">
                  ${shortTermGoalCost.toLocaleString("es-MX")} ✅
                </span>
              </div>
              <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="mt-4 text-[12px] text-slate-500 leading-snug">
              Llegas mucho antes • compromiso mensual más alto • igual 0 deuda.
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
}
