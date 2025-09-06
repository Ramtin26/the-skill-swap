import { auth } from "@/app/_lib/auth";
import ApplicationForm from "./ApplicationForm";
import LoginMessage from "./LoginMessage";

async function Applicaton({ job }) {
  const session = await auth();

  return (
    <div className="grid grid-cols-1 border border-primary-800 min-h-[400px] ">
      {session?.user ? (
        <ApplicationForm job={job} user={session.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Applicaton;
