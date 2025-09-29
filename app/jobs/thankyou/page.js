import Link from "next/link";

export default function Page() {
  return (
    // <div className="text-center space-y-6 mt-4">
    <div className="text-center space-y-6 mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-6 lg:px-8">
      {/* <h1 className="text-3xl font-semibold"> */}
      <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary-100">
        Thank you for submitting your application!
      </h1>
      {/* <Link
        href="/dashboard/applications"
        className="underline text-xl text-accent-500 inline-block"
      > */}
      <Link
        href="/dashboard/applications"
        className="inline-block underline text-lg sm:text-xl lg:text-2xl text-accent-500 hover:text-accent-400 transition-colors"
      >
        Manage your applications &rarr;
      </Link>
    </div>
  );
}
