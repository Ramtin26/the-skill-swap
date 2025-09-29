"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { toggleSaveJob } from "@/app/_lib/actions";

const JobsContext = createContext();

export function JobsProvider({ children, seekerId }) {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!seekerId) return;
    fetch("/api/saved-jobs")
      .then((res) => res.json())
      .then((ids) => setSavedJobs(ids))
      .catch((err) => console.error("fetch saved jobs failed", err));
  }, [seekerId]);

  function toggleJob(jobId) {
    const currentlySaved = savedJobs.includes(jobId);
    setSavedJobs((prev) =>
      currentlySaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
    startTransition(async () => {
      try {
        await toggleSaveJob({ jobId, seekerId, isSaved: currentlySaved });
      } catch (err) {
        console.error("Error toggling job:", err);
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
