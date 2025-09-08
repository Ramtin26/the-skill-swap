"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { toggleSaveJob } from "../_lib/actions";

const JobsContext = createContext();

export function JobsProvider({ initialSavedIds, children, seekerId }) {
  const [savedJobs, setSavedJobs] = useState(initialSavedIds || []);
  const [isPending, startTransition] = useTransition();

  function toggleJob(jobId) {
    const currentlySaved = savedJobs.includes(jobId);

    // Optimistic update
    setSavedJobs((prev) =>
      currentlySaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );

    startTransition(async () => {
      try {
        await toggleSaveJob({
          jobId,
          seekerId,
          isSaved: currentlySaved,
        });
      } catch (err) {
        console.error("Error toggling job:", err);
        // Rollback
        setSavedJobs((prev) =>
          currentlySaved ? [...prev, jobId] : prev.filter((id) => id !== jobId)
        );
      }
    });
  }

  return (
    <JobsContext.Provider value={{ savedJobs, toggleJob, seekerId, isPending }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined)
    throw new Error("Context was used outside of Provider");
  return context;
}
