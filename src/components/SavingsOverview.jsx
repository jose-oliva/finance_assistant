import React, { useEffect, useRef, useState } from "react";
import EmergencyPlanFund from "./EmergencyPlanFund";
import ShortTermGoalsPlan from "./ShortTermGoalsPlan";
import LongTermPlan from "./LongTermPlan";

export default function SavingsOverview({
  monthlyExpenses = 0,
  emergencyMonthlyDeposit = 0,
  shortTermGoalCost = 0,
  shortTermDepositA = 0,
  fastDeposit = 0,
  monthlyLongTerm = 0,
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
    <section className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center m-4">
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => goTo(Math.max(0, active - 1))}
            className="px-2 py-1 rounded-lg border border-gray-500 hover:bg-slate-50 disabled:opacity-40"
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

      {/* Carousel with snap scrolling */}
      <div
        ref={trackRef}
        className="relative overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex w-full">
          {/* Slide 1: Emergency Fund */}
          <div className="snap-center shrink-0 w-full px-2 sm:px-4">
            <EmergencyPlanFund
              monthlyExpenses={monthlyExpenses}
              emergencyMonthlyDeposit={emergencyMonthlyDeposit}
            />
          </div>

          {/* Slide 2: 3–12 Month Goal */}
          <div className="snap-center shrink-0 w-full px-2 sm:px-4">
            <ShortTermGoalsPlan
              shortTermGoalCost={shortTermGoalCost}
              depositSlow={shortTermDepositA}
              depositFast={fastDeposit}
            />
          </div>

          {/* Slide 3: Long Term */}
          <div className="snap-center shrink-0 w-full px-2 sm:px-4">
            <LongTermPlan monthlyLongTerm={monthlyLongTerm} />
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${active === i ? "w-6 bg-slate-700" : "w-2.5 bg-slate-300"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
