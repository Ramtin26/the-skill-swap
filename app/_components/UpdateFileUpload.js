"use client";

import { useState } from "react";
import { DocumentArrowUpIcon } from "@heroicons/react/24/solid";

function UpdateFileUpload({ resumePath }) {
  const [fileName, setFileName] = useState(resumePath?.split("/").pop());

  return (
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
        />
        <DocumentArrowUpIcon className="mx-auto w-10 h-10 text-primary-500" />
        <p className="text-primary-400 mt-2">
          {fileName || "Drag & drop or click to upload"}
        </p>
        <small className="text-primary-400">Max 5MB size</small>
      </div>
    </div>
  );
}

export default UpdateFileUpload;
