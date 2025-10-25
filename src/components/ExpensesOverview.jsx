import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * ExpensesOverview
 * Final screen showing floating bubbles representing budget usage for each category
 */
export default function ExpensesOverview({ budgetData = { Hogar: { budget: 3400, spent: 0 }, Ocio: { budget: 1000, spent: 0 }, Comida: { budget: 2100, spent: 0 } } }) {
  const [positions, setPositions] = useState([
    { x: 300, y: 40, vx: 0, vy: 0 },
    { x: 450, y: 40, vx: 0, vy: 0 },
    { x: 375, y: 120, vx: 0, vy: 0 },
  ]);

  const categories = ["Hogar", "Ocio", "Comida"];

  useEffect(() => {
    const animate = () => {
      setPositions((prev) => {
        return prev.map((pos, i) => {
          // Gentle repulsion from other bubbles
          let fx = 0, fy = 0;
       prev.forEach((other, j) => {
            if (i !== j) {
              const dx = other.x - pos.x;
              const dy = other.y - pos.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 0 && dist < 150) {
                const force = (150 - dist) / 150 * 0.2; // Gentler repulsion
                fx -= (dx / dist) * force;
                fy -= (dy / dist) * force;
              }
            }
          });

          // Apply gentle damping
          let vx = pos.vx * 0.9 + fx;
          let vy = pos.vy * 0.9 + fy;
          
          // Very subtle random movement
          vx += (Math.random() - 0.5) * 0.1;
          vy += (Math.random() - 0.5) * 0.1;

          // Update position with gentle movement
          const newX = pos.x + vx * 0.5;
          const newY = pos.y + vy * 0.5;

          return { x: newX, y: newY, vx, vy };
        });
      });
    };

    const interval = setInterval(animate, 100); // Slower animation
    return () => clearInterval(interval);
  }, []);

  const getBubbleProps = (category) => {
    const data = budgetData[category];
    const percentage = data.budget > 0 ? Math.min(100, (data.spent / data.budget) * 100) : 0;
    
    // Size based on percentage: 60px (30%) to 200px (100%)
    const size = 60 + (percentage / 100) * 140;
    
    // Color based on percentage
    let color;
    if (percentage <= 33) {
      color = "#10b981"; // Green
    } else if (percentage <= 66) {
      color = "#f59e0b"; // Orange
    } else {
      color = "#ef4444"; // Red
    }

    return { size, color, percentage };
  };

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-4xl flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6 pb-0">
          <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">
            Resumen de Gastos
          </h1>
          <p className="text-sm text-slate-500 text-center">
            Visualización de presupuestos por categoría
          </p>
        </div>

        <div className="relative w-full h-[400px]">
          {categories.map((category, index) => {
            const bubbleProps = getBubbleProps(category);
            const data = budgetData[category];
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 20,
                  delay: index * 0.2 
                }}
                style={{
                  position: "absolute",
                  left: `${positions[index].x}px`,
                  top: `${positions[index].y}px`,
                  transform: `translate(-50%, -50%)`,
                  width: `${bubbleProps.size}px`,
                  height: `${bubbleProps.size}px`,
                  borderRadius: "50%",
                  backgroundColor: bubbleProps.color,
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  zIndex: 10,
                }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center justify-center"
              >
                <div className="text-center text-white font-bold px-2">
                  <div className="text-sm">{category}</div>
                  <div className="text-xs">{formatter.format(data.spent)}/{formatter.format(data.budget)}</div>
                  <div className="text-xs">{bubbleProps.percentage.toFixed(0)}%</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
