import Link from "next/link";
import ApplicationList from "@/app/_components/ApplicationList";
import { auth } from "@/app/_lib/auth";
import { getApplications } from "@/app/_lib/data-service";

export const metadata = {
  title: "Applications",
};

export default async function Page() {
  const session = await auth();
  const applications = await getApplications(session.user.id);

  return (
    <div className="px-4 sm:px-6">
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your applications
      </h2>

      {applications.length === 0 ? (
        <p className="text-lg">
          You have no applications yet. Check out the{" "}
          <Link className="underline text-accent-500" href="/jobs">
            job list &rarr;
          </Link>
        </p>
      ) : (
        <ApplicationList applications={applications} />
      )}
    </div>
  );
}
