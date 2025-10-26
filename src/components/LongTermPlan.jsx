import React from "react";

export default function LongTermPlan({
  monthlyLongTerm = 2000,
  onBack,
}) {
  const year1 = monthlyLongTerm * 12;
  const year2 = monthlyLongTerm * 24;
  const year3 = monthlyLongTerm * 36;
  const year5 = monthlyLongTerm * 60;

  return (
    <section className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-md p-6 space-y-6">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 leading-tight flex items-center gap-2">
            <span role="img" aria-label="future">⏳</span>
            Long Term
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

      {/* MONTHLY CONTRIBUTION BLOCK */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Monthly auto-contribution */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Monthly contribution
          </div>
          <div className="text-purple-700 font-semibold text-base">
            ${monthlyLongTerm.toLocaleString("es-MX")} MXN / month
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            It just moves automatically.
          </div>
        </div>

        {/* Mental rule */}
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Mental rule
          </div>
          <div className="text-slate-900 font-semibold text-base leading-tight">
            You don’t touch this
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            This is future you. Not “this year” money.
          </div>
        </div>
      </div>

      {/* PROJECTION BLOCK */}
      <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
        <div className="text-[11px] font-semibold text-slate-500 uppercase mb-3">
          If you just keep doing that and don’t touch it
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-[13px] leading-snug">
          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-slate-500 text-[11px] uppercase font-medium">
              1 year
            </div>
            <div className="text-slate-900 font-semibold text-base mt-1">
              ${year1.toLocaleString("es-MX")}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-slate-500 text-[11px] uppercase font-medium">
              2 years
            </div>
            <div className="text-slate-900 font-semibold text-base mt-1">
              ${year2.toLocaleString("es-MX")}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-slate-500 text-[11px] uppercase font-medium">
              3 years
            </div>
            <div className="text-slate-900 font-semibold text-base mt-1">
              ${year3.toLocaleString("es-MX")}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-slate-500 text-[11px] uppercase font-medium">
              5 years
            </div>
            <div className="text-slate-900 font-semibold text-base mt-1">
              ${year5.toLocaleString("es-MX")} 🟣
            </div>
          </div>
        </div>

        <div className="text-[12px] text-slate-600 text-center mt-4 leading-snug">
          This is without any growth/returns. This is just discipline.
        </div>
      </div>
    </section>
  );
}
