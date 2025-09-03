"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import SignOutButton from "./SignOutButton";
import { useSession } from "next-auth/react";

// const navLinks = [
//   {
//     name: "Home",
//     href: "/dashboard",
//     icon: <HomeIcon className="h-5 w-5 text-primary-600" />,
//   },
//   {
//     // dynamic based on user's role
//     name: "Applications",
//     href: "/dashboard/applications",
//     icon: <ClipboardDocumentListIcon className="h-5 w-5 text-primary-600" />,
//   },
//   {
//     name: "PostedJobs",
//     href: "/dashboard/postedJobs",
//     icon: <ClipboardDocumentCheckIcon className="h-5 w-5 text-primary-600" />,
//   },
//   {
//     name: "User profile",
//     href: "/dashboard/profile",
//     icon: <UserIcon className="h-5 w-5 text-primary-600" />,
//   },
// ];

function SideNavigation({ role }) {
  const pathName = usePathname();
  const { status } = useSession();
  // console.log(session);

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
    <nav className="border-r border-primary-900">
      <ul className="flex flex-col gap-2 h-full text-lg">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              className={`py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 ${
                pathName === link.href ? "bg-primary-900" : ""
              }`}
              href={link.href}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}

        <li className="mt-auto">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
