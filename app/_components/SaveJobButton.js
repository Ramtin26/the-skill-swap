"use client";

import { BookmarkIcon } from "@heroicons/react/24/solid";
import { useJobs } from "./JobsContext";

function SaveJobButton({ jobId, size = 5 }) {
  const { savedJobs, toggleJob, seekerId, isPending } = useJobs();

  if (!seekerId) return null;

  const isSaved = savedJobs.includes(jobId);

  return (
    <button
      className="cursor-pointer"
      onClick={() => toggleJob(jobId)}
      disabled={isPending}
    >
      <BookmarkIcon
        className={`w-${size} h-${size} transition-colors ${
          isSaved ? "text-accent-500" : "text-primary-300 hover:text-accent-500"
        } `}
      />
    </button>
  );
}

export default SaveJobButton;
