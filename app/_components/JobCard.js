import Link from "next/link";
import Image from "next/image";
import { differenceInDays, format } from "date-fns";
import { MapPinIcon } from "@heroicons/react/24/solid";
import SaveJobButton from "./SaveJobButton";

function JobCard({ job }) {
  const { id: jobId, title, locationType, maxHires, deadline, image } = job;

  const daysLeft = differenceInDays(new Date(deadline), new Date());
  const isUrgent = daysLeft <= 3;

  return (
    <div className="grid grid-cols-[12rem_1fr] border border-primary-800">
      {/* Left Image */}
      <div className="relative w-full h-full min-h-[12rem]">
        <Image
          src={image}
          alt={`job: ${title}`}
          fill
          className="object-cover border-r border-primary-800"
        />
      </div>

      {/* Right Content */}
      <div className="flex flex-col justify-between">
        <div className="p-5 bg-primary-950">
          <div className="flex justify-between mb-3">
            <h3 className="text-accent-500 font-semibold text-xl">{title}</h3>
            <SaveJobButton jobId={jobId} size={5} />
          </div>

          <div className="flex items-center justify-between mt-5 mb-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-primary-600" />
              <p className="text-lg text-primary-200">{locationType}</p>
            </div>
            <p
              className={`py-1 px-2 rounded-full text-xs font-semibold ${
                maxHires < 2 ? "bg-red-600 text-white" : "bg-primary-700"
              }`}
            >
              {maxHires > 1 ? `${maxHires} capacities` : `${maxHires} capacity`}
            </p>
          </div>
        </div>

        <div className="flex items-center  justify-between px-5 py-3 border-t border-t-primary-800 bg-primary-950">
          <p
            className={`text-primary-400 ${
              isUrgent ? "text-red-500 font-semibold" : ""
            }`}
          >
            Deadline: {format(new Date(deadline), "EEE, MMM dd yyyy")}
          </p>
          <Link
            href={`/jobs/${jobId}`}
            className="border-l border-primary-800 py-4 px-3 hover:bg-accent-600 transition-all hover:text-primary-900 inline-flex items-center gap-2"
          >
            <span className="text-nowrap">Apply Now</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
