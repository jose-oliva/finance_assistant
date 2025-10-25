// src/components/finance/EmergencyFundPlan.jsx
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
    <section className="w-full max-w-3xl mx-auto rounded-2xl border border-emerald-300/50 bg-emerald-50/60 backdrop-blur-sm shadow-md p-6 space-y-4">
      <header className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-full px-2 py-1 inline-block">
            Caja 1
          </div>
          <h2 className="text-lg font-semibold text-slate-900 leading-snug mt-2">
            Fondo de emergencia
            <span className="block text-emerald-700 font-normal text-sm">
              Tu escudo anti-préstamo
            </span>
          </h2>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            ← Volver
          </button>
        )}
      </header>

      <p className="text-sm text-slate-800 leading-relaxed">
        Meta inicial: 1 mes de vida básica ≈{" "}
        <span className="font-semibold">
          ${oneMonthTarget.toLocaleString("es-MX")} MXN
        </span>.
        Esto es renta+servicios+comida.
      </p>

      <p className="text-sm text-slate-800 leading-relaxed">
        Tú sí puedes apartar{" "}
        <span className="font-semibold text-emerald-700">
          ${emergencyMonthlyDeposit.toLocaleString("es-MX")} MXN/mes
        </span>{" "}
        sin quedarte sin aire.
      </p>

      <div className="bg-white/70 border border-emerald-200 rounded-xl p-4 text-[13px] leading-relaxed">
        <p className="font-semibold text-slate-900 mb-2">
          ¿Qué pasa si apartas eso cada mes?
        </p>
        <ul className="space-y-1 text-slate-700">
          <li>Mes 1 → ${emergencyMonthlyDeposit.toLocaleString("es-MX")}</li>
          <li>Mes 2 → ${(emergencyMonthlyDeposit * 2).toLocaleString("es-MX")}</li>
          <li>Mes 3 → ${(emergencyMonthlyDeposit * 3).toLocaleString("es-MX")}</li>
          <li>
            Mes {monthsToOne} → $
            {oneMonthTarget.toLocaleString("es-MX")} ✅
          </li>
        </ul>
        <p className="mt-2 text-slate-800">
          En {monthsToOne} meses ya tienes 1 mes de vida pagado
          sin pedirle dinero a nadie.
        </p>
      </div>

      <div className="bg-white/70 border border-emerald-200 rounded-xl p-4 text-[13px] leading-relaxed">
        <p className="font-semibold text-slate-900 mb-2">
          ¿Modo PRO (3 meses)?
        </p>
        <p>
          Meta pro = 3 meses guardados = $
          {threeMonthTarget.toLocaleString("es-MX")} MXN.
        </p>
        <p>
          Con ${emergencyMonthlyDeposit.toLocaleString("es-MX")}/mes → ~
          {monthsToThree} meses (≈ 1 año).
        </p>
        <p className="mt-2 text-slate-800">
          Eso es: “si mañana renuncio, puedo vivir 3 meses sin estrés ni deuda”.
        </p>
      </div>

      <div className="text-[13px] text-slate-800 leading-relaxed bg-white/70 border border-emerald-200 rounded-xl p-4">
        <p className="font-semibold text-slate-900 mb-2">Acción bancaria:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Abre una subcuenta llamada “Emergencia”.</li>
          <li>Programa transferencia automática mensual.</li>
          <li>Sin tarjeta física para esa subcuenta = menos tentación.</li>
        </ul>
      </div>
    </section>
  );
}
