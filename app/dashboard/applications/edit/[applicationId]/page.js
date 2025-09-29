import SubmitButton from "@/app/_components/SubmitButton";
import UpdateFileUpload from "@/app/_components/UpdateFileUpload";
import { getApplication, getJob } from "@/app/_lib/data-service";
import { updateApplication } from "@/app/_lib/actions";

export default async function Page({ params }) {
  const { applicationId } = await params;
  const application = await getApplication(applicationId);
  const { jobId, resumePath, note } = application;
  const { title } = await getJob(jobId);

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <h2 className="font-semibold flex flex-wrap gap-1 text-xl sm:text-2xl text-accent-400 mb-5 sm:mb-7">
        Edit Application for
        <span className="text-accent-600 font-bold">#{title}</span>
      </h2>

      <form
        action={updateApplication}
        className="bg-primary-900 p-4 sm:p-6 md:p-8 text-base sm:text-lg flex flex-col gap-6 rounded-md"
      >
        <input name="applicationId" type="hidden" value={applicationId} />

        <UpdateFileUpload resumePath={resumePath} />

        <div>
          <label className="block mb-2 font-medium text-primary-200">
            Note to Employer
          </label>
          <textarea
            name="note"
            rows={4}
            maxLength={500}
            defaultValue={note || ""}
            placeholder="Why are you a great fit for this role?"
            className="w-full px-4 py-3 rounded-md bg-primary-200 text-primary-800 placeholder-primary-500"
          />
          <small className="text-primary-400">Max 500 characters</small>
        </div>

        <div className="pt-2 sm:pt-4 flex justify-center">
          <SubmitButton pendingLabel="Updating...">
            Update application
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
