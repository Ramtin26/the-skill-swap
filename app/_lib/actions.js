"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { flagToCountryCode } from "@/app/helper/helper";
import { getUser } from "./data-service";

export async function updateRole(role) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in");

  const { data, error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", session.user.seekerId);

  if (error) throw new Error("Role could not be updated");

  return null;
}

export async function updateUser(formData) {
  const session = await auth();
  // const user = await getUser(session.user.email);
  console.log("FormData:", formData);

  if (!session) throw new Error("You must be logged in");

  const [nationality, flagEmoji] = formData.get("nationality").split("%");

  const countryCode = flagEmoji ? flagToCountryCode(flagEmoji.trim()) : null;

  const countryFlag = countryCode
    ? `https://flagcdn.com/${countryCode}.svg`
    : null;

  const fullName = formData.get("fullName");

  const skills = JSON.parse(formData.get("skills") || "[]");
  const experience = JSON.parse(formData.get("experience") || "[]");

  const companyName = formData.get("companyName");
  const companySize = Number(formData.get("companySize") || null);

  const shortBio = formData.get("shortBio");
  const role = formData.get("role");

  // if (skills.length < 4)
  //   throw new Error("You must select at least three skills");
  // if (shortBio?.trim()) throw new Error("A short bio is required");

  let updateData = {
    fullName,
    nationality,
    countryFlag,
    role,
  };

  if (role === "seeker") {
    updateData = {
      ...updateData,
      skills,
      experience,
      shortBio: shortBio || "",
      companyName: null,
      companySize: null,
    };
  } else if (role === "employer") {
    updateData = {
      ...updateData,
      companyName,
      companySize,
      shortBio: shortBio || "",
      skills: [],
      experience: [],
    };
  }

  console.log("UpdateData:", updateData);

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", session.user.seekerId);

  if (error) throw new Error("User could not be updated");

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/onboarding/role" });

  // await signIn("google");

  // const session = await auth();
  // if (!session?.user) throw new Error("Sign in failed");

  // const { data: user, error } = await supabase
  //   .from("users")
  //   .select("role")
  //   .eq("id", session?.user?.seekerId)
  //   .single();

  // if (error) throw new Error("Failed to fetch user role");

  // if (!user?.role) redirect("/onboarding/role");

  // redirect("/dashboard");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
