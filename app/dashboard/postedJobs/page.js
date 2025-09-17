import CreateJobForm from "@/app/_components/CreateJobForm";
import PostedJobList from "@/app/_components/PostedJobList";
import { auth } from "@/app/_lib/auth";
import { getPostedJobs } from "@/app/_lib/data-service";

export const metadata = {
  title: "Posted jobs",
};

export default async function Page() {
  const session = await auth();
  const postedJobs = await getPostedJobs(session.user.seekerId);

  // console.log(session.user);
  // console.log(postedJobs);
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
          Your posted jobs
        </h2>

        {postedJobs.length === 0 ? (
          <div className="flex gap-2 items-center">
            <p>You have not posted any jobs yet. Post a job now &rarr;</p>
            <CreateJobForm employerId={session.user.seekerId} />
          </div>
        ) : (
          <>
            <PostedJobList postedJobs={postedJobs} />
            <CreateJobForm employerId={session.user.seekerId} />
          </>
        )}
      </section>
    </div>
  );
}
