"use client";

import { useEffect, useState } from "react";
import { CheckIcon, StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

import StarRating from "./StarRating";
import {
  updateMaxHires,
  updateRating,
  updateStatus,
  getAverageRating,
} from "@/app/_lib/actions";

import DownloadResumeButton from "./DownloadResumeButton";
import EvaluateButton from "./EvaluateButton";

function EmployerApplicationCard({ application }) {
  const { id, created_at, resumePath, status, rating, jobs, users } =
    application;

  const [showRating, setShowRating] = useState(rating !== null);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [averageRating, setAverageRating] = useState(null);
  const [errorMesg, setErrorMesg] = useState("");

  // console.log(application);

  // 🔹 Fetch the seeker’s average when the card mounts
  useEffect(() => {
    async function fetchAvg() {
      try {
        const avg = await getAverageRating(users.id); // seekerId is users.id
        setAverageRating(avg);
      } catch (err) {
        console.error("Failed to load avg rating", err);
      }
    }
    fetchAvg();
  }, [users.id]);

  async function handleRatingChange(newRating) {
    // update rating for this specific application
    await updateRating({ applicationId: id, rating: newRating });

    // 🔹 refresh the seeker’s overall average after update
    const newAvg = await getAverageRating(users.id);
    setShowRating(true);
    setAverageRating(newAvg);
  }

  async function handleAccept() {
    if (jobs.maxHires < 1) {
      setErrorMesg("No capacity is left for this job");
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
    <li className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-x-6 gap-y-3 items-center py-4 border-b border-primary-700">
      {/* LEFT COLUMN – job info spans both main rows */}
      <div className="space-y-1 col-start-1 row-span-2">
        <h4 className="font-semibold">{jobs.title}</h4>
        <p className="text-sm text-primary-300">{jobs.companyName}</p>
        <span className="text-sm text-primary-300 flex flex-col gap-1">
          Remaining Capacity: {jobs.maxHires}
          {errorMesg && (
            <p className="text-xs text-red-400 font-medium">{errorMesg}</p>
          )}
        </span>

        <p className="text-xs text-primary-400 flex items-center gap-1 relative group">
          Applied by <strong>{users.fullName}</strong>
          {averageRating !== null && (
            <span className="text-primary-400 cursor-pointer relative">
              <StarIcon className="h-3 w-3 text-yellow-400" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded-md bg-primary-800 px-2 py-1 text-xs text-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                Avg rating: {averageRating}/5
              </span>
            </span>
          )}
          on {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
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
            className="text-sm text-accent-400 hover:underline cursor-pointer"
          >
            Wanna rate this applicant?
          </button>
        )}
      </div>

      {/* RIGHT COL – row 2: status + evaluate */}
      <div className="flex justify-end items-center gap-3 col-start-2 row-start-2">
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium
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
              onStatus={setCurrentStatus}
              handleEvaluate={handleAccept}
              disabled={jobs.maxHires < 1}
              style="text-green-400 border-green-500 hover:bg-green-600/20"
            >
              <CheckIcon className="h-4 w-4" /> Accept
            </EvaluateButton>

            <EvaluateButton
              onStatus={setCurrentStatus}
              handleEvaluate={handleReject}
              style="text-red-400 border-red-500 hover:bg-red-600/20"
            >
              <XMarkIcon className="h-4 w-4" /> Reject
            </EvaluateButton>
          </>
        )}
      </div>
    </li>
  );
}

export default EmployerApplicationCard;
