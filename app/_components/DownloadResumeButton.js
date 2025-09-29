import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { getResumeSignedURL } from "@/app/_lib/actions";

function DownloadResumeButton({ resumeURL, jobTitle, fullName }) {
  async function downloadResume() {
    const signedUrl = await getResumeSignedURL({ resumePath: resumeURL });
    window.open(signedUrl, "_blank");
  }

  // First name only
  const firstName =
    fullName
      ?.trim()
      .split(/\s+/)[0]
      .replace(/[^a-zA-Z0-9]/g, "") || "User";

  const jobSlug = jobTitle?.trim().replace(/[^a-zA-Z0-9]/g, "_") || "Job";

  const displayName = `${firstName}_${jobSlug}.pdf`;

  return (
    <button
      onClick={downloadResume}
      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-accent-400 hover:underline"
    >
      <DocumentArrowDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      {displayName}
    </button>
  );
}

export default DownloadResumeButton;
