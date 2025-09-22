"use client";

import { useOptimistic } from "react";

import ApplicationCard from "./ApplicationCard";
import { deleteApplication } from "@/app/_lib/actions";
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
    <ul className="space-y-6">
      {optimisticApplications.map((application) =>
        applications.deleting ? (
          <div
            key={application.id}
            className="grid items-center justify-center"
          >
            <SpinnerMini />
            {/* <p className="text-xl text-primary-200">Deleting application...</p> */}
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
