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
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 leading-tight flex items-center gap-2">
            <span role="img" aria-label="target">🎯</span>
            3–12 Month Goal
          </h2>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            ← Back
          </button>
        )}
      </header>

      {/* GOAL + RULE BLOCK */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Goal cost */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Goal
          </div>
          <div className="text-slate-900 font-semibold text-xl leading-tight">
            ${shortTermGoalCost.toLocaleString("es-MX")} MXN
          </div>
          <div className="text-[12px] text-slate-600 leading-snug mt-1">
            Laptop / course / trip
          </div>
        </div>

        {/* Core rule */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Rule
          </div>
          <div className="text-slate-900 font-semibold text-base leading-tight">
            No credit.
          </div>
          <div className="text-[12px] text-slate-600 leading-snug mt-1">
            You buy it in cash. No monthly payments after.
          </div>
        </div>
      </div>

      {/* PLANS COMPARISON BLOCK */}
      <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
        <div className="text-[11px] font-semibold text-slate-500 uppercase mb-3">
          Pick your saving style
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Chill plan */}
          <div className="rounded-lg border border-slate-200 bg-white/70 p-4 flex flex-col">
            <div className="text-[11px] font-medium uppercase text-slate-500 mb-1">
              Chill pace
            </div>

            <div className="text-slate-900 font-semibold text-lg leading-tight">
              ${depositSlow.toLocaleString("es-MX")}/month
            </div>

            <div className="text-[12px] text-slate-600 leading-snug mb-3">
              Ready in ~{monthsSlow} months
            </div>

            {/* mini timeline visual */}
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Month 1</span>
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
                <span>Month {monthsSlow}</span>
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
              Lower monthly stress • takes longer • still 0 debt.
            </div>
          </div>

          {/* Fast plan */}
          <div className="rounded-lg border border-slate-200 bg-white/70 p-4 flex flex-col">
            <div className="text-[11px] font-medium uppercase text-slate-500 mb-1">
              Fast track
            </div>

            <div className="text-slate-900 font-semibold text-lg leading-tight">
              ${depositFast.toLocaleString("es-MX")}/month
            </div>

            <div className="text-[12px] text-slate-600 leading-snug mb-3">
              Ready in ~{monthsFast} months
            </div>

            {/* mini timeline visual */}
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Month 1</span>
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
                <span>Month {monthsFast}</span>
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
              You get it sooner • higher monthly push • still no debt.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
