import { Suspense } from "react";
import { isAfter } from "date-fns";

import ApplicationForm from "@/app/_components/ApplicationForm";
import Job from "@/app/_components/Job";
import LoginMessage from "@/app/_components/LoginMessage";
import Spinner from "@/app/_components/Spinner";
import { auth } from "@/app/_lib/auth";
import {
  getAllApplications,
  getApplications,
  getJob,
  getJobs,
  getUser,
} from "@/app/_lib/data-service";

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

  const applications = user ? await getApplications(user.id) : [];
  const applicationsForThisJob = applications.find(
    (app) => app.jobs.id === jobId
  );

  const deadlineDate = new Date(job.deadline);
  const deadlinePassed = isAfter(new Date(), deadlineDate);

  const allApplications = await getAllApplications();
  const applicationsForThisJobAll = allApplications.filter(
    (app) => app.jobs.id === jobId
  );
  const hiresReached =
    job.maxHires && applicationsForThisJobAll.length > job.maxHires;

  return (
    <div className="max-w-6xl mx-auto mt-6 sm:mt-10">
      <Job job={job} />

      <div className="mt-8 sm:mt-12">
        {!session ? (
          <LoginMessage />
        ) : user?.role !== "seeker" ? (
          <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-accent-400">
            Only job seekers can apply for positions!
          </p>
        ) : deadlinePassed ? (
          <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-accent-400">
            Sorry, the application deadline for this job has passed!
          </p>
        ) : hiresReached ? (
          <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-accent-400">
            This position has already reached the maximum number of hires!
          </p>
        ) : (
          <>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center mb-6 sm:mb-10 text-accent-400">
              Ready to make your move?
            </h2>
            <Suspense fallback={<Spinner />}>
              <ApplicationForm
                job={job}
                user={user}
                resumePath={applicationsForThisJob?.resumePath}
                note={applicationsForThisJob?.note}
              />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
