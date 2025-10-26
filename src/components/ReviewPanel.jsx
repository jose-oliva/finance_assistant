import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { useBudgetStore } from "./BudgetStore";

export default function ReviewPanel() {
  const budget = useBudgetStore((s) => s.budget);

  // Try to read realByDay from the store (function or array)
  let realSeries = null;
  try {
    const maybe = useBudgetStore((s) => s.realByDay);
    realSeries = typeof maybe === "function" ? maybe() : maybe;
  } catch {
    realSeries = null;
  }

  if (!budget || budget <= 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 text-center text-slate-500">
        <h2 className="text-2xl font-semibold mb-2">No budget yet</h2>
        <p>Enter a budget in the Questionnaire to see the chart.</p>
      </div>
    );
  }

  const now = new Date();
  const demoDay = useBudgetStore((s) => s.demoDay);
  const daysInMonth = useMemo(
    () => new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
    [now]
  );
  const today = demoDay ?? now.getDate();

  const { data, projTotal, margin, spentSoFar } = useMemo(() => {
    const idealPerDay = budget / daysInMonth;

    // Real series: from store if present, otherwise zeros up to "today"
    const real = Array.from({ length: daysInMonth }, (_, i) => {
      if (Array.isArray(realSeries) && i < realSeries.length) return Number(realSeries[i] || 0);
      return i + 1 <= today ? 0 : 0;
    });

    const spent = real[Math.max(0, today - 1)] ?? 0;
    const dailySlope = spent / Math.max(1, today);
    const projectionEnd = Math.round(dailySlope * daysInMonth);
    const marginVsBudget = budget - projectionEnd;

    // Force the chart to start at 0
    const baseRow = { day: 0, ideal: 0, real: 0, proj: 0 };

    const rows = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        day,
        ideal: Math.round(idealPerDay * day),
        real: day <= today ? real[i] : null,
        proj: Math.round(dailySlope * day),
      };
    });

    return {
      data: [baseRow, ...rows],
      projTotal: projectionEnd,
      margin: marginVsBudget,
      spentSoFar: spent,
    };
  }, [budget, daysInMonth, today, realSeries]);

  const isGood = margin >= 0;

  // Status light
  const percentUsed = (spentSoFar / budget) * 100;
  let stateText = "🟢 Good financial state";
  let stateClass = "text-emerald-600";
  if (percentUsed > 60 && percentUsed <= 90) {
    stateText = "🟡 Fair state";
    stateClass = "text-amber-500";
  } else if (percentUsed > 90) {
    stateText = "🔴 Bad state";
    stateClass = "text-rose-600";
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl rounded-2xl border border-blue-300 bg-white/70 backdrop-blur p-8 shadow-[0_20px_80px_-20px_rgba(16,6,159,0.25)]">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Review — <span className="text-slate-700">Trend & Forecast</span>
          </h2>
          <p className="mt-1 text-slate-500">
            Ideal vs. Actual (logged expenses) vs. Projection for the current month.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Metrics */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-lg">
              <div className="text-slate-600">Budget:</div>
              <div className="text-2xl font-bold text-emerald-600">
                ${budget.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
              <div className="rounded-lg border p-3">
                <div className="text-slate-500">Days in month</div>
                <div className="text-xl font-semibold">{daysInMonth}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-slate-500">Today</div>
                <div className="text-xl font-semibold">{demoDay ?? new Date().getDate()}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-slate-500">Cumulative spend</div>
                <div className="text-xl font-semibold">
                  ${Number(spentSoFar || 0).toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-slate-500">Projected month-end</div>
                <div className="text-xl font-semibold">
                  ${projTotal.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-2 text-base">
              <p className={`${stateClass} font-medium`}>
                {stateText} — You’ve used {percentUsed.toFixed(1)}% of the budget.
              </p>

              {isGood ? (
                <p className="text-emerald-600">
                  ✓ Estimated margin of <b>${(budget - projTotal).toLocaleString()}</b> vs. budget.
                </p>
              ) : (
                <p className="text-rose-600">
                  ⚠︎ Estimated overrun of <b>${(projTotal - budget).toLocaleString()}</b> vs. budget.
                </p>
              )}

              <p className="text-slate-500 mt-2">
                <span className="font-medium">Ideal</span>: linear growth up to the budget.
                <br />
                <span className="font-medium">Projection</span>: your current pace extended to month-end.
                <br />
                <span className="font-medium">Actual</span>: daily cumulative sum of logged expenses.
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-7 h-[380px] md:h-[440px]">
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                {/* X axis from 0 to end of month */}
                <XAxis
                  type="number"
                  dataKey="day"
                  domain={[0, daysInMonth]}
                  tick={{ fontSize: 12 }}
                  tickCount={7}
                />

                {/* Y axis always from 0 */}
                <YAxis
                  type="number"
                  domain={[0, "auto"]}
                  tick={{ fontSize: 12 }}
                  width={70}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />

                <Tooltip
                  formatter={(v) => `$${Number(v).toLocaleString()}`}
                  labelFormatter={(l) => `Day ${l}`}
                />
                <Legend verticalAlign="top" height={36} />

                {/* Allowed band (0..budget) */}
                <ReferenceArea
                  x1={0}
                  x2={daysInMonth}
                  y1={0}
                  y2={budget}
                  fill="#10B98122"
                  strokeOpacity={0}
                />

                {/* Series */}
                <Line
                  type="monotone"
                  dataKey="ideal"
                  name="Ideal"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive
                />
                <Line
                  type="monotone"
                  dataKey="proj"
                  name="Projection"
                  stroke="#F59E0B"
                  strokeDasharray="6 6"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive
                />
                <Line
                  type="monotone"
                  dataKey="real"
                  name="Actual"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 2 }}
                  connectNulls={false}
                  isAnimationActive
                />

                {/* Budget line */}
                <ReferenceLine
                  y={budget}
                  stroke="#9CA3AF"
                  strokeDasharray="4 4"
                  label={{
                    value: "Budget",
                    position: "insideTopRight",
                    fill: "#6B7280",
                    fontSize: 12,
                    offset: 10,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="text-center text-slate-500 text-sm mt-2">
              The chart starts at 0 and updates as the Overview logs expenses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
