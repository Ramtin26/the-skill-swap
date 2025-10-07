"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";

import SignOutButton from "./SignOutButton";

function SideNavigation({ role }) {
  const pathName = usePathname();
  const { status } = useSession();

  if (status === "loading") {
    return (
      <nav className="border-r border-primary-900">
        <div className="animate-pulse p-4">
          <div className="h-4 bg-primary-800 rounded mb-4"></div>
          <div className="h-4 bg-primary-800 rounded mb-4"></div>
          <div className="h-4 bg-primary-800 rounded mb-4"></div>
        </div>
      </nav>
    );
  }

  const currentUserRole = role;

  const getNavLinks = () => {
    const basicLinks = {
      name: "Home",
      href: "/dashboard",
      icon: <HomeIcon className="h-5 w-5 text-primary-600" />,
    };

    const roleSpecificRole =
      currentUserRole === "seeker"
        ? {
            name: "Applications",
            href: "/dashboard/applications",
            icon: (
              <ClipboardDocumentListIcon className="h-5 w-5 text-primary-600" />
            ),
          }
        : {
            name: "Posted jobs",
            href: "/dashboard/postedJobs",
            icon: (
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-primary-600" />
            ),
          };

    const profileLink = {
      name: "User profile",
      href: "/dashboard/profile",
      icon: <UserIcon className="h-5 w-5 text-primary-600" />,
    };

    return [basicLinks, roleSpecificRole, profileLink];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="border-r border-primary-900 h-full flex flex-col">
      <ul className="flex flex-col gap-1 sm:gap-2 text-base sm:text-lg">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`flex items-center gap-3 py-2 sm:py-3 px-3 sm:px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors font-semibold text-primary-200 ${
                pathName === link.href ? "bg-primary-900" : ""
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}

        <li className="mt-8 sm:mt-12">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
