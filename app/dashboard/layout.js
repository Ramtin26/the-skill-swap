import SideNavigation from "@/app/_components/SideNavigation";
import { auth } from "@/app/_lib/auth";
import { getUser } from "@/app/_lib/data-service";

export default async function layout({ children }) {
  const session = await auth();
  const user = await getUser(session.user.email);

  return (
    <div className="min-h-screen grid gap-6 md:grid-cols-[14rem_1fr] lg:grid-cols-[16rem_1fr]">
      <SideNavigation role={user.role} />
      <div className="px-4 sm:px-6 md:px-8 py-4">{children}</div>
    </div>
  );
}
