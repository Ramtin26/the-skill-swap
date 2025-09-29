import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { auth } from "@/app/_lib/auth";
import { getUser } from "@/app/_lib/data-service";

export const metadata = {
  title: "Update profile",
};

export default async function Page() {
  const session = await auth();
  const user = await getUser(session?.user?.email);

  return (
    // <div>
    <div className="px-4 sm:px-6 md:px-8">
      <h2 className="font-semibold text-xl sm:text-2xl text-accent-400 mb-3 sm:mb-4">
        Update your dashboard profile
      </h2>

      <p className="text-base sm:text-lg mb-6 sm:mb-8 text-primary-200">
        Providing the following information will make you stand out among other
        candidates. Good luck!
      </p>

      <UpdateProfileForm user={user} />
    </div>
  );
}
