"use client";

function EvaluateButton({
  handleEvaluate,
  style = "",
  disabled = false,
  children,
}) {
  return (
    <button
      onClick={handleEvaluate}
      disabled={disabled}
      className={`flex items-center gap-1 px-3 py-1 text-xs sm:text-sm font-bold border ${style} rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:hover:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default EvaluateButton;
