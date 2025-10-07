"use client";

import { useTransition } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import SpinnerMini from "./SpinnerMini";

function DeleteApplication({ applicationId, onDelete }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      confirm(
        "Are you sure you want to cancel your application? This action cannot be undone!"
      )
    )
      startTransition(() => onDelete(applicationId));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md uppercase text-[0.7rem] sm:text-xs font-bold text-primary-300 hover:bg-accent-600 transition-colors hover:text-primary-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {!isPending ? (
        <>
          <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span>Cancel</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
}

export default DeleteApplication;
