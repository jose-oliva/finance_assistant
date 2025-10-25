import { useState } from "react";
import QuestionnairePanel from "./QuestionnairePanel"; 
import ReviewPanel from "./ReviewPanel";

export default function FinancePanel() {
  const [tab, setTab] = useState("questionnaire"); // questionnaire | review

  return (
    <div className="p-8 w-full max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Asistente Financiero</h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded border ${tab === "questionnaire" ? "bg-blue-600 text-white" : "bg-white"}`}
            onClick={() => setTab("questionnaire")}
          >
            Cuestionario
          </button>
          <button
            className={`px-4 py-2 rounded border ${tab === "review" ? "bg-blue-600 text-white" : "bg-white"}`}
            onClick={() => setTab("review")}
          >
            Review
          </button>
        </div>
      </div>

      {tab === "questionnaire" ? <QuestionnairePanel /> : <ReviewPanel />}
    </div>
  );
}
