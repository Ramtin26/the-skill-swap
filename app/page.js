import Image from "next/image";
import Link from "next/link";
import bg from "/public/bg.png";

export default function Page() {
  return (
    <main className="mt-12 sm:mt-16 md:mt-24">
      <Image
        src={bg}
        fill
        placeholder="blur"
        quality={80}
        className="object-cover object-top"
        alt="Office building in the middle of a city"
      />
      <div className="relative z-10 text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl text-primary-50 mb-6 md:mb-10 tracking-tight font-normal px-4">
          Your Next Opportunity Starts Here.
        </h1>
        <Link
          href="/jobs"
          className="bg-accent-500 px-6 py-3 sm:px-8 sm:py-4 text-primary-800 text-base sm:text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Browse jobs
        </Link>
      </div>
    </main>
  );
}
