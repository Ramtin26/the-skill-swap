import Image from "next/image";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/solid";
import { formatCurrency } from "@/app/helper/helper";

function SeekerDashboard({ savedJobs }) {
  return (
    <div className="space-y-8 px-2 sm:px-0">
      <section>
        <h3 className="text-lg sm:text-xl font-semibold mt-8 sm:mt-10 mb-4">
          Your saved jobs
        </h3>

        {savedJobs.length === 0 ? (
          <p>You haven&apos;t saved any jobs yet!</p>
        ) : (
          <ul className="divide-y divide-primary-700">
            {savedJobs.map(({ id, jobs }) => (
              <li
                key={id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-5 px-2 sm:px-4 gap-4 sm:gap-6"
              >
                {/* Left side */}
                <div className="flex items-center gap-4 flex-1">
                  <Image
                    width={56}
                    height={56}
                    quality={90}
                    src={jobs.image}
                    alt={jobs.companyName}
                    className="h-14 w-14 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold break-words">{jobs.title}</h4>
                    <p className="text-sm text-primary-300">
                      {jobs.companyName} — {jobs.location}
                    </p>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                  <p className="text-accent-400 font-medium whitespace-nowrap">
                    {`${formatCurrency(jobs.averageSalary)}/yr`}
                  </p>
                  <Link
                    href={`/jobs/${jobs.id}`}
                    className="text-sm text-accent-400 hover:text-accent-500 flex gap-1"
                  >
                    <span>
                      <EyeIcon className="h-5 w-5" />
                    </span>
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SeekerDashboard;
