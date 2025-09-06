import Image from "next/image";
// import bg from "@/public/bg.png";
import bg from "/public/bg.png";
import Link from "next/link";

export default function Page() {
  return (
    /* relative added (could be deleted) */
    <main className="mt-24">
      <Image
        src={bg}
        fill
        placeholder="blur"
        quality={80}
        className="object-cover object-top"
        alt="Office building in the middle of a city"
      />
      <div className="relative z-10 text-center">
        <h1 className="text-8xl text-primary-50 mb-10 tracking-tight font-normal">
          Your Next Opportunity Starts Here.
        </h1>
        <Link
          href="/jobs"
          className="bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Browse jobs
        </Link>
      </div>
    </main>
  );
}

// MUST ASK AT THE END

// All components should be responsive and compatible with mobile phones
