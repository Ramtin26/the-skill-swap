import Link from "next/link";
import Image from "next/image";
import { format, formatDistance, isBefore, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { DocumentTextIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import DeleteApplication from "./DeleteApplication";

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
  const distance = formatDistance(parseISO(deadline), new Date(), {
    addSuffix: true,
  }).replace("about", "");

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 p-4 sm:p-6 border border-primary-700 rounded-xl shadow-sm bg-primary-900/40"
    >
      {/* Top row: job info + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Job logo + info */}
        <div className="flex items-center gap-4 flex-1">
          <Image
            src={image}
            alt={companyName}
            width={48}
            height={48}
            className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-md shrink-0"
          />
          <div>
            <h4 className="font-semibold text-base sm:text-lg">{title}</h4>
            <p className="text-xs sm:text-sm text-primary-300">
              {companyName} — {locationType}, {positionLevel}
            </p>
            <p className="text-xs text-primary-400">
              Applied on {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-start justify-end gap-2 sm:gap-3">
          {!deadlinePassed && (
            <Link
              href={`/dashboard/applications/edit/${id}`}
              className="group flex items-center gap-1 sm:gap-2 p-2 rounded-lg uppercase text-[10px] sm:text-xs font-bold text-primary-300 hover:bg-accent-600 transition-colors hover:text-primary-900"
            >
              <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 group-hover:text-primary-800" />
              <span>Edit</span>
            </Link>
          )}

          <DeleteApplication applicationId={id} onDelete={onDelete} />

          {resumePath && (
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-accent-400 px-2 sm:px-3 py-1 sm:py-2 bg-accent-900/30 rounded-md max-w-[110px] sm:max-w-[160px]">
              <span>
                <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              </span>
              <span className="truncate">{resumePath.split("/").pop()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Middle row: status + rating + salary */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>

          {rating !== null && (
            <span className="text-xs sm:text-sm text-yellow-400">
              ⭐ {rating}/5
            </span>
          )}

          <span
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium ${
              deadlinePassed
                ? "bg-red-800 text-red-400"
                : "bg-accent-800 text-yellow-400"
            }`}
          >
            {deadlineLabel} ({distance})
          </span>
        </div>

        <p className="text-accent-400 font-medium text-xs sm:text-sm">
          {averageSalary ? `$${averageSalary}/yr` : "N/A"}
        </p>
      </div>

      {/* Note */}
      {note && (
        <p className="text-xs sm:text-sm text-primary-300 italic">
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
