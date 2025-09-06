"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-4 left-4 bg-primary-800 hover:bg-primary-900 p-3 rounded-full shadow-md transition-colors cursor-pointer"
      aria-label="Go back"
    >
      <ArrowLeftIcon className="h-5 w-5 text-white" />
    </button>
  );
}
