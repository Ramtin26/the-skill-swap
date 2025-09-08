"use client";

import { useOptimistic } from "react";
import Image from "next/image";
import Link from "next/link";

import { deleteSavedjob } from "@/app/_lib/actions";
import { formatCurrency } from "@/app/helper/helper";
import DeleteSavedJob from "./DeleteSavedJob";

function SeekerDashboard({ savedJobs }) {
  const [optimisticSavedJob, optimisticDelete] = useOptimistic(
    savedJobs,
    (curSavedJob, savedJobId) => {
      return curSavedJob.filter((savedJob) => savedJob.id !== savedJobId);
    }
  );

  async function handleDelete(savedJobId) {
    optimisticDelete(savedJobId);
    await deleteSavedjob(savedJobId);
  }

  // COMPACT STYLE
  return (
    <div className="space-y-8">
      {/* Section: Saved Jobs */}
      <section>
        <h3 className="text-xl font-semibold mt-10 mb-4">Saved Jobs</h3>

        {optimisticSavedJob.length === 0 ? (
          <p>You haven&apos;t saved any jobs yet!</p>
        ) : (
          <ul className="divide-y divide-primary-700">
            {optimisticSavedJob.map(({ id, jobs }) => (
              <li key={id} className="flex items-center justify-between py-4">
                {/* Left side: logo + info */}
                <div className="flex items-center gap-4">
                  <Image
                    width={56}
                    height={56}
                    quality={90}
                    src={jobs.image}
                    alt={jobs.companyName}
                    className="h-14 w-14 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold">{jobs.title}</h4>
                    <p className="text-sm text-primary-300">
                      {jobs.companyName} — {jobs.location}
                    </p>
                  </div>
                </div>

                {/* Right side: salary + action */}
                <div className="flex items-center gap-6">
                  <p className="text-accent-400 font-medium">
                    {`${formatCurrency(jobs.averageSalary)}/yr`}
                  </p>
                  <Link
                    href={`/jobs/${jobs.id}`}
                    className="text-sm text-accent-400 hover:underline"
                  >
                    View
                  </Link>
                  <DeleteSavedJob savedJobId={id} onDelete={handleDelete} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SeekerDashboard;
