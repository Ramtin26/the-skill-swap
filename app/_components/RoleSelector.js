"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateRole } from "@/app/_lib/actions";
import {
  BuildingOfficeIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/solid";
import SpinnerMini from "./SpinnerMini";
import Spinner from "./Spinner";

function RoleSelector() {
  const { data: session, status, update } = useSession();
  console.log("session:", session);
  console.log("status:", status);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState(null);

  if (status === "loading") {
    return (
      <div className="grid justify-center items-center">
        <Spinner />
      </div>
    );
  }

  const handleRoleSelection = (role) => {
    setSelectedRole(role);

    startTransition(async () => {
      try {
        await updateRole(role);

        // Update session object with new role
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
    <div className=" sm:mx-auto sm:w-full sm:max-w-md bg-primary-900 mt-10 py-8 px-4 sm:rounded-lg sm:px-10">
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-center text-3xl font-semibold mb-2">
          Welcome to SkillSwap! 👋
        </h2>
        <p className="text-center font-medium text-sm mb-6">
          What brings you here today?
        </p>
      </div>

      <div className="space-y-4 flex flex-col items-center">
        <button
          onClick={() => handleRoleSelection("seeker")}
          disabled={isPending}
          className="group w-full flex items-center gap-1 justify-center px-4 py-6 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition cursor-pointer"
        >
          {!isSeekerLoading ? (
            <>
              <MagnifyingGlassCircleIcon className="h-6 w-6  group-hover:text-primary-800 transition-colors" />
              <span className="font-medium">
                I&apos;m looking for opportunities
              </span>
            </>
          ) : (
            <span className="mx-auto">
              <SpinnerMini />
            </span>
          )}

          {/* <MagnifyingGlassCircleIcon className="mr-2 w-6 h-6" />
              {isPending ? "Setting up..." : "I'm looking for opportunities"} */}
        </button>
        <button
          onClick={() => handleRoleSelection("employer")}
          disabled={isPending}
          className="group w-full flex items-center justify-center gap-1 px-4 py-6 rounded-md text-base font-medium bg-warm-500 hover:bg-warm-600 focus:ring-2 focus:ring-offset-2 focus:ring-warm-500 transition cursor-pointer"
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
          {/* <BuildingOfficeIcon className="h-6 w-6 group-hover:text-primary-800" />
          {isPending ? "Setting up..." : "I'm hiring talent"} */}
        </button>
        <p className="text-xs text-primary-400 mt-4">
          Don&apos;t worry, you can change this anytime in your profile!
        </p>
      </div>
    </div>
  );
}

export default RoleSelector;
