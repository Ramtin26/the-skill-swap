import { format, formatDistance, isBefore, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import DeleteApplication from "./DeleteApplication";
import { DocumentTextIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

// Status badge color
function getStatusColor(status) {
  switch (status) {
    case "in-review":
      return "bg-blue-600/20 text-blue-400";
    case "accepted":
      return "bg-green-600/20 text-green-400";
    case "rejected":
      return "bg-red-600/20 text-red-400";
    default:
      return "bg-gray-600/20 text-gray-300";
  }
}

// Progress bar percentage
function getProgress(status) {
  switch (status) {
    case "in-review":
      return 33;
    case "accepted":
      return 100;
    case "rejected":
      return 100;
    default:
      return 0;
  }
}

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), { addSuffix: true }).replace(
    "about",
    ""
  );

function ApplicationCard({ application, onDelete }) {
  const {
    id,
    created_at,
    resumePath,
    status,
    note,
    rating,
    jobs: {
      title,
      companyName,
      locationType,
      positionLevel,
      averageSalary,
      deadline,
      image,
    },
  } = application;

  const deadlinePassed = isBefore(new Date(deadline), new Date());
  const progress = getProgress(status);
  const deadlineLabel = deadlinePassed ? "Passed" : "Upcoming";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 p-4 border border-primary-700 rounded-xl shadow-sm bg-primary-900/40"
    >
      {/* Top row: job info + actions */}
      <div className="flex items-center justify-between gap-6">
        {/* Job logo + info */}
        <div className="flex items-center gap-4">
          <Image
            src={image}
            alt={companyName}
            width={48}
            height={48}
            className="h-12 w-12 object-cover rounded-md"
          />
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-primary-300">
              {companyName} — {locationType}, {positionLevel}
            </p>
            <p className="text-xs text-primary-400">
              Applied on {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!deadlinePassed && (
            <Link
              href={`/dashboard/applications/edit/${id}`}
              className="group flex items-center gap-2 p-2 rounded-lg uppercase text-xs font-bold text-primary-300 px-3 hover:bg-accent-600 transition-colors hover:text-primary-900 cursor-pointer"
            >
              <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
              <span>Edit</span>
            </Link>
          )}

          <DeleteApplication applicationId={id} onDelete={onDelete} />

          {resumePath && (
            <div className="flex items-center gap-2 text-xs font-bold text-accent-400 px-3 py-2 bg-accent-900/30 rounded-md">
              <span>
                <DocumentTextIcon className="h-5 w-5" />
              </span>
              <span>{resumePath.split("/").pop()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Middle row: status + rating + salary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>

          {rating !== null && (
            <span className="text-sm text-yellow-400">⭐ {rating}/10</span>
          )}

          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${
              deadlinePassed
                ? "bg-red-800 text-red-400"
                : "bg-accent-800 text-yellow-400"
            }`}
          >
            {deadlineLabel} ({formatDistanceFromNow(deadline)})
          </span>
        </div>

        <p className="text-accent-400 font-medium">
          {averageSalary ? `$${averageSalary}/yr` : "N/A"}
        </p>
      </div>

      {/* Note */}
      {note && (
        <p className="text-sm text-primary-300 italic">
          <span className="font-medium text-primary-200">
            Note to employer:
          </span>{" "}
          {note}
        </p>
      )}

      {/* Progress bar */}
      <div className="w-full h-2 bg-primary-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full ${
            status === "accepted"
              ? "bg-green-500"
              : status === "rejected"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        />
      </div>
    </motion.li>
  );
}

export default ApplicationCard;
