"use client";

function EvaluateButton({ handleEvaluate, style, disabled = false, children }) {
  return (
    <button
      onClick={handleEvaluate}
      disabled={disabled}
      className={`flex items-center gap-1 px-3 py-1 text-xs font-bold border ${style} rounded-lg transition cursor-pointer disabled:hover:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default EvaluateButton;
