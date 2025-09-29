"use client";

import { useOptimistic } from "react";
import PostedjobCard from "./PostedjobCard";
import { deletePostedJob } from "@/app/_lib/actions";
import SpinnerMini from "./SpinnerMini";

function PostedJobList({ postedJobs }) {
  const [optimisticPostedJobs, optimisticDelete] = useOptimistic(
    postedJobs,
    (curPostedJobs, action) => {
      if (typeof action === "object" && action.deleting) {
        return curPostedJobs.map((job) =>
          job.id === action.id ? { ...job, deleting: true } : job
        );
      }
      return curPostedJobs.filter((job) => job.id !== action);
    }
  );

  async function handleDelete(jobId) {
    optimisticDelete({ id: jobId, deleting: true });
    await deletePostedJob(jobId);
    optimisticDelete(jobId);
  }

  return (
    <ul className="space-y-6">
      {optimisticPostedJobs.map((postedJob) =>
        postedJob.deleting ? (
          <div key={postedJob.id} className="flex justify-center py-10">
            <SpinnerMini />
          </div>
        ) : (
          <PostedjobCard
            postedJob={postedJob}
            onDelete={handleDelete}
            key={postedJob.id}
          />
        )
      )}
    </ul>
  );
}

export default PostedJobList;
