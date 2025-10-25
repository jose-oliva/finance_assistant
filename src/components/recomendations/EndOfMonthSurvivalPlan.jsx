// src/components/finance/EndOfMonthSurvivalPlan.jsx
import React from "react";

export default function EndOfMonthSurvivalPlan({
  cashAvailable = 2500,       // efectivo o saldo libre real que puedes usar
  daysLeft = 7,               // días que faltan para que entre dinero
  essentialBills = 1200,      // cosas que sí o sí debes pagar antes de cobrar otra vez (renta prorrateada, transporte, comida básica mínima)
  minDebtPayment = 300        // pago mínimo de tarjeta / deuda para no caer en mora
}) {
  // dinero realmente "usable" después de apartar lo esencial
  const usable = cashAvailable - essentialBills - minDebtPayment;
  const safeUsable = usable < 0 ? 0 : usable;

  // presupuesto diario máximo para sobrevivir
  const dailyAllowance = daysLeft > 0 ? safeUsable / daysLeft : 0;

  return (
    <section className="w-full max-w-xl mx-auto rounded-2xl border border-rose-200 bg-white/80 backdrop-blur-sm shadow-md p-6">
      {/* header */}
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span role="img" aria-label="alert">
            🚨
          </span>
          Plan de Supervivencia
        </h2>
        <p className="text-xs text-slate-500">
          Objetivo: llegar al final del periodo sin endeudarte más.
        </p>
      </header>

      {/* números duros */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="text-[11px] text-slate-500 uppercase font-medium">
            Dinero disponible HOY
          </div>
          <div className="text-slate-900 font-semibold text-base">
            ${cashAvailable.toLocaleString("es-MX")} MXN
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="text-[11px] text-slate-500 uppercase font-medium">
            Días que faltan
          </div>
          <div className="text-slate-900 font-semibold text-base">
            {daysLeft} días
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="text-[11px] text-slate-500 uppercase font-medium">
            Pagos esenciales
          </div>
          <div className="text-slate-900 font-semibold text-base">
            ${essentialBills.toLocaleString("es-MX")} MXN
          </div>
          <div className="text-[11px] text-slate-500 leading-snug mt-1">
            comida básica, transporte, renta/prorrateo
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="text-[11px] text-slate-500 uppercase font-medium">
            Mínimo de deuda
          </div>
          <div className="text-slate-900 font-semibold text-base">
            ${minDebtPayment.toLocaleString("es-MX")} MXN
          </div>
          <div className="text-[11px] text-slate-500 leading-snug mt-1">
            para no generar recargos fuertes
          </div>
        </div>
      </div>

      {/* resultado crítico */}
      <div className="rounded-xl border border-rose-300 bg-rose-50/60 p-4">
        <div className="text-[11px] text-rose-600 uppercase font-semibold mb-2">
          Límite diario máximo
        </div>

        <p className="text-sm text-slate-800 leading-snug mb-2">
          Después de apartar lo esencial, te queda:
        </p>

        <p className="text-2xl font-bold text-rose-700 leading-tight">
          ${dailyAllowance.toFixed(0)} MXN / día
        </p>

        {usable < 0 && (
          <p className="text-xs text-rose-700 font-medium mt-2">
            ⚠ Estás negativa/o. Tienes más gastos urgentes que dinero líquido.
            Hay que recortar YA o conseguir ingreso extra rápido.
          </p>
        )}
      </div>

      {/* pasos accionables */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white/60 p-4">
        <div className="text-[11px] text-slate-500 uppercase font-semibold mb-2">
          Qué hacer HOY
        </div>

        <ul className="text-sm text-slate-700 leading-relaxed space-y-2 list-disc pl-4">
          <li>
            Paga primero renta, comida base y transporte. Lo demás espera.
          </li>
          <li>
            No uses tarjeta/crédito para comida rápida o compras impulsivas.
            Eso convierte gastos pequeños en deuda cara.
          </li>
          <li>
            Define un tope diario (el número de arriba) y literal no lo pases.
            Efectivo físico ayuda: saca sólo ese monto por día.
          </li>
          <li>
            Vende / liquida algo rápido si el usable salió negativo: libro,
            prenda, freelance express. Lo que sea que te dé flujo hoy.
          </li>
        </ul>
      </div>
    </section>
  );
}
