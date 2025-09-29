"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ pendingLabel, children }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 sm:px-7 py-3 sm:py-4 bg-accent-500 text-primary-800 font-semibold rounded-lg hover:bg-accent-600 focus:ring-2 focus:ring-accent-200 transition-all cursor-pointer cursor-disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
