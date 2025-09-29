"use client";

import { useTransition } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import SpinnerMini from "./SpinnerMini";

function DeletePostedJob({ jobId, onDelete }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("Are you sure you want to delete your job? It's undoable!"))
      startTransition(() => onDelete(jobId));
  }
  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-red-800 rounded-xl hover:bg-red-700 cursor-pointer transition-colors"
    >
      {!isPending ? (
        <TrashIcon className="w-5 h-5 text-red-300" />
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
}

export default DeletePostedJob;
