import EmployerDashboard from "@/app/_components/EmployerDashboard";
import SeekerDashboard from "@/app/_components/SeekerDashboard";
import { auth } from "@/app/_lib/auth";
import {
  getApplicationsForEmployers,
  getSavedJobs,
  getUser,
} from "@/app/_lib/data-service";

export const metadata = {
  title: "dashboard",
};

export default async function Page() {
  const session = await auth();
  const user = await getUser(session?.user?.email);
  const savedJobs = (await getSavedJobs(user.id)) ?? [];

  const employerApplications =
    user.role === "employer"
      ? await getApplicationsForEmployers(session.user.id)
      : null;

  const firstName = user.fullName?.split(" ").at(0);

  return (
    <div>
      <h2 className="font-semibold text-2xl sm:text-3xl text-accent-400 mb-7">
        Welcome, {firstName}
      </h2>

      {user.role === "seeker" ? (
        <SeekerDashboard savedJobs={savedJobs} />
      ) : (
        <EmployerDashboard applications={employerApplications} />
      )}
    </div>
  );
}
