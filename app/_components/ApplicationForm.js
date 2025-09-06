"use client";

import Image from "next/image";
import { useState } from "react";
import { DocumentArrowUpIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { SubmitButton } from "./SubmitButton";
import { createApplication } from "@/app/_lib/actions";

function ApplicationForm({ job, user }) {
  const [fileName, setFileName] = useState();

  return (
    <form
      action={createApplication}
      className="grid md:grid-cols-2 border border-primary-800 rounded-lg overflow-hidden"
    >
      {/* Left panel - Job recap */}
      <div className="bg-primary-950 p-6 flex flex-col gap-4 border-r border-primary-800">
        <div className="relative w-full h-40">
          <Image
            src={job.image}
            alt={`job: ${job.title}`}
            fill
            className="object-cover rounded-md"
          />
        </div>

        <h3 className="text-2xl font-semibold text-accent-400">{job.title}</h3>
        <p className="text-primary-300">{job.companyName}</p>

        <div className="text-sm text-primary-400 space-y-1">
          <p>
            <strong>Location:</strong> {job.location} ({job.locationType})
          </p>
          <p>
            <strong>Employment:</strong> {job.employmentType}
          </p>
          <p>
            <strong>Level:</strong> {job.positionLevel}
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {format(new Date(job.deadline), "EEE, MMM dd yyyy")}
          </p>
        </div>
      </div>

      {/* Right panel - Application form */}
      <div className="bg-primary-900 p-8 flex flex-col gap-6">
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
        <input type="hidden" name="seekerId" value={user.seekerId} />

        {/* Submit button */}
        <div className="pt-4">
          <SubmitButton pendingLabel="Submitting...">Apply Now</SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default ApplicationForm;
