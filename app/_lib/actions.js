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

export async function toggleSaveJob({ seekerId, jobId, isSaved }) {
  if (!seekerId) throw new Error("Only seekers can save jobs");

  if (isSaved) {
    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("seekerId", seekerId)
      .eq("jobId", jobId);

    if (error) throw new Error("Could not unsave job");

    return { status: "unsaved" };
  } else {
    const { error } = await supabase
      .from("saved_jobs")
      .insert([{ seekerId, jobId }]);

    if (error) throw new Error("Could not save job");

    return { status: "saved" };
  }
}

export async function createApplication(formData) {
  const jobId = formData.get("jobId");
  const seekerId = formData.get("seekerId");
  const note = formData.get("note")?.trim();
  const resumeFile = formData.get("resume");

  console.log(formData);

  if (!jobId || !seekerId) throw new Error("Missing required fields");

  // Upload resume
  let resumeURL = null;
  if (resumeFile) {
    if (resumeFile.type !== "application/pdf") {
      throw new Error("Resume must be a PDF file");
    }

    const filePath = `resumes/${seekerId}-${jobId}.pdf`;

    // const { error: uploadError } = await supabase.storage
    //   .from("resumes")
    //   .upload(filePath, resumeFile, { upsert: true });

    // if (uploadError) throw new Error("Resume upload failed");

    // const {
    //   data: { publicUrl },
    // } = supabase.storage.from("resumes").getPublicUrl(filePath);

    // resumeURL = publicUrl;
  }

  const data = {
    jobId,
    seekerId,
    note,
    resumeFile,
  };

  console.log("Data:", data);

  // Insert into applications table
  // const { error } = await supabase.from("applications").insert([
  //   {
  //     jobId,
  //     seekerId,
  //     note,
  //     resume: resumeURL,
  //     status: "in-review",
  //     reviewed: false,
  //     rating: null,
  //   },
  // ]);

  // if (error) throw new Error("Could not create application");

  return { success: true };
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
