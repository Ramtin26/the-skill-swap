import { getJobs } from "@/app/_lib/data-service";
import JobCard from "./JobCard";

async function JobList({ filter }) {
  const jobs = await getJobs();
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
      {displayedJobs.map((job) => (
        <JobCard job={job} key={job.id} />
      ))}
    </div>
  );
}

export default JobList;
