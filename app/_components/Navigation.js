import Link from "next/link";
import Image from "next/image";
import { auth } from "@/app/_lib/auth";

export default async function Navigation() {
  const session = await auth();

  const listStyle = "hover:text-accent-400 transition-colors";

  return (
    <nav className="z-10 text-base sm:text-lg md:text-xl">
      <ul className="flex flex-wrap gap-4 sm:gap-8 md:gap-12 lg:gap-16 items-center justify-end">
        <li>
          <Link href="/jobs" className={listStyle}>
            Jobs
          </Link>
        </li>
        <li>
          <Link href="/about" className={listStyle}>
            About
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <Link
              href="/dashboard"
              className={`${listStyle} flex items-center gap-2 sm:gap-3 md:gap-4`}
            >
              <Image
                width={32}
                height={32}
                quality={90}
                className="rounded-full"
                src={session.user.image}
                alt={session.user.name}
                referrerPolicy="no-referrer"
              />
              <span>My dashboard</span>
            </Link>
          ) : (
            <Link href="/dashboard" className={listStyle}>
              My dashboard
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
