import Image from "next/image";
import {
  CodeBracketIcon,
  CurrencyDollarIcon,
  UsersIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { differenceInDays, differenceInHours } from "date-fns";

import GoBackButton from "./GoBackButton";
import SaveJobButton from "./SaveJobButton";
import { formatCurrency } from "@/app/helper/helper";

export default function Job({ job }) {
  const {
    id: jobId,
    title,
    companyName,
    image,
    locationType,
    location,
    averageSalary,
    employmentType,
    maxHires,
    description,
    positionLevel,
    deadline,
  } = job;

  const deadlineDate = new Date(deadline);
  const now = new Date();

  const hoursLeft = differenceInHours(deadlineDate, now);
  const daysLeft = differenceInDays(deadlineDate, now);

  let deadlineText;
  if (hoursLeft <= 0) {
    deadlineText = "Deadline passed";
  } else if (daysLeft >= 1) {
    deadlineText = `Deadline in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`;
  } else {
    deadlineText = `Deadline in ${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}`;
  }

  let deadlineColor;
  if (hoursLeft <= 0) deadlineColor = "bg-gray-200 text-gray-800";
  else if (hoursLeft <= 24) deadlineColor = "bg-red-100 text-red-800";
  else if (daysLeft <= 7) deadlineColor = "bg-orange-100 text-orange-800";
  else deadlineColor = "bg-green-100 text-green-800";

  return (
    <article className="bg-primary-900 rounded-2xl shadow-md overflow-hidden mb-12 sm:mb-20">
      {/* Cover */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={image}
          alt={`${companyName} office`}
          fill
          className="object-cover"
        />
        <GoBackButton />
      </div>

      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-primary-700">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {title}
          </h1>
          <SaveJobButton jobId={jobId} size={8} />
        </div>
        <p className="text-base sm:text-lg mt-1">{companyName}</p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 sm:p-8">
        <Detail icon={<MapPinIcon />} label="Location" value={location} />
        <Detail
          icon={<BriefcaseIcon />}
          label="Employment Type"
          value={employmentType}
        />
        <Detail
          icon={<CodeBracketIcon />}
          label="Position Level"
          value={positionLevel}
        />
        <Detail
          icon={<BuildingOfficeIcon />}
          label="Work Style"
          value={locationType}
        />
        <Detail icon={<UsersIcon />} label="Max Hires" value={maxHires} />
        <Detail
          icon={<CurrencyDollarIcon />}
          label="Average Salary"
          value={formatCurrency(averageSalary)}
        />
      </div>

      {/* Deadline */}
      <div className="px-6 sm:px-8 pb-4 mb-4">
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm sm:text-base font-medium ${deadlineColor}`}
        >
          {deadlineText}
        </span>
      </div>

      {/* Description */}
      <div className="px-6 sm:px-8 pb-8 sm:pb-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
          Job Description
        </h2>
        <p className="text-primary-200 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      </div>
    </article>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="text-accent-500 h-5 w-5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs sm:text-sm text-primary-300">{label}</p>
        <p className="text-sm sm:text-base font-medium break-words">{value}</p>
      </div>
    </div>
  );
}
