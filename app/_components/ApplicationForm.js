"use client";

import { useState } from "react";
import { AtSymbolIcon, DocumentArrowUpIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { SubmitButton } from "./SubmitButton";
import { createApplication } from "@/app/_lib/actions";

function ApplicationForm({ job, user }) {
  const [fileName, setFileName] = useState();
  console.log("Job:", job);
  console.log("user:", user);

  return (
    <form
      action={createApplication}
      className="bg-primary-900 border border-primary-800 rounded-2xl p-8 flex flex-col gap-6 max-w-2xl mx-auto"
    >
      {/* --- Slim Job Meta Bar --- */}
      <div className="border-b border-primary-700 pb-4 mb-2">
        <div className="flex gap-2 items-center">
          <h3 className="text-2xl font-semibold">{job.title}</h3>
          <span className="text-primary-400 flex gap-1 items-center text-xl">
            {" "}
            <span>
              <AtSymbolIcon className="h-5 w-5" />
            </span>{" "}
            {job.companyName}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1 text-sm text-primary-400">
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
        <div className="relative border-2 border-dashed border-primary-600 rounded-lg p-6 text-center hover:border-accent-500 transition-colors">
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
            required
          />
          <DocumentArrowUpIcon className="mx-auto w-10 h-10 text-primary-500" />
          <p className="text-primary-400 mt-2">
            {fileName || "Drag & drop or click to upload"}
          </p>
          <small className="text-primary-400">Max 5MG size</small>
        </div>
      </div>

      {/* Note to employer */}
      <div>
        <label className="block mb-2 font-medium text-primary-200">
          Note to Employer
        </label>
        <textarea
          name="note"
          rows={4}
          maxLength={500}
          required
          placeholder="Why are you a great fit for this role?"
          className="w-full px-4 py-3 rounded-md bg-primary-200 text-primary-800 placeholder-primary-500"
        />
        <small className="text-primary-400">Max 500 characters</small>
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="jobId" value={job.id} />
      <input type="hidden" name="seekerId" value={user.id} />
      <input type="hidden" name="fullName" value={user.fullName} />

      {/* Submit button */}
      <div className="pt-4 flex justify-center">
        <SubmitButton pendingLabel="Submitting...">Apply Now</SubmitButton>
      </div>
    </form>
  );
}

export default ApplicationForm;
