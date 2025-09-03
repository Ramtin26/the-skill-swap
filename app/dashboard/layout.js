import SideNavigation from "@/app/_components/SideNavigation";
import { auth } from "../_lib/auth";
import { getUser } from "../_lib/data-service";

export default async function layout({ children }) {
  const session = await auth();
  const user = await getUser(session.user.email);

  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12">
      <SideNavigation role={user.role} />
      <div className="py-1">{children}</div>
    </div>
  );
}
