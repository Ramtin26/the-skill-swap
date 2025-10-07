"use client";

import { useState } from "react";
import { DocumentArrowUpIcon } from "@heroicons/react/24/solid";

function FileUpload({ name = "resume", resumePath, required = false }) {
  const [fileName, setFileName] = useState(resumePath?.split("/").pop());

  return (
    <div className="space-y-2">
      <label className="block mb-2 font-medium text-primary-200 text-sm sm:text-base">
        Resume (PDF only)
      </label>
      <div className="relative border-2 border-dashed border-primary-600 rounded-lg p-4 sm:p-6 text-center hover:border-accent-500 transition-colors">
        <input
          type="file"
          name={name}
          accept="application/pdf"
          required={required}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
        />
        <DocumentArrowUpIcon className="mx-auto w-8 h-8 sm:w-10 sm:h-10 text-primary-500" />

        <p className="text-primary-400 mt-2 break-words px-2">
          {fileName || "Drag & drop or click to upload"}
        </p>
        <small className="text-primary-400 text-[10px] sm:text-xs">
          Max 5MB size
        </small>
      </div>
    </div>
  );
}

export default FileUpload;
