"use client";

function EvaluateButton({ handleEvaluate, style, children }) {
  return (
    <button
      onClick={handleEvaluate}
      className={`flex items-center gap-1 px-3 py-1 text-xs font-bold border ${style} rounded-lg transition cursor-pointer`}
    >
      {children}
    </button>
  );
}

export default EvaluateButton;
