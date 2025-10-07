import { Suspense } from "react";
import Filter from "@/app/_components/Filter";
import JobList from "@/app/_components/JobList";
import Spinner from "@/app/_components/Spinner";

// export const revalidate = 3600;

export const metadata = {
  title: "Jobs",
};

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const filter = params?.locationType ?? "all";

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-5 text-accent-400 font-medium">
        Find Your Perfect Match
      </h1>
      <p className="text-primary-200 text-base sm:text-lg lg:text-xl mb-10 max-w-4xl">
        Discover your next career opportunity or connect talented professionals
        with your team. Browse through curated job postings from leading
        companies or post your own openings to reach qualified candidates. Start
        your journey today—whether you&apos;re seeking the perfect role or the
        perfect hire.
      </p>

      <div className="flex justify-center lg:justify-end mb-8">
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        <JobList filter={filter} />
      </Suspense>
    </div>
  );
}
