import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { JobsProvider } from "./_components/JobsContext";

import Header from "@/app/_components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

import "@/app/_styles/globals.css";
import { auth } from "./_lib/auth";
import { getSavedJobs, getUser } from "./_lib/data-service";

export const metadata = {
  title: {
    template: "%s / The Skill Swap",
    default: "Welcome / The Skill Swap",
  },
  description:
    "SkillSwap is a modern job marketplace connecting employers with skilled job seekers. Post jobs, apply for positions, and track applications in a simple, professional platform.",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  const user = session ? await getUser(session?.user?.email) : null;
  const savedJobIds =
    user?.role === "seeker" ? await getSavedJobs(user.id) : [];

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col relative`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <SessionProvider>
              <JobsProvider initialSavedIds={savedJobIds} seekerId={user.id}>
                {children}
              </JobsProvider>
            </SessionProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
