import { auth } from "../_lib/auth";
import { getJobs, getSavedJobs, getUser } from "../_lib/data-service";
import JobCard from "./JobCard";

async function JobList({ filter }) {
  const jobs = await getJobs();
  const session = await auth();
  const user = session ? await getUser(session?.user?.email) : null;

  const savedJobIds =
    user?.role === "seeker" ? await getSavedJobs(user.id) : [];

  if (!jobs.length) return null;

  let displayedJobs;
  if (filter === "all") displayedJobs = jobs;
  if (filter === "remote")
    displayedJobs = jobs.filter((job) => job.locationType === "remote");
  if (filter === "in-office")
    displayedJobs = jobs.filter((job) => job.locationType === "in-office");
  if (filter === "hybrid")
    displayedJobs = jobs.filter((job) => job.locationType === "hybrid");

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedJobs.map((job) => (
        <JobCard
          job={job}
          seekerId={user?.role === "seeker" ? user.id : null}
          isSaved={savedJobIds.includes(job.id)}
          key={job.id}
        />
      ))}
    </div>
  );
}

export default JobList;
