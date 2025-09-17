import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { getResumeSignedURL } from "@/app/_lib/actions";
import { getCleanFilename } from "@/app/helper/helper";

function DownloadResumeButton({ resumeURL }) {
  async function handleDownloadResume() {
    // try {
    const signedUrl = await getResumeSignedURL({ resumePath: resumeURL });
    window.open(signedUrl, "_blank"); // open in new tab or start download
    // } catch (err) {
    //   console.error("Failed to get signed URL:", err);
    // }
  }

  return (
    <button
      onClick={handleDownloadResume}
      className="flex items-center gap-1 text-sm text-accent-400 hover:underline cursor-pointer"
    >
      <DocumentArrowDownIcon className="h-5 w-5" />
      {getCleanFilename(resumeURL)}
    </button>
  );
}

export default DownloadResumeButton;
