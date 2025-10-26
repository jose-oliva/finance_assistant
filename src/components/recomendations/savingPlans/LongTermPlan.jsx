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
            Largo Plazo
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

      {/* BLOQUE: APORTE MENSUAL */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Aportación mensual
          </div>
          <div className="text-purple-700 font-semibold text-base">
            ${monthlyLongTerm.toLocaleString("es-MX")} MXN / mes
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            Se va solo, automático.
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Regla mental
          </div>
          <div className="text-slate-900 font-semibold text-base leading-tight">
            No se toca
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            Esto es futuro, no gastos de este año.
          </div>
        </div>
      </div>

      {/* BLOQUE: PROYECCIÓN RÁPIDA */}
      <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
        <div className="text-[11px] font-semibold text-slate-500 uppercase mb-3">
          Si sólo haces eso y no lo tocas
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-[13px] leading-snug">
          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-slate-500 text-[11px] uppercase font-medium">
              1 año
            </div>
            <div className="text-slate-900 font-semibold text-base mt-1">
              ${year1.toLocaleString("es-MX")}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-slate-500 text-[11px] uppercase font-medium">
              2 años
            </div>
            <div className="text-slate-900 font-semibold text-base mt-1">
              ${year2.toLocaleString("es-MX")}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-slate-500 text-[11px] uppercase font-medium">
              3 años
            </div>
            <div className="text-slate-900 font-semibold text-base mt-1">
              ${year3.toLocaleString("es-MX")}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-slate-500 text-[11px] uppercase font-medium">
              5 años
            </div>
            <div className="text-slate-900 font-semibold text-base mt-1">
              ${year5.toLocaleString("es-MX")} 🟣
            </div>
          </div>
        </div>

        <div className="text-[12px] text-slate-600 text-center mt-4 leading-snug">
          Esto es SIN contar rendimiento. Es sólo constancia.
        </div>
      </div>

    
    </section>
  );
}
