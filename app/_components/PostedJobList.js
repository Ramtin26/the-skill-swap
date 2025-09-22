"use client";

import { useOptimistic } from "react";
import PostedjobCard from "./PostedjobCard";
import { deletePostedJob } from "@/app/_lib/actions";
import SpinnerMini from "./SpinnerMini";

function PostedJobList({ postedJobs }) {
  const [optimisticPostedJobs, optimisticDelete] = useOptimistic(
    postedJobs,
    // (curPostedJobs, jobId) => {
    //   return curPostedJobs.filter((postedJob) => postedJob.id !== jobId);
    // }
    (curPostedJobs, action) => {
      if (typeof action === "object" && action.deleting) {
        // Mark the job as deleting
        return curPostedJobs.map((job) =>
          job.id === action.id ? { ...job, deleting: true } : job
        );
      }
      // Otherwise, assume action is just jobId → remove it
      return curPostedJobs.filter((job) => job.id !== action);
    }
  );

  async function handleDelete(jobId) {
    // optimisticDelete(jobId);
    optimisticDelete({ id: jobId, deleting: true });
    await deletePostedJob(jobId);
    optimisticDelete(jobId);
  }

  return (
    <ul>
      {/* {optimisticPostedJobs.map((postedJob) => (
        <PostedjobCard
          postedJob={postedJob}
          onDelete={handleDelete}
          key={postedJob.id}
        />
      ))} */}
      {optimisticPostedJobs.map((postedJob) =>
        postedJob.deleting ? (
          // <li
          //   key={postedJob.id}
          //   className="mb-6 bg-primary-900 rounded-2xl text-center p-5 flex gap-2 justify-center items-center h-40 text-primary-400"
          // >
          //   <SpinnerMini /> Deleting job...
          // </li>
          <div key={postedJob.id} className="grid items-center justify-center">
            <SpinnerMini />
            <p className="text-xl text-primary-200">Deleting job...</p>
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
