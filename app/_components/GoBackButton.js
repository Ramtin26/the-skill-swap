"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary-800 hover:bg-primary-900 p-2 sm:p-3 md:p-4 rounded-full shadow-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-950"
      aria-label="Go back"
    >
      <ArrowLeftIcon className="h-5 w-5 text-white" />
    </button>
  );
}
