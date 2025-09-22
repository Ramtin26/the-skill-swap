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
// 1) All components should be responsive and compatible with mobile phones and also optimize the logics in all components
// 2) the seeker id in the session object should be modified. (change to id or use role property with getUser to get the id)
// 3) saving job is broken
// 4) another issue is in the project 3's requirements file in desktop:      solution -> remove .next/cache from powershell with this "Remove-Item -Recurse -Force .next\cache" and re-run npm dev

// ok, I'll do it. I think auth.js is the first file we've added seekerId property to session project
// {
//     "user": {
//         "name": "Ramtin Hashemi",
//         "email": "ramtinhashemi3@gmail.com",
//         "image": "https://lh3.googleusercontent.com/a/ACg8ocL2WtxhWPg5rY7Cb1OPp_U5OM8QKqmOQBMjDDqWJTG0xXqFGzDI=s96-c",
//         "seekerId": "be52952e-78fc-4329-849b-923db86e3504",
//         "role": "seeker"
//     },
//     "expires": "2025-10-22T11:54:25.331Z"
// }

// so, changing the seekerId property name to id in the auth.j will be genug? I know there are so many files to edit, I mean essential and fundamental files like auth.js, actions.js, data-service.js, supabase.js, layout.js (main layout), page.js (main page) and so on.

// by the way, this is auth.js (/app/_lib)
