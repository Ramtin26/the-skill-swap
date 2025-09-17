"use client";

import { useState } from "react";
import { DocumentArrowUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { SubmitButton } from "./SubmitButton";
import { createUpdateJob } from "@/app/_lib/actions";

function CreateJobForm({ employerId, job, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState(null);

  const isEdit = Boolean(job);

  function handleClose() {
    if (isEdit) onClose?.();
    setIsOpen(false);
  }

  return (
    <div>
      {!isOpen && !isEdit && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-accent-500 text-primary-800 hover:bg-accent-600 rounded-lg font-semibold cursor-pointer"
        >
          Add Job
        </button>
      )}

      {(isOpen || isEdit) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-primary-900 border border-primary-700 rounded-2xl p-8 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-primary-400 hover:text-accent-400 cursor-pointer"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-accent-400 mb-6">
              {isEdit ? "Edit job" : "Post a New Job"}
            </h2>

            <form
              action={async (formData) => {
                await createUpdateJob(formData);
                handleClose();
              }}
              className="flex flex-col gap-6"
            >
              {/* Basics */}
              <div>
                <label className="block mb-2 font-medium">Job Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={job?.title}
                  className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  defaultValue={job?.companyName}
                  className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    defaultValue={job?.location.split(",").at(0)}
                    className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    defaultValue={job?.location.split(",").at(1)}
                    className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Location Type</label>
                <select
                  name="locationType"
                  required
                  defaultValue={job?.locationType}
                  className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                >
                  <option value="remote">Remote</option>
                  <option value="in-office">In-office</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Job details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Average Salary (per year)
                  </label>
                  <input
                    type="number"
                    name="averageSalary"
                    min="0"
                    required
                    defaultValue={job?.averageSalary}
                    className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Max Hires</label>
                  <input
                    type="number"
                    name="maxHires"
                    min="1"
                    required
                    defaultValue={job?.maxHires}
                    className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Position Level
                  </label>
                  <select
                    name="positionLevel"
                    required
                    defaultValue={job?.positionLevel}
                    className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                  >
                    <option value="junior">Junior</option>
                    <option value="mid-level">Mid-level</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    required
                    defaultValue={job?.employmentType}
                    className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block mb-2 font-medium">Deadline</label>
                <input
                  //   type="date"
                  type="datetime-local"
                  name="deadline"
                  required
                  defaultValue={
                    job
                      ? new Date(job.deadline).toISOString().slice(0, 16) // matches datetime-local format
                      : ""
                  }
                  className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  rows={5}
                  maxLength={500}
                  required
                  defaultValue={job?.description}
                  className="w-full px-4 py-2 rounded-md bg-primary-200 text-primary-800"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block mb-2 font-medium">Job Image</label>
                <div className="relative border-2 border-dashed border-primary-600 rounded-lg p-6 text-center hover:border-accent-500 transition-colors">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setFileName(e.target.files?.[0]?.name || null)
                    }
                  />
                  <DocumentArrowUpIcon className="mx-auto w-10 h-10 text-primary-500" />
                  <p className="text-primary-400 mt-2">
                    {fileName || job?.image || "Drag & drop or click to upload"}
                  </p>
                  <small className="text-primary-400">Max 5MB</small>
                </div>
              </div>

              {/* Hidden */}
              <input type="hidden" name="employerId" value={employerId} />
              {isEdit && <input type="hidden" name="id" value={job.id} />}

              {/* Submit */}
              <div className="pt-4 flex justify-center">
                <SubmitButton
                  pendingLabel={isEdit ? "Updating..." : "Posting..."}
                >
                  {isEdit ? "Update job" : "Post Now"}
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateJobForm;
