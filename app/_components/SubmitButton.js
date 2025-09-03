"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ pendingLabel, children }) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="px-7 py-4 cursor-pointer bg-accent-500 text-primary-800 font-semibold rounded-lg hover:bg-accent-600 focus:ring-3 focus:ring-accent-200 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 "
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
