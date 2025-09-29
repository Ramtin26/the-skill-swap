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
    <div className="grid border border-primary-800 grid-cols-1 sm:grid-cols-[10rem_1fr] md:grid-cols-[12rem_1fr]">
      {/* Left Image */}
      <div className="relative w-full h-48 sm:h-auto">
        <Image
          src={image}
          alt={`job: ${title}`}
          fill
          className="object-cover border-b sm:border-b-0 sm:border-r border-primary-800"
        />
      </div>

      {/* Right Content */}
      <div className="flex flex-col justify-between bg-primary-950">
        <div className="p-4 md:p-5">
          <div className="flex justify-between mb-3 gap-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-accent-500 font-semibold">
              {title}
            </h3>
            <SaveJobButton jobId={jobId} size={5} />
          </div>

          <div className="flex items-center justify-between mt-5 mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              <p className="text-sm sm:text-base text-primary-200">
                {locationType}
              </p>
            </div>
            <p
              className={`py-1 px-2 rounded-full text-xs sm:text-sm font-semibold ${
                maxHires < 2 ? "bg-red-600 text-white" : "bg-primary-700"
              }`}
            >
              {maxHires > 1 ? `${maxHires} capacities` : `${maxHires} capacity`}
            </p>
          </div>
        </div>

        <div className="flex items-center  justify-between px-4 md:px-5 py-3 border-t border-t-primary-800">
          <p
            className={`text-xs sm:text-sm md:text-base text-primary-400 ${
              isUrgent ? "text-red-500 font-semibold" : ""
            }`}
          >
            Deadline: {format(new Date(deadline), "EEE, MMM dd yyyy")}
          </p>
          {maxHires !== 0 && (
            <Link
              href={`/jobs/${jobId}`}
              className="border-l border-primary-800 py-2 px-3 hover:bg-accent-600 hover:text-primary-900 transition-all text-sm sm:text-base"
            >
              <span className="text-nowrap">Apply Now</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobCard;
