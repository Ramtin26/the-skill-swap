"use client";

import { useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

import StarRating from "./StarRating";
import { updateRating } from "@/app/_lib/actions";

import DownloadResumeButton from "./DownloadResumeButton";
import EvaluateButton from "./EvaluateButton";

function EmployerApplicationCard({ application }) {
  const { id, created_at, resumeURL, status, rating, jobs, users } =
    application;
  const [showRating, setShowRating] = useState(rating !== null);
  const [currentStatus, setCurrentStatus] = useState(status);

  async function handleRatingChange(newRating) {
    await updateRating({ applicationId: id, rating: newRating });
    setShowRating(true);
  }

  async function handleAccept() {
    if (jobs.maxHires < 1) return;
    // try {
    await updateStatus({ applicationId: id, status: "accepted" });
    await updateMaxHires({ jobId: jobs.id });
    setCurrentStatus("accepted");
    // } catch (err) {
    //   console.error("Failed to accept application:", err);
    // }
  }

  async function handleReject() {
    // try {
    await updateStatus({ applicationId: id, status: "rejected" });
    setCurrentStatus("rejected");
    // } catch (err) {
    //   console.error("Failed to reject application:", err);
    // }
  }

  return (
    <li className="flex items-center justify-between py-4">
      {/* Left: Job info */}
      <div>
        <h4 className="font-semibold">{jobs.title}</h4>
        <p className="text-sm text-primary-300">{jobs.companyName}</p>
        <span className="text-sm text-primary-300">
          Remaining Capacity: {jobs.maxHires}
        </span>

        <p className="text-xs text-primary-400">
          Applied by <strong>{users.fullName} </strong>on{" "}
          {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-4">
        {/* Resume download */}
        {resumeURL && <DownloadResumeButton resumeURL={resumeURL} />}

        {/* Rating */}
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

        {/* Status */}
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium
          ${currentStatus === "accepted" ? "bg-green-700 text-green-200" : ""}
          ${currentStatus === "rejected" ? "bg-red-700 text-red-200" : ""}
          ${
            currentStatus === "in-review"
              ? "bg-primary-700 text-primary-200"
              : ""
          }
          `}
        >
          {currentStatus}
        </span>

        {/* Action buttons */}
        <EvaluateButton
          onStatus={setCurrentStatus}
          handleEvaluate={handleAccept}
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
      </div>
    </li>
  );
}

export default EmployerApplicationCard;
