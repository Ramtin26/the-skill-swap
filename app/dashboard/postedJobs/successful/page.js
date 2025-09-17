import Link from "next/link";

export default function Page() {
  return (
    <div className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold">Job created successfully</h1>
      <Link
        href="/jobs"
        className="underline text-xl text-accent-500 inline-block"
      >
        Go and see your job in the job list &rarr;
      </Link>
    </div>
  );
}
