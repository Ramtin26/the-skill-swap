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
// NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6emNjbXF0a25lb29zcXh2dm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTg4NTEsImV4cCI6MjA2OTI3NDg1MX0.Dhvp7VnjlTKZMUSk16Z0KQncLBSBD94RSEN6_VMLV-E

// MUST ASK AT THE END FIXME:
// 1) All components should be responsive and compatible with mobile phones
// 2) the seeker id in the session object should be modified. (change to id or use role property with getUser to get the id)
// 3) saving job is broken
// 4) showing/implementing average rating in seeker side/dashboard
// 5) getUser and getJobs/getJob in data-service are broken when HMR or hard-reload happens often
// 6) Test applying, edit application, delete application and accept and reject functionalities

// great, it looks nice.
// perfect, the application is done feature-wise. we've implemented all the features and whatnot. However, it's not officially finished, because there are some bugs, issues and some other things to consider left
