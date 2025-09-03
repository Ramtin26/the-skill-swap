import { auth } from "../_lib/auth";
import { getUser } from "../_lib/data-service";
import SeekerDashboard from "../_components/SeekerDashboard";
import EmployerDashboard from "../_components/EmployerDashboard";

export const metadata = {
  title: "dashboard",
};

export default async function Page() {
  const session = await auth();
  const user = await getUser(session?.user?.email);

  console.log("Session: ", session);
  const firstName = user.fullName?.split(" ").at(0);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Welcome, {firstName}
      </h2>

      {user.role === "seeker" ? <SeekerDashboard /> : <EmployerDashboard />}
    </div>
  );
}
