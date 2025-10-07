"use client";

import { useState } from "react";
import Image from "next/image";
import { PencilIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

import DeletePostedJob from "./DeletePostedJob";
import CreateJobForm from "./CreateJobForm";

function PostedjobCard({ postedJob, onDelete }) {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <li>
      <div className="bg-primary-900 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start shadow-md shadow-accent-800">
        {/* Job image */}
        <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
          <Image
            src={postedJob.image}
            alt={postedJob.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Job details */}
        <div className="flex-1 space-y-2 text-primary-200 min-w-0">
          <h3 className="font-semibold text-lg sm:text-xl text-accent-400">
            {postedJob.title}
          </h3>
          <p className="text-base">{postedJob.companyName}</p>
          <p className="text-sm text-primary-400 break-words">
            {postedJob.locationType} · {postedJob.location}
          </p>
          <p className="text-sm text-primary-400 break-words">
            {postedJob.employmentType} · {postedJob.positionLevel}
          </p>
          <p className="text-sm text-primary-400">
            Salary: ${postedJob.averageSalary} · Max Hires: {postedJob.maxHires}
          </p>
          <p className="text-sm font-bold text-primary-500">
            Deadline: {format(new Date(postedJob.deadline), "PPP")}
          </p>
          <p className="text-sm text-primary-300 line-clamp-3">
            {postedJob.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-row justify-end sm:flex-col gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowEditForm(true)}
            className="p-2 bg-accent-800 rounded-xl hover:bg-accent-700 transition-colors cursor-pointer"
          >
            <PencilIcon className="w-5 h-5 text-accent-300" />
          </button>
          {showEditForm && (
            <CreateJobForm
              job={postedJob}
              onClose={() => setShowEditForm(false)}
            />
          )}
          <DeletePostedJob jobId={postedJob.id} onDelete={onDelete} />
        </div>
      </div>
    </li>
  );
}

export default PostedjobCard;
