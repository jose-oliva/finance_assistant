import React, { useState } from "react";
import BudgetBreakdown from "./BudgetBreakdown";
import ExpensesOverview from "./ExpensesOverview";

/**
 * BudgetFlow
 * Manages the flow between different budget categories
 */
export default function BudgetFlow() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [budgetData, setBudgetData] = useState({
    Hogar: { budget: 3400, spent: 0 },
    Ocio: { budget: 1000, spent: 0 },
    Comida: { budget: 2100, spent: 0 },
  });

  const categories = [
    { name: "Hogar", budget: 3400 },
    { name: "Ocio", budget: 1000 },
    { name: "Comida", budget: 2100 },
  ];

  const currentCategory = categories[currentCategoryIndex];

  const handleNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handleComplete = () => {
    setShowOverview(true);
  };

  const handleExpensesChange = ({ category, spent }) => {
    setBudgetData((prev) => ({
      ...prev,
      [category]: { ...prev[category], spent },
    }));
  };

  if (showOverview) {
    return <ExpensesOverview budgetData={budgetData} />;
  }

  return (
    <BudgetBreakdown
      key={currentCategory.name}
      category={currentCategory.name}
      initialTotal={currentCategory.budget}
      onNextCategory={handleNextCategory}
      onComplete={handleComplete}
      onExpensesChange={handleExpensesChange}
    />
  );
}
