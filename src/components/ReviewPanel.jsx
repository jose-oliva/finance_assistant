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

export default function ReviewPanel({ income, budgets, expenses }) {
  console.log("ReviewPanel props:", { income, budgets, expenses });
  const budget = income;

  const realSeries = expenses || [];

  if (!budget || budget <= 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 text-center text-slate-500">
        <h2 className="text-2xl font-semibold mb-2">No budget yet</h2>
        <p>Enter a budget to see the chart.</p>
      </div>
    );
  }

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();

  const idealPerDay = budget / daysInMonth;

  const real = Array.from({ length: daysInMonth }, (_, i) => {
    if (Array.isArray(realSeries) && i < realSeries.length) return Number(realSeries[i] || 0);
    return i + 1 <= today ? 0 : 0;
  });

  const spent = real[Math.max(0, today - 1)] ?? 0;
  const dailySlope = spent / Math.max(1, today);
  const projectionEnd = Math.round(dailySlope * daysInMonth);
  const marginVsBudget = budget - projectionEnd;

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

  const data = [baseRow, ...rows];
  const isGood = marginVsBudget >= 0;
  const percentUsed = (spent / budget) * 100;

  let stateText = "🟢 Good";
  let stateClass = "text-emerald-600";
  if (percentUsed > 60 && percentUsed <= 90) {
    stateText = "🟡 Fair";
    stateClass = "text-amber-500";
  } else if (percentUsed > 90) {
    stateText = "🔴 Bad";
    stateClass = "text-rose-600";
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl rounded-2xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Metrics */}
          <div className="lg:col-span-5 space-y-4">

            <div className="grid grid-cols-1 gap-4 text-sm md:text-base">
              {[
                { label: "Days in month", value: daysInMonth },
                { label: "Today", value: today },
                { label: "Cumulative spend", value: `$${Number(spent || 0).toLocaleString()}` },
                { label: "Projected month-end", value: `$${projectionEnd.toLocaleString()}` }
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-black p-3 flex flex-col justify-center items-center min-h-[80px]">
                  <div className="text-slate-500">{label}</div>
                  <div className="text-xl font-semibold text-center">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-2 text-base">
              <p className={`${stateClass} font-medium`}>
                {stateText} — You’ve used {percentUsed.toFixed(1)}% of the budget.
              </p>

              {isGood ? (
                <p className="text-emerald-600">
                  ✓ Estimated margin of <b>${marginVsBudget.toLocaleString()}</b> vs. budget.
                </p>
              ) : (
                <p className="text-rose-600">
                  ⚠︎ Estimated overrun of <b>${(projectionEnd - budget).toLocaleString()}</b> vs. budget.
                </p>
              )}
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

                <XAxis
                  type="number"
                  dataKey="day"
                  domain={[0, daysInMonth]}
                  tick={{ fontSize: 12 }}
                  tickCount={7}
                />

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

                <ReferenceArea
                  x1={0}
                  x2={daysInMonth}
                  y1={0}
                  y2={budget}
                  fill="#10B98122"
                  strokeOpacity={0}
                />

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
