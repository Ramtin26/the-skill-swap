"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BuildingOfficeIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/solid";

import { updateRole } from "@/app/_lib/actions";
import SpinnerMini from "./SpinnerMini";
import Spinner from "./Spinner";

function RoleSelector() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState(null);

  if (status === "loading") {
    return (
      <div className="grid place-items-center h-48">
        <Spinner />
      </div>
    );
  }

  const handleRoleSelection = (role) => {
    setSelectedRole(role);

    startTransition(async () => {
      try {
        await updateRole(role);
        await update({
          ...session,
          user: { ...(session?.user ?? {}), role },
        });

        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
        setSelectedRole(null);
      }
    });
  };

  const isSeekerLoading = isPending && selectedRole === "seeker";
  const isEmployerLoading = isPending && selectedRole === "employer";

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md bg-primary-900 mt-8 sm:mt-10 py-6 sm:py-8 px-4 sm:px-8 rounded-lg">
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-2">
          Welcome to SkillSwap! 👋
        </h2>
        <p className="text-center font-medium text-sm sm:text-base mb-6">
          What brings you here today?
        </p>
      </div>

      <div className="space-y-4 flex flex-col items-center w-full">
        <button
          onClick={() => handleRoleSelection("seeker")}
          disabled={isPending}
          className="group w-full flex items-center gap-2 justify-center px-4 py-5 sm:py-6 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition cursor-pointer"
        >
          {!isSeekerLoading ? (
            <>
              <MagnifyingGlassCircleIcon className="h-6 w-6 group-hover:text-primary-800 transition-colors" />
              <span>I&apos;m looking for opportunities</span>
            </>
          ) : (
            <span className="mx-auto">
              <SpinnerMini />
            </span>
          )}
        </button>

        <button
          onClick={() => handleRoleSelection("employer")}
          disabled={isPending}
          className="group w-full flex items-center gap-2 justify-center px-4 py-5 sm:py-6 rounded-md text-base font-medium bg-warm-500 hover:bg-warm-600 focus:ring-2 focus:ring-offset-2 focus:ring-warm-500 transition cursor-pointer"
        >
          {!isEmployerLoading ? (
            <>
              <BuildingOfficeIcon className="h-6 w-6 group-hover:text-primary-800 transition-colors" />
              <span>I&apos;m hiring talent</span>
            </>
          ) : (
            <span className="mx-auto">
              <SpinnerMini />
            </span>
          )}
        </button>

        <p className="text-xs sm:text-sm text-primary-400 mt-4 text-center">
          Don&apos;t worry, you can change this anytime in your profile!
        </p>
      </div>
    </div>
  );
}

export default RoleSelector;
