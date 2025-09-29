"use client";

import { useOptimistic } from "react";

import { deleteApplication } from "@/app/_lib/actions";
import ApplicationCard from "./ApplicationCard";
import SpinnerMini from "./SpinnerMini";

function ApplicationList({ applications }) {
  const [optimisticApplications, optimisticDelete] = useOptimistic(
    applications,
    (curApplications, action) => {
      if (typeof action === "object" && action.deleting) {
        return curApplications.map((app) =>
          app.id === action.id ? { ...app, deleting: true } : app
        );
      }
      return curApplications.filter((application) => application.id !== action);
    }
  );

  async function handleDelete(applicationId) {
    optimisticDelete({ id: applicationId, deleting: true });
    await deleteApplication(applicationId);
    optimisticDelete(applicationId);
  }

  return (
    <ul className="space-y-4 sm:space-y-6">
      {optimisticApplications.map((application) =>
        application.deleting ? (
          <div key={application.id} className="grid place-items-center py-4">
            <SpinnerMini />
          </div>
        ) : (
          <ApplicationCard
            application={application}
            onDelete={handleDelete}
            key={application.id}
          />
        )
      )}
    </ul>
  );
}

export default ApplicationList;
