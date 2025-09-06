"use client";

import { useState, useTransition } from "react";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { toggleSaveJob } from "@/app/_lib/actions";

function SaveJobButton({ jobId, seekerId, isSaved }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticSave, setOptimisticSave] = useState(isSaved);

  function handleToggle() {
    setOptimisticSave((prev) => !prev);

    try {
      startTransition(
        async () =>
          await toggleSaveJob({ jobId, seekerId, isSaved: optimisticSave })
      );
    } catch (err) {
      console.error(err);
      setOptimisticSave(isSaved);
    }
  }

  if (!seekerId) return null;

  return (
    <button
      className="mr-7 cursor-pointer"
      onClick={handleToggle}
      disabled={isPending}
    >
      <BookmarkIcon
        className={`w-5 h-5 transition-colors ${
          optimisticSave
            ? "text-accent-500"
            : "text-primary-300 hover:text-accent-500"
        } `}
      />
    </button>
  );
}

export default SaveJobButton;
