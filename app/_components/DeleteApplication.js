"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";

function DeleteApplication({ applicationId, onDelete }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      confirm(
        "Are you sure you want to cancel your application? It's undoable!"
      )
    )
      startTransition(() => onDelete(applicationId));
  }

  return (
    <button
      onClick={handleDelete}
      className="group flex items-center gap-2 p-2 rounded-lg uppercase text-xs font-bold text-primary-300 px-3 hover:bg-accent-600 transition-colors hover:text-primary-900 cursor-pointer"
    >
      {!isPending ? (
        <>
          <XMarkIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
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
