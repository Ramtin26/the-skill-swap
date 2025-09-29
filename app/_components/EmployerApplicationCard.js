"use client";

import { useEffect, useState } from "react";
import { CheckIcon, StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

import {
  updateMaxHires,
  updateRating,
  updateStatus,
  getAverageRating,
} from "@/app/_lib/actions";

import StarRating from "./StarRating";
import DownloadResumeButton from "./DownloadResumeButton";
import EvaluateButton from "./EvaluateButton";

function EmployerApplicationCard({ application }) {
  const { id, created_at, resumePath, status, rating, jobs, users } =
    application;

  const [showRating, setShowRating] = useState(rating !== null);
  const [currentStatus, setCurrentStatus] = useState(status ?? "in-review");
  const [averageRating, setAverageRating] = useState(null);
  const [errorMesg, setErrorMesg] = useState("");

  useEffect(() => {
    async function fetchAvg() {
      try {
        const avg = await getAverageRating(users.id);
        setAverageRating(avg);
      } catch (err) {
        console.error("Failed to load avg rating", err);
      }
    }
    fetchAvg();
  }, [users.id]);

  async function handleRatingChange(newRating) {
    await updateRating({ applicationId: id, rating: newRating });

    const newAvg = await getAverageRating(users.id);
    setShowRating(true);
    setAverageRating(newAvg);
  }

  async function handleAccept() {
    if (jobs.maxHires < 1) {
      setErrorMesg("No capacity is left for this job");
      return;
    }

    await updateStatus({ applicationId: id, status: "accepted" });
    await updateMaxHires({ jobId: jobs.id });
    setCurrentStatus("accepted");
  }

  async function handleReject() {
    await updateStatus({ applicationId: id, status: "rejected" });
    setCurrentStatus("rejected");
  }

  const decisionMade =
    currentStatus === "accepted" || currentStatus === "rejected";

  return (
    <li className="grid grid-cols-1 sm:grid-cols-[1fr_auto] sm:grid-rows-[auto_auto] gap-3 sm:gap-x-6 sm:gap-y-3 items-center py-4">
      {/* LEFT COLUMN – job info spans both main rows */}
      <div className="space-y-1 col-start-1 row-span-2">
        <h4 className="font-semibold text-sm sm:text-base md:text-lg">
          {jobs.title}
        </h4>
        <p className="text-sm text-primary-300">{jobs.companyName}</p>
        <div className="text-sm text-primary-300 flex flex-col gap-1">
          <span>Remaining Capacity: {jobs.maxHires}</span>
          {errorMesg && (
            <p className="text-xs text-red-400 font-medium">{errorMesg}</p>
          )}
        </div>

        <p className="text-xs sm:text-sm text-nowrap text-primary-400 flex items-center gap-1">
          Applied by <strong>{users.fullName}</strong>
          {/* hover tooltip */}
          {averageRating !== null && (
            <span
              title={`Avg rating: ${averageRating}/5`}
              className="relative group flex items-center cursor-pointer"
            >
              <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded-md bg-primary-800 text-primary-100 px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                Avg rating: {averageRating}/5
              </span>
            </span>
          )}
          <span>On {format(new Date(created_at), "EEE, MMM dd yyyy, p")}</span>
        </p>
      </div>

      {/* RIGHT COL – row 1: download + rating */}
      <div className="flex justify-end items-center gap-3 col-start-2 row-start-1">
        {resumePath && (
          <DownloadResumeButton
            resumeURL={resumePath}
            jobTitle={jobs.title}
            fullName={users.fullName}
          />
        )}

        {showRating ? (
          <StarRating
            initialRating={rating ?? 0}
            onSetRating={handleRatingChange}
          />
        ) : (
          <button
            onClick={() => setShowRating(true)}
            className="text-sm sm:text-sm text-accent-400 hover:underline cursor-pointer"
          >
            Wanna rate this applicant?
          </button>
        )}
      </div>

      {/* RIGHT COL – row 2: status + evaluate */}
      <div className="flex justify-end items-center gap-2 sm:gap-3 col-start-2 row-start-2">
        <span
          className={`px-2 py-1 rounded-lg text-xs sm:text-sm font-medium
      ${currentStatus === "accepted" ? "bg-green-700 text-green-200" : ""}
      ${currentStatus === "rejected" ? "bg-red-700 text-red-200" : ""}
      ${
        currentStatus === "in-review" ? "bg-primary-700 text-primary-200" : ""
      }`}
        >
          {currentStatus}
        </span>

        {!decisionMade && (
          <>
            <EvaluateButton
              handleEvaluate={handleAccept}
              disabled={jobs.maxHires < 1}
              style="text-green-400 border-green-500 hover:bg-green-600/20"
            >
              <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Accept</span>
            </EvaluateButton>

            <EvaluateButton
              handleEvaluate={handleReject}
              style="text-red-400 border-red-500 hover:bg-red-600/20"
            >
              <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Reject</span>
            </EvaluateButton>
          </>
        )}
      </div>
    </li>
  );
}

export default EmployerApplicationCard;
