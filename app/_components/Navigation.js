import Link from "next/link";
import { auth } from "@/app/_lib/auth";
import Image from "next/image";

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/jobs"
            className="hover:text-accent-400 transition-colors"
          >
            Jobs
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <Link
              href="/dashboard"
              className="hover:text-accent-400 transition-colors flex items-center gap-4"
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
            <Link
              href="/dashboard"
              className="hover:text-accent-400 transition-colors"
            >
              My dashboard
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
