import React, { useEffect, useState, useMemo } from "react";
import { FiHome, FiCreditCard, FiAlertTriangle } from "react-icons/fi";
import { PiWalletBold } from "react-icons/pi";

export default function EndOfMonthSurvivalPlanOverview({
  daysLeft = 20,              
  daysElapsed = 10,           
  spentSoFar = 20000,         
  rentDueRemaining = 6800,    
  variableMoneyLeft = 3200,   
  currentBurnRate = 1600,     
}) {
  // límite diario realista para no endeudarte más
  const dailyCap = daysLeft > 0 ? variableMoneyLeft / daysLeft : 0;
  const weeklyCash = dailyCap * 7;

  const totalTracked = spentSoFar + variableMoneyLeft;
  const spentPctTarget = useMemo(
    () => (totalTracked > 0 ? (spentSoFar / totalTracked) * 100 : 0),
    [spentSoFar, totalTracked]
  );
  const leftPctTarget = useMemo(
    () => 100 - spentPctTarget,
    [spentPctTarget]
  );

  // animación barra
  const [spentPct, setSpentPct] = useState(0);
  const [leftPct, setLeftPct] = useState(0);

  // animación steps
  const [stepVisible, setStepVisible] = useState([false, false, false]);

  useEffect(() => {
    // animar barra gastada
    const t1 = setTimeout(() => {
      setSpentPct(spentPctTarget);
    }, 200);

    // animar barra restante
    const t2 = setTimeout(() => {
      setLeftPct(leftPctTarget);
    }, 600);

    // mostrar pasos uno a uno
    const t3 = setTimeout(() => {
      setStepVisible([true, false, false]);
    }, 800);

    const t4 = setTimeout(() => {
      setStepVisible([true, true, false]);
    }, 950);

    const t5 = setTimeout(() => {
      setStepVisible([true, true, true]);
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [spentPctTarget, leftPctTarget]);

  return (
    <section className="w-full max-w-xl mx-auto rounded-2xl border border-rose-300 bg-white/80 backdrop-blur-sm shadow-md p-6 space-y-6">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          

          <h2 className="text-lg font-semibold text-slate-900 leading-tight flex items-center gap-2">
            <span role="img" aria-label="siren">🚨</span>
            Supervivencia de fin de mes
          </h2>

        </div>
      </header>

      {/* SNAPSHOT RÁPIDO */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Liquidez actual */}
          <div className="flex flex-col">
            <div className="text-[11px] uppercase text-slate-500 font-medium">
              Te queda líquido
            </div>
            <div className="text-base font-semibold text-slate-900 leading-tight">
              ${variableMoneyLeft.toLocaleString("es-MX")}
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              ya SIN renta / servicios
            </div>
          </div>

          {/* Días restantes */}
          <div className="flex flex-col">
            <div className="text-[11px] uppercase text-slate-500 font-medium">
              Días restantes
            </div>
            <div className="text-base font-semibold text-slate-900 leading-tight">
              {daysLeft} días
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              hasta cobrar
            </div>
          </div>

          {/* Tope diario sano */}
          <div className="flex flex-col">
            <div className="text-[11px] uppercase text-slate-500 font-medium">
              Tope diario sano
            </div>
            <div className="text-lg font-bold text-rose-700 leading-tight">
              ${dailyCap.toFixed(0)}/día
            </div>
            <div className="text-[11px] text-rose-600 font-medium leading-tight">
              No pases esto
            </div>
          </div>
        </div>

        {/* BLOQUE VISUAL: "Te comiste X en Y días" */}
        <div className="mt-5 rounded-lg border border-rose-200 bg-white/70 p-4 text-[12px] leading-snug">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div className="flex flex-col">
              <div className="text-[11px] uppercase font-semibold text-rose-600 flex items-center gap-1">
                <span role="img" aria-label="fuego">🔥</span>
                <span>Velocidad de gasto</span>
              </div>

              <div className="text-slate-900 font-semibold text-base leading-tight">
                Te comiste ${spentSoFar.toLocaleString("es-MX")} en {daysElapsed} días.
              </div>

              <div className="text-[11px] text-slate-600 leading-snug">
                Te quedan ${variableMoneyLeft.toLocaleString("es-MX")} para los
                próximos {daysLeft} días.
              </div>

              <div className="text-[11px] text-rose-600 font-medium leading-snug mt-1">
                Estás quemando ~${currentBurnRate.toLocaleString("es-MX")}/día.
                Tope sano sería ~${dailyCap.toFixed(0)}/día.
              </div>
            </div>

            <div className="text-right sm:text-right">
              <div className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 leading-none">
                <span role="img" aria-label="alerta">🚨</span>
                <span>Modo emergencia</span>
              </div>
            </div>
          </div>

          {/* Barra apilada animada */}
          <div className="w-full">
            <div className="w-full h-4 rounded bg-slate-200 overflow-hidden flex">
              {/* tramo gastado */}
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500 ease-out"
                style={{ width: `${spentPct}%` }}
                title={`${spentPct.toFixed(0)}% ya gastado`}
              />
              {/* tramo que queda */}
              <div
                className="h-full bg-slate-300 transition-all duration-500 ease-out"
                style={{ width: `${leftPct}%` }}
                title={`${leftPct.toFixed(0)}% que queda`}
              />
            </div>

            {/* etiquetas bajo la barra */}
            <div className="flex flex-col sm:flex-row sm:justify-between mt-2 text-[11px] leading-snug font-medium">
              <div className="text-rose-600">
                ${spentSoFar.toLocaleString("es-MX")} ya se fue
                <span className="text-slate-500 font-normal">
                  {" "}
                  ({daysElapsed} días)
                </span>
              </div>

              <div className="text-slate-700 sm:text-right">
                ${variableMoneyLeft.toLocaleString("es-MX")} para sobrevivir
                <span className="text-slate-500 font-normal">
                  {" "}
                  ({daysLeft} días)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACCIONES INMEDIATAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Paso 1: Blindar renta */}
        <div
          className={`rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm transition-all duration-300 ${
            stepVisible[0]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          } hover:shadow-md hover:bg-white`}
        >
          <div className="flex items-start gap-2 mb-2">
            <div className="flex-shrink-0 rounded-full bg-rose-100 border border-rose-300 w-8 h-8 flex items-center justify-center text-rose-700 text-[11px] font-semibold leading-none">
              1
            </div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
              <FiHome className="text-slate-600" size={14} />
              <span>Blindar techo primero</span>
            </div>
          </div>

          <div className="text-[13px] text-slate-900 font-semibold leading-snug">
            Aparta ${rentDueRemaining.toLocaleString("es-MX")} MXN
            sólo para renta/servicios.
          </div>

          <div className="text-[11px] text-slate-600 leading-snug mt-2">
            Ese dinero NO se toca. Evita terminar pidiendo préstamo sólo para pagar el techo.
          </div>

        </div>

        {/* Paso 2: Modo efectivo */}
        <div
          className={`rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm transition-all duration-300 ${
            stepVisible[1]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          } hover:shadow-md hover:bg-white`}
        >
          <div className="flex items-start gap-2 mb-2">
            <div className="flex-shrink-0 rounded-full bg-rose-100 border border-rose-300 w-8 h-8 flex items-center justify-center text-rose-700 text-[11px] font-semibold leading-none">
              2
            </div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
              <PiWalletBold className="text-slate-600" size={14} />
              <span>Modo efectivo semanal</span>
            </div>
          </div>

          <div className="text-[13px] text-slate-900 font-semibold leading-snug">
            Retira ~${weeklyCash.toFixed(0)} MXN para 7 días
            (comida + transporte).
          </div>

          <div className="text-[11px] text-slate-600 leading-snug mt-2">
            Ese cash físico es tu límite real. Cero “solo esta vez” con tarjeta.
          </div>

         
        </div>

        {/* Paso 3: Crédito / préstamo */}
        <div
          className={`rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm transition-all duration-300 ${
            stepVisible[2]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          } hover:shadow-md hover:bg-white`}
        >
          <div className="flex items-start gap-2 mb-2">
            <div className="flex-shrink-0 rounded-full bg-rose-100 border border-rose-300 w-8 h-8 flex items-center justify-center text-rose-700 text-[11px] font-semibold leading-none">
              3
            </div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
              <FiCreditCard className="text-slate-600" size={14} />
              <span>Crédito / préstamo</span>
            </div>
          </div>

          <div className="text-[13px] text-slate-900 font-semibold leading-snug">
            ¿Cuándo sí se usa deuda y cuándo NO?
          </div>

          <div className="text-[11px] text-slate-600 leading-snug mt-2">
            Sólo si sin ese gasto pierdes ingreso (salud / transporte al trabajo).
          </div>

          
        </div>
      </div>
    </section>
  );
}
