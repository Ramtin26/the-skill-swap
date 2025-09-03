import Image from "next/image";
import {
  CodeBracketIcon,
  CurrencyDollarIcon,
  UsersIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { differenceInDays } from "date-fns";
import GoBackButton from "./GoBackButton";

export default function Job({ job }) {
  const {
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

  const daysLeft = differenceInDays(new Date(deadline), new Date());
  let deadlineColor = "bg-green-100 text-green-800";
  if (daysLeft <= 7) deadlineColor = "bg-red-100 text-red-800";
  else if (daysLeft <= 14) deadlineColor = "bg-orange-100 text-orange-800";

  const formatterUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <article className="bg-primary-900 rounded-2xl shadow-md overflow-hidden mb-24">
      {/* Header / Cover */}
      {/* <div className="relative h-64 w-full"> */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={image}
          alt={`${companyName} office`}
          fill
          className="object-cover"
        />
        <GoBackButton />
      </div>
      {/* <div className="relative h-[32rem] w-full">
        <Image
          src={image}
          alt={`${companyName} office`}
          fill
          className="object-cover blur-md scale-110"
        />
        <Image
          src={image}
          alt={`${companyName} office`}
          fill
          className="object-contain relative z-10"
        />
      </div> */}

      {/* Job Header */}
      <div className="p-8 border-b border-primary-700">
        <h1 className="text-4xl font-semibold mb-2">{title}</h1>
        <p className="text-lg">{companyName}</p>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8">
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
          value={formatterUSD.format(averageSalary)}
        />
      </div>

      {/* Deadline Badge */}
      <div className="px-8 pb-4 mb-4">
        <span
          className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${deadlineColor}`}
        >
          {daysLeft > 0
            ? `Deadline in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
            : "Deadline passed"}
        </span>
      </div>

      {/* Description */}
      <div className="px-8 pb-10">
        <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
        <p className="text-primary-200 leading-relaxed">{description}</p>
      </div>
    </article>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="text-accent-500 h-5 w-5">{icon}</div>
      <div>
        <p className="text-sm text-primary-300">{label}</p>
        <p className="text-base font-medium">{value}</p>
      </div>
    </div>
  );
}
