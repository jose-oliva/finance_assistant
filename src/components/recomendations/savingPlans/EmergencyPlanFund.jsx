import React from "react";

export default function EmergencyFundPlan({
  monthlyExpenses = 20000,
  emergencyMonthlyDeposit = 5000,
  onBack,
}) {
  const oneMonthTarget = monthlyExpenses; // 1 month of basic living
  const threeMonthTarget = monthlyExpenses * 3; // 3 months buffer
  const monthsToOne = Math.ceil(oneMonthTarget / emergencyMonthlyDeposit);
  const monthsToThree = Math.ceil(threeMonthTarget / emergencyMonthlyDeposit);

  return (
    <section className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-md p-6 space-y-6">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 leading-tight flex items-center gap-2">
            <span role="img" aria-label="shield">🛡️</span>
            Emergency Fund
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

      {/* KEY TARGETS */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Minimum target */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Starter target
          </div>
          <div className="text-slate-900 font-semibold text-base">
            ${oneMonthTarget.toLocaleString("es-MX")} MXN
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            ≈ 1 month of basic life covered.
          </div>
        </div>

        {/* Pro target */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Pro target
          </div>
          <div className="text-slate-900 font-semibold text-base">
            ${threeMonthTarget.toLocaleString("es-MX")} MXN
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            ≈ 3 months without panic.
          </div>
        </div>

        {/* Monthly auto-transfer */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Monthly transfer
          </div>
          <div className="text-emerald-700 font-semibold text-base">
            ${emergencyMonthlyDeposit.toLocaleString("es-MX")} MXN / month
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            Automatic. No thinking. Just moves.
          </div>
        </div>

        {/* Time to get there */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Estimated time
          </div>
          <div className="text-slate-900 font-semibold text-base leading-tight">
            {monthsToOne} months → starter target
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            ~{monthsToThree} months → pro target
          </div>
        </div>
      </div>

      {/* GROWTH TIMELINE / VISUAL */}
      <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
        <div className="text-[11px] font-semibold text-slate-500 uppercase mb-3">
          How it stacks up
        </div>

        <div className="flex items-end justify-between text-center text-[12px] text-slate-700">
          <div className="flex-1">
            <div className="h-10 w-2 mx-auto bg-emerald-300 rounded-sm" />
            <div className="font-semibold text-slate-900 mt-1">$5,000</div>
            <div>Month 1</div>
          </div>

          <div className="flex-1">
            <div className="h-16 w-2 mx-auto bg-emerald-400 rounded-sm" />
            <div className="font-semibold text-slate-900 mt-1">$10,000</div>
            <div>Month 2</div>
          </div>

          <div className="flex-1">
            <div className="h-24 w-2 mx-auto bg-emerald-500 rounded-sm" />
            <div className="font-semibold text-slate-900 mt-1">$15,000</div>
            <div>Month 3</div>
          </div>

          <div className="flex-1">
            <div className="h-32 w-2 mx-auto bg-emerald-600 rounded-sm" />
            <div className="font-semibold text-slate-900 mt-1">
              ${oneMonthTarget.toLocaleString("es-MX")}
            </div>
            <div>Month {monthsToOne} ✅</div>
          </div>
        </div>

        <div className="text-[12px] text-slate-600 text-center mt-4 leading-snug">
          In {monthsToOne} months, you’ve built 1 full month of breathing room
          without borrowing.
        </div>
      </div>
    </section>
  );
}
