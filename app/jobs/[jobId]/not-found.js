import Link from "next/link";

function NotFound() {
  return (
    <main className="text-center space-y-6 mt-6 sm:mt-10 px-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
        This job could not be found :(
      </h1>
      <Link
        href="/jobs"
        className="inline-block bg-accent-500 text-primary-800 px-5 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg rounded-md hover:bg-accent-400 transition-colors"
      >
        Go back to all jobs
      </Link>
    </main>
  );
}

export default NotFound;
