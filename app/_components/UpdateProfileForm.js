import Image from "next/image";
import { updateUser } from "@/app/_lib/actions";

import ConfirmRoleSelect from "./ConfirmRoleSelect";
import ExperienceManager from "./ExperienceManager";
import SelectCountry from "./SelectCountry";
import SkillsSelector from "./SkillsSelector";
import SubmitButton from "./SubmitButton";
import { flagToCountryCode } from "@/app/helper/helper";

function UpdateProfileForm({ user }) {
  const {
    fullName,
    email,
    nationality,
    countryFlag,
    skills = [],
    experience = [],
    companyName,
    companySize,
    shortBio,
    role: userRole,
  } = user;

  return (
    <form
      action={updateUser}
      className="flex flex-col gap-6 bg-primary-900 rounded-lg px-4 sm:px-8 md:px-12 py-6 sm:py-8 text-lg sm:text-base"
    >
      <div className="space-y-1 sm:space-y-2">
        <label>Full name</label>
        <input
          defaultValue={fullName}
          name="fullName"
          className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-sm bg-primary-200 text-primary-800"
        />
      </div>

      <div className="space-y-1 sm:space-y-2">
        <label>Email address</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-sm mt-1 bg-primary-200 text-primary-800 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          {countryFlag && (
            <Image
              src={
                countryFlag ||
                `https://flagcdn.com/${flagToCountryCode(countryFlag)}.svg`
              }
              width={24}
              height={24}
              alt="Country flag"
              className="h-5 w-7 sm:h-6 sm:w-8 rounded-sm border border-gray-400"
            />
          )}
        </div>

        <SelectCountry
          name="nationality"
          id="nationality"
          defaultcountry={nationality}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-sm bg-primary-200 text-primary-800"
        />
      </div>

      {userRole === "seeker" ? (
        <>
          <div className="space-y-1 sm:space-y-2">
            <label>Your skills</label>
            <SkillsSelector name="skills" defaultSkills={skills} />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label>Work experience</label>
            <ExperienceManager
              name="experience"
              defaultExperience={experience}
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1 sm:space-y-2">
            <label>What is your company name?</label>
            <input
              name="companyName"
              required
              defaultValue={companyName}
              className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-sm bg-primary-200 text-primary-800"
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label>How many people work in your company?</label>
            <input
              type="number"
              name="companySize"
              defaultValue={companySize}
              className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-sm bg-primary-200 text-primary-800"
            />
          </div>
        </>
      )}

      <div className="space-y-1 sm:space-y-2">
        <label>Short bio</label>
        <textarea
          name="shortBio"
          defaultValue={shortBio}
          maxLength={500}
          rows={4}
          required
          className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-sm bg-primary-200 text-primary-800"
        />
        <small className="text-primary-400 text-xs sm:text-sm">
          Max 500 characters
        </small>
      </div>

      <div className="space-y-1 sm:space-y-2 flex flex-col gap-2">
        <label>Account type</label>
        <ConfirmRoleSelect currentRole={userRole} />
      </div>

      <div className="pt-3 sm:pt-4 flex justify-end">
        <SubmitButton pendingLabel="Updating...">Update profile</SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
