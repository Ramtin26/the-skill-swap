"use client";

import { useState } from "react";
import { AtSymbolIcon, DocumentArrowUpIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import SubmitButton from "./SubmitButton";
import { createApplication } from "@/app/_lib/actions";

function ApplicationForm({ job, user, resumePath, note }) {
  const [fileName, setFileName] = useState(
    resumePath ? resumePath.split("/").pop() : null
  );

  return (
    <form
      action={createApplication}
      className="bg-primary-900 border border-primary-800 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-2xl mx-auto"
    >
      {/* Job Meta */}
      <div className="border-b border-primary-700 pb-4 mb-2">
        <div className="flex gap-2 items-center flex-wrap">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
            {job.title}
          </h3>
          <span className="text-primary-400 flex gap-1 items-center text-base sm:text-lg">
            <AtSymbolIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            {job.companyName}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1 text-xs sm:text-sm text-primary-400">
          <span>{job.location}</span>
          <span>
            Deadline:{" "}
            <span className="font-medium text-primary-300">
              {format(new Date(job.deadline), "PPP")}
            </span>
          </span>
        </div>
      </div>

      {/* Resume upload */}
      <div>
        <label className="block mb-2 font-medium text-primary-200">
          Resume (PDF only)
        </label>
        <div className="relative border-2 border-dashed border-primary-600 rounded-lg p-4 sm:p-6  text-center hover:border-accent-500 transition-colors">
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
            required
          />
          <DocumentArrowUpIcon className="mx-auto w-8 h-8 sm:w-10 sm:h-10 text-primary-500" />
          <p className="text-primary-400 mt-2 text-xs sm:text-sm">
            {fileName || "Drag & drop or click to upload"}
          </p>
          <small className="text-primary-400">Max 5MG size</small>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium text-primary-200">
          Note to Employer
        </label>
        <textarea
          name="note"
          rows={4}
          maxLength={500}
          required
          defaultValue={note || ""}
          placeholder="Why are you a great fit for this role?"
          className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-md bg-primary-200 text-primary-800 placeholder-primary-500 text-sm sm:text-base"
        />
        <small className="text-primary-400 text-xs">Max 500 characters</small>
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="jobId" value={job.id} />
      <input type="hidden" name="seekerId" value={user.id} />
      <input type="hidden" name="fullName" value={user.fullName} />

      {/* Submit button */}
      <div className="pt-2 sm:pt-4 flex justify-center">
        <SubmitButton pendingLabel="Submitting...">Apply Now</SubmitButton>
      </div>
    </form>
  );
}

export default ApplicationForm;
