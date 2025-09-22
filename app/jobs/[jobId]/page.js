import { Suspense } from "react";
import { isAfter, isBefore } from "date-fns";

import Job from "@/app/_components/Job";
import Spinner from "@/app/_components/Spinner";
import { auth } from "@/app/_lib/auth";
import {
  getAllApplications,
  getApplications,
  getJob,
  getJobs,
  getSavedJobs,
  getUser,
} from "@/app/_lib/data-service";
import LoginMessage from "@/app/_components/LoginMessage";
import ApplicationForm from "@/app/_components/ApplicationForm";

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
  const applications = await getApplications(user.id);
  const applicationsForThisJob = applications.find(
    (app) => app.jobs.id === jobId
  );

  const deadlineDate = new Date(job.deadline); // stays the exact instant in UTC
  const now = new Date();

  const deadlinePassed = isAfter(now, deadlineDate); // true only when NOW > deadline

  // const deadlinePassed = isBefore(new Date(job.deadline), new Date());
  // console.log(deadlinePassed);

  const allApplications = await getAllApplications(); // fetch all apps, not just by this user
  const applicationsForThisJobAll = allApplications.filter(
    (app) => app.jobs.id === jobId
  );
  const hiresReached =
    job.maxHires && applicationsForThisJobAll.length >= job.maxHires;

  // console.log(applicationsForThisJobAll);
  // console.log(hiresReached);

  // console.log(job.maxHires);
  // console.log(applications);
  // console.log(applicationsForThisJob);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Job job={job} />

      <div>
        {!session ? (
          // CASE 1: Not logged in
          <LoginMessage />
        ) : user?.role !== "seeker" ? (
          // CASE 2: Logged in but employer
          <p className="text-5xl font-semibold text-center text-accent-400">
            Only job seekers can apply for positions!
          </p>
        ) : deadlinePassed ? (
          // CASE 3: Seeker but deadline passed
          <p className="text-5xl font-semibold text-center text-accent-400">
            Sorry, the application deadline for this job has passed!
          </p>
        ) : hiresReached ? (
          <p className="text-5xl font-semibold text-center text-accent-400">
            This position has already reached the maximum number of hires!
          </p>
        ) : (
          // CASE 4: Seeker + deadline active → show form
          <>
            <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
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
