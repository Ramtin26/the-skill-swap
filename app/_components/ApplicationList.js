"use client";

import { useOptimistic } from "react";

import ApplicationCard from "./ApplicationCard";
import { deleteApplication } from "@/app/_lib/actions";

function ApplicationList({ applications }) {
  const [optimisticApplications, optimisticDelete] = useOptimistic(
    applications,
    (curApplications, applicationId) => {
      return curApplications.filter(
        (application) => application.id !== applicationId
      );
    }
  );

  async function handleDelete(applicationId) {
    optimisticDelete(applicationId);
    await deleteApplication(applicationId);
  }

  return (
    <ul className="space-y-6">
      {optimisticApplications.map((application) => (
        <ApplicationCard
          application={application}
          onDelete={handleDelete}
          key={application.id}
        />
      ))}
    </ul>
  );
}

export default ApplicationList;
