import Applicaton from "@/app/_components/Applicaton";
import Job from "@/app/_components/Job";
import Spinner from "@/app/_components/Spinner";
import { getJob, getJobs } from "@/app/_lib/data-service";
import { Suspense } from "react";

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

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Job job={job} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Ready to make your move?
        </h2>

        <Suspense fallback={<Spinner />}>
          <Applicaton job={job} />
        </Suspense>
      </div>
    </div>
  );
}
