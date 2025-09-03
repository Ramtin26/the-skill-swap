import { Suspense } from "react";
import JobList from "@/app/_components/JobList";
import Filter from "@/app/_components/Filter";
import Spinner from "@/app/_components/Spinner";

// export const revalidate = 3600;

export const metadata = {
  title: "Jobs",
};

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const filter = params?.locationType ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Find Your Perfect Match
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Discover your next career opportunity or connect talented professionals
        with your team. Browse through curated job postings from leading
        companies or post your own openings to reach qualified candidates. Start
        your journey today—whether you&apos;re seeking the perfect role or the
        perfect hire.
      </p>

      <div className="flex justify-end mb-8">
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        <JobList filter={filter} />
      </Suspense>
    </div>
  );
}
