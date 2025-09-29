import CreateJobForm from "@/app/_components/CreateJobForm";
import PostedJobList from "@/app/_components/PostedJobList";
import { auth } from "@/app/_lib/auth";
import { getPostedJobs } from "@/app/_lib/data-service";

export const metadata = {
  title: "Posted jobs",
};

export default async function Page() {
  const session = await auth();
  const postedJobs = await getPostedJobs(session.user.id);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-semibold text-2xl sm:text-3xl text-accent-400 mb-7">
          Your posted jobs
        </h2>

        {postedJobs.length === 0 ? (
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <p>You have not posted any jobs yet. Post a job now &rarr;</p>
            <CreateJobForm />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <PostedJobList postedJobs={postedJobs} />
            </div>
            <CreateJobForm />
          </>
        )}
      </section>
    </div>
  );
}
