import Link from "next/link";

function NotFound() {
  return (
    <main className="text-center space-y-4 sm:space-y-6 mt-6 px-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
        This page could not be found :(
      </h1>
      <Link
        href="/"
        className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg"
      >
        Go back home
      </Link>
    </main>
  );
}

export default NotFound;
