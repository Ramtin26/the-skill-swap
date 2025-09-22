import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { getResumeSignedURL } from "@/app/_lib/actions";
import { getCleanFilename } from "@/app/helper/helper";

function DownloadResumeButton({ resumeURL, jobTitle, fullName }) {
  async function handleDownloadResume() {
    const signedUrl = await getResumeSignedURL({ resumePath: resumeURL });
    window.open(signedUrl, "_blank"); // open in new tab or start download
  }

  // First name only (default to "User" if missing)
  const firstName =
    fullName
      ?.trim()
      .split(/\s+/)[0]
      .replace(/[^a-zA-Z0-9]/g, "") || "User";

  const jobSlug = jobTitle?.trim().replace(/[^a-zA-Z0-9]/g, "_") || "Job";

  const displayName = `${firstName}_${jobSlug}.pdf`;

  return (
    <button
      onClick={handleDownloadResume}
      className="flex items-center gap-1 text-sm text-accent-400 hover:underline cursor-pointer"
    >
      <DocumentArrowDownIcon className="h-5 w-5" />
      {displayName}
    </button>
  );
}

export default DownloadResumeButton;
