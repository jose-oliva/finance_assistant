import React, { useEffect, useRef, useState } from "react";
import EmergencyPlanFund from "./savingPlans/EmergencyPlanFund";
import ShortTermGoalsPlan from "./savingPlans/ShortTermGoalsPlan";
import LongTermPlan from "./savingPlans/LongTermPlan";

export default function SavingsOverview({
  monthlyExpenses = 20000,
  emergencyMonthlyDeposit = 5000,
  shortTermGoalCost = 15000,
  shortTermDepositA = 2000, 
  fastDeposit = 3000,       
  monthlyLongTerm = 2000,   
}) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setActive(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-3 px-2 sm:px-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Plan personal
          </div>
         
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => goTo(Math.max(0, active - 1))}
            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            disabled={active === 0}
          >
            ←
          </button>
          <button
            onClick={() => goTo(Math.min(2, active + 1))}
            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            disabled={active === 2}
          >
            →
          </button>
        </div>
      </div>

      {/* Carrusel con scroll-snap */}
      <div
        ref={trackRef}
        className="relative overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex w-full">
          <div className="snap-center shrink-0 w-full px-2 sm:px-4">
            <EmergencyPlanFund
              monthlyExpenses={monthlyExpenses}
              emergencyMonthlyDeposit={emergencyMonthlyDeposit}
            />
          </div>

          {/* Slide 2: Meta 3–12 meses */}
          <div className="snap-center shrink-0 w-full px-2 sm:px-4">
            <ShortTermGoalsPlan
              shortTermGoalCost={shortTermGoalCost}
              depositSlow={shortTermDepositA}
              depositFast={fastDeposit}
            />
          </div>

          {/* Slide 3: Largo Plazo */}
          <div className="snap-center shrink-0 w-full px-2 sm:px-4">
            <LongTermPlan monthlyLongTerm={monthlyLongTerm} />
          </div>
        </div>
      </div>

      {/* Paginación (puntitos) */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              active === i ? "w-6 bg-slate-700" : "w-2.5 bg-slate-300"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
