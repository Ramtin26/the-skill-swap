import { auth } from "@/app/_lib/auth";
import { getUser } from "@/app/_lib/data-service";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";

export const metadata = {
  title: "Update profile",
};

export default async function Page() {
  const session = await auth();
  const user = await getUser(session?.user?.email);
  // console.log(user.role);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your dashboard profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make you stand out among other
        candidates. Good luck!
      </p>

      <UpdateProfileForm user={user} />

      {/* {user.role === "seeker" ? (
        <SeekerProfileForm user={user} />
      ) : (
        <EmployerProfileForm user={user} />
      )} */}
    </div>
  );
}
