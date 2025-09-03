import RoleSelector from "@/app/_components/RoleSelector";
// import { auth } from "@/app/_lib/auth";
// import { redirect } from "next/navigation";

export const metadata = {
  title: "Select role",
};

export default async function Page() {
  return <RoleSelector />;
}
