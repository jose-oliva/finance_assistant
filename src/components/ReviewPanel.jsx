// src/components/ReviewPanel.jsx
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

  // Intentamos leer realByDay del store
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
        <h2 className="text-2xl font-semibold mb-2">Sin presupuesto registrado</h2>
        <p>Ingresa un presupuesto en el Cuestionario para ver la gráfica.</p>
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

    // Serie real: zeros (o del store) hasta "today"
    const real = Array.from({ length: daysInMonth }, (_, i) => {
      if (Array.isArray(realSeries) && i < realSeries.length) return Number(realSeries[i] || 0);
      return i + 1 <= today ? 0 : 0;
    });

    const spent = real[Math.max(0, today - 1)] ?? 0;
    const dailySlope = spent / Math.max(1, today);
    const projectionEnd = Math.round(dailySlope * daysInMonth);
    const marginVsBudget = budget - projectionEnd;

    // 🔹 Punto base en 0 para que TODO arranque “desde cero”
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

  const percentUsed = (spentSoFar / budget) * 100;
  let stateText = "🟢 Buen estado financiero";
  let stateClass = "text-emerald-600";
  if (percentUsed > 60 && percentUsed <= 90) {
    stateText = "🟡 Estado regular";
    stateClass = "text-amber-500";
  } else if (percentUsed > 90) {
    stateText = "🔴 Mal estado";
    stateClass = "text-rose-600";
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl rounded-2xl border border-blue-300 bg-white/70 backdrop-blur p-8 shadow-[0_20px_80px_-20px_rgba(16,6,159,0.25)]">
        {/* Encabezado */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Review — <span className="text-slate-700">Tendencia y Predicción</span>
          </h2>
          <p className="mt-1 text-slate-500">
            Ideal vs. Real (gastos registrados) vs. Proyección del mes actual.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Métricas */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-lg">
              <div className="text-slate-600">Presupuesto:</div>
              <div className="text-2xl font-bold text-emerald-600">
                ${budget.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
              <div className="rounded-lg border p-3">
                <div className="text-slate-500">Día del mes</div>
                <div className="text-xl font-semibold">{daysInMonth}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-slate-500">Hoy</div>
                <div className="text-xl font-semibold">{demoDay ?? new Date().getDate()}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-slate-500">Gasto acumulado</div>
                <div className="text-xl font-semibold">
                  ${Number(spentSoFar || 0).toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-slate-500">Proyección de cierre</div>
                <div className="text-xl font-semibold">
                  ${projTotal.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-2 text-base">
              <p className={`${stateClass} font-medium`}>
                {stateText} — Has usado {percentUsed.toFixed(1)}% del presupuesto.
              </p>

              {isGood ? (
                <p className="text-emerald-600">
                  ✓ Margen estimado de <b>${(budget - projTotal).toLocaleString()}</b> contra presupuesto.
                </p>
              ) : (
                <p className="text-rose-600">
                  ⚠︎ Exceso estimado de <b>${(projTotal - budget).toLocaleString()}</b> sobre presupuesto.
                </p>
              )}

              <p className="text-slate-500 mt-2">
                <span className="font-medium">Ideal</span>: crecimiento lineal hasta el presupuesto.
                <br />
                <span className="font-medium">Proyección</span>: tu ritmo actual extendido a fin de mes.
                <br />
                <span className="font-medium">Real</span>: suma diaria de los gastos registrados.
              </p>
            </div>
          </div>

          {/* Gráfica */}
          <div className="lg:col-span-7 h-[380px] md:h-[440px]">
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                {/* 🔹 Eje X numérico de 0 a fin de mes */}
                <XAxis
                  type="number"
                  dataKey="day"
                  domain={[0, daysInMonth]}
                  tick={{ fontSize: 12 }}
                  tickCount={7}
                />

                {/* 🔹 Eje Y siempre desde 0 */}
                <YAxis
                  type="number"
                  domain={[0, "auto"]}
                  tick={{ fontSize: 12 }}
                  width={70}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />

                <Tooltip
                  formatter={(v) => `$${Number(v).toLocaleString()}`}
                  labelFormatter={(l) => `Día ${l}`}
                />
                <Legend verticalAlign="top" height={36} />

                {/* Banda “permitida” (verde translúcida) — de 0 al presupuesto */}
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
                  name="Proyección"
                  stroke="#F59E0B"
                  strokeDasharray="6 6"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive
                />
                <Line
                  type="monotone"
                  dataKey="real"
                  name="Real"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 2 }}
                  connectNulls={false} // no une nulls
                  isAnimationActive
                />

                {/* Línea de presupuesto */}
                <ReferenceLine
                  y={budget}
                  stroke="#9CA3AF"
                  strokeDasharray="4 4"
                  label={{
                    value: "Presupuesto",
                    position: "insideTopRight",
                    fill: "#6B7280",
                    fontSize: 12,
                    offset: 10,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="text-center text-slate-500 text-sm mt-2">
              La gráfica parte del 0 y se actualiza en cuanto el Overview registra gastos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
