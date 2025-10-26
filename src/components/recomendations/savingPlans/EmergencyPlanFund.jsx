import React from "react";
export default function EmergencyFundPlan({
  monthlyExpenses = 20000,
  emergencyMonthlyDeposit = 5000,
  onBack,
}) {
  const oneMonthTarget = monthlyExpenses; 
  const threeMonthTarget = monthlyExpenses * 3; 
  const monthsToOne = Math.ceil(oneMonthTarget / emergencyMonthlyDeposit); 
  const monthsToThree = Math.ceil(threeMonthTarget / emergencyMonthlyDeposit);

  return (
    <section className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-md p-6 space-y-6">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
         
          <h2 className="text-lg font-semibold text-slate-900 leading-tight flex items-center gap-2">
            <span role="img" aria-label="shield">🛡️</span>
            Fondo de Emergencia
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

      {/* BLOQUE: METAS CLAVE */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Meta mínima
          </div>
          <div className="text-slate-900 font-semibold text-base">
            ${oneMonthTarget.toLocaleString("es-MX")} MXN
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            ≈ 1 mes de vida básica pagado.
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Meta pro
          </div>
          <div className="text-slate-900 font-semibold text-base">
            ${threeMonthTarget.toLocaleString("es-MX")} MXN
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            ≈ 3 meses sin pánico.
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Aportación mensual
          </div>
          <div className="text-emerald-700 font-semibold text-base">
            ${emergencyMonthlyDeposit.toLocaleString("es-MX")} MXN / mes
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            Automático, sin pensarlo.
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
          <div className="text-[11px] font-medium text-slate-500 uppercase">
            Tiempo estimado
          </div>
          <div className="text-slate-900 font-semibold text-base leading-tight">
            {monthsToOne} meses → meta mínima
          </div>
          <div className="text-[12px] text-slate-600 leading-snug">
            ~{monthsToThree} meses → meta pro
          </div>
        </div>
      </div>

      {/* BLOQUE: PROGRESO TIPO TIMELINE */}
      <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
        <div className="text-[11px] font-semibold text-slate-500 uppercase mb-3">
          Cómo se junta
        </div>

        <div className="flex items-end justify-between text-center text-[12px] text-slate-700">
          <div className="flex-1">
            <div className="h-10 w-2 mx-auto bg-emerald-300 rounded-sm" />
            <div className="font-semibold text-slate-900 mt-1">
              $5,000
            </div>
            <div>Mes 1</div>
          </div>

          <div className="flex-1">
            <div className="h-16 w-2 mx-auto bg-emerald-400 rounded-sm" />
            <div className="font-semibold text-slate-900 mt-1">
              $10,000
            </div>
            <div>Mes 2</div>
          </div>

          <div className="flex-1">
            <div className="h-24 w-2 mx-auto bg-emerald-500 rounded-sm" />
            <div className="font-semibold text-slate-900 mt-1">
              $15,000
            </div>
            <div>Mes 3</div>
          </div>

          <div className="flex-1">
            <div className="h-32 w-2 mx-auto bg-emerald-600 rounded-sm" />
            <div className="font-semibold text-slate-900 mt-1">
              ${oneMonthTarget.toLocaleString("es-MX")}
            </div>
            <div>Mes {monthsToOne} ✅</div>
          </div>
        </div>

        <div className="text-[12px] text-slate-600 text-center mt-4 leading-snug">
          En {monthsToOne} meses ya tienes 1 mes de vida cubierto sin pedir
          prestado.
        </div>
      </div>

      
    </section>
  );
}
