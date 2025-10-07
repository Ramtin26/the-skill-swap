import Link from "next/link";

export default function Page() {
  return (
    <div className="mt-4 text-center space-y-4 sm:space-y-6 px-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary-100">
        Job created successfully
      </h1>
      <Link
        href="/dashboard/postedJobs"
        className="inline-block underline text-lg sm:text-xl text-accent-500 hover:text-accent-400 transition-colors"
      >
        View your posted jobs &rarr;
      </Link>
    </div>
  );
}
