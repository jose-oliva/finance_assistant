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

  // animated bar widths
  const [spentPct, setSpentPct] = useState(0);
  const [leftPct, setLeftPct] = useState(0);

  // animated reveal for action cards
  const [stepVisible, setStepVisible] = useState([false, false, false]);

  useEffect(() => {
    // animate the "already spent" chunk first
    const t1 = setTimeout(() => {
      setSpentPct(spentPctTarget);
    }, 200);

    // then animate the "left to survive" chunk
    const t2 = setTimeout(() => {
      setLeftPct(leftPctTarget);
    }, 600);

    // stagger in the 3 survival steps
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
      {/* HEADER */}
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          

          <h2 className="text-lg font-semibold text-slate-900 leading-tight flex items-center gap-2">
            <span role="img" aria-label="siren">🚨</span>
            End-of-Month Survival
          </h2>

         
        </div>
      </header>

      {/* SNAPSHOT */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Cash left */}
          <div className="flex flex-col">
            <div className="text-[11px] uppercase text-slate-500 font-medium">
              Cash left
            </div>
            <div className="text-base font-semibold text-slate-900 leading-tight">
              ${variableMoneyLeft.toLocaleString("es-MX")}
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              after rent / bills set aside
            </div>
          </div>

          {/* Days left */}
          <div className="flex flex-col">
            <div className="text-[11px] uppercase text-slate-500 font-medium">
              Days left
            </div>
            <div className="text-base font-semibold text-slate-900 leading-tight">
              {daysLeft} days
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              until next income
            </div>
          </div>

          {/* Safe daily cap */}
          <div className="flex flex-col">
            <div className="text-[11px] uppercase text-slate-500 font-medium">
              Safe daily max
            </div>
            <div className="text-lg font-bold text-rose-700 leading-tight">
              ${dailyCap.toFixed(0)}/day
            </div>
            <div className="text-[11px] text-rose-600 font-medium leading-tight">
              Do not go over this
            </div>
          </div>
        </div>

        {/* SPENDING SPEED + PROGRESS BAR */}
        <div className="mt-5 rounded-lg border border-rose-200 bg-white/70 p-4 text-[12px] leading-snug">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div className="flex flex-col">
              <div className="text-[11px] uppercase font-semibold text-rose-600 flex items-center gap-1">
                <span role="img" aria-label="fire">🔥</span>
                <span>Spending speed</span>
              </div>

              <div className="text-slate-900 font-semibold text-base leading-tight">
                You burned through ${spentSoFar.toLocaleString("es-MX")} in{" "}
                {daysElapsed} days.
              </div>

              <div className="text-[11px] text-slate-600 leading-snug">
                You only have ${variableMoneyLeft.toLocaleString("es-MX")} left
                to survive the next {daysLeft} days.
              </div>

              <div className="text-[11px] text-rose-600 font-medium leading-snug mt-1">
                Current burn rate: ~$
                {currentBurnRate.toLocaleString("es-MX")}/day.
                Safe target: ~${dailyCap.toFixed(0)}/day.
              </div>
            </div>

            <div className="text-right sm:text-right">
              <div className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 leading-none">
                <span role="img" aria-label="alert">🚨</span>
                <span>Emergency mode</span>
              </div>
            </div>
          </div>

          {/* animated bar */}
          <div className="w-full">
            <div className="w-full h-4 rounded bg-slate-200 overflow-hidden flex">
              {/* spent chunk */}
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500 ease-out"
                style={{ width: `${spentPct}%` }}
                title={`${spentPct.toFixed(0)}% already gone`}
              />
              {/* remaining chunk */}
              <div
                className="h-full bg-slate-300 transition-all duration-500 ease-out"
                style={{ width: `${leftPct}%` }}
                title={`${leftPct.toFixed(0)}% left to survive`}
              />
            </div>

            {/* labels below bar */}
            <div className="flex flex-col sm:flex-row sm:justify-between mt-2 text-[11px] leading-snug font-medium">
              <div className="text-rose-600">
                ${spentSoFar.toLocaleString("es-MX")} already spent
                <span className="text-slate-500 font-normal">
                  {" "}
                  ({daysElapsed} days)
                </span>
              </div>

              <div className="text-slate-700 sm:text-right">
                ${variableMoneyLeft.toLocaleString("es-MX")} left to live on
                <span className="text-slate-500 font-normal">
                  {" "}
                  ({daysLeft} days)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONS TO TAKE TODAY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* STEP 1: Protect housing first */}
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
              <span>Protect housing first</span>
            </div>
          </div>

          <div className="text-[13px] text-slate-900 font-semibold leading-snug">
            Move ${rentDueRemaining.toLocaleString("es-MX")} MXN into
            a “rent / utilities only” bucket.
          </div>

          
        </div>

        {/* STEP 2: Weekly cash mode */}
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
              <span>Weekly cash mode</span>
            </div>
          </div>

          <div className="text-[13px] text-slate-900 font-semibold leading-snug">
            Withdraw ~${weeklyCash.toFixed(0)} MXN for 7 days
            (food + transport).
          </div>

      
        </div>

        {/* STEP 3: When debt is allowed */}
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
              <span>Debt rules</span>
            </div>
          </div>

          <div className="text-[13px] text-slate-900 font-semibold leading-snug">
            When is debt OK (and when it’s not)?
          </div>

          
        </div>
      </div>
    </section>
  );
}
