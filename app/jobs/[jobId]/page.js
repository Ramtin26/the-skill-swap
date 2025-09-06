import { Suspense } from "react";
import { isBefore } from "date-fns";

import Application from "@/app/_components/Applicaton";
import Job from "@/app/_components/Job";
import Spinner from "@/app/_components/Spinner";
import { auth } from "@/app/_lib/auth";
import { getJob, getJobs, getUser } from "@/app/_lib/data-service";

export async function generateMetadata({ params }) {
  const { jobId } = await params;
  const { title } = await getJob(jobId);
  return {
    title: `Position: ${title}`,
  };
}

export async function generateStaticParams() {
  const jobs = await getJobs();

  const ids = jobs.map((job) => ({ jobId: String(job.id) }));

  return ids;
}

export default async function Page({ params }) {
  const { jobId } = await params;
  const job = await getJob(jobId);

  const session = await auth();
  const user = session ? await getUser(session?.user?.email) : null;

  const deadlinePassed = isBefore(new Date(job.deadline), new Date());

  const canApply = user?.role === "seeker" && !deadlinePassed;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Job job={job} />

      <div>
        {canApply ? (
          <>
            <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
              Ready to make your move?
            </h2>

            <Suspense fallback={<Spinner />}>
              <Application job={job} />
            </Suspense>
          </>
        ) : (
          <p className="text-5xl font-semibold text-center text-accent-400">
            {deadlinePassed
              ? "Sorry, the application deadline for this job has passed!"
              : "Only job seekers can apply for positions!"}
          </p>
        )}
      </div>
    </div>
  );
}
