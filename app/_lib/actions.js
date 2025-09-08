"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { flagToCountryCode } from "@/app/helper/helper";
import { getSavedJobs, getUser } from "./data-service";

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

  const { error } = await supabase
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

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);

    return { status: "unsaved" };
  } else {
    const { error } = await supabase
      .from("saved_jobs")
      .insert([{ seekerId, jobId }]);

    if (error) throw new Error("Could not save job");

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);

    return { status: "saved" };
  }
}

export async function deleteSavedjob(savedJobsId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const seekerSavedJobs = await getSavedJobs(session.user.seekerId);
  const seekerSavedJobIds = seekerSavedJobs.map((savedJob) => savedJob.id);

  if (!seekerSavedJobIds.includes(savedJobsId))
    throw new Error("You are not allowed to delete this saved job");

  const { error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("id", savedJobsId);

  if (error) throw new Error("Saved job could not be deleted");

  revalidatePath("/dashboard");
}

export async function createApplication(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const jobId = formData.get("jobId");
  const seekerId = formData.get("seekerId");
  const fullName = formData.get("fullName");
  const note = formData.get("note")?.trim();
  const resumeFile = formData.get("resume");

  console.log(formData);

  if (!jobId || !seekerId) throw new Error("Missing required fields");
  if (!resumeFile || resumeFile.size === 0)
    throw new Error("Resume is required");

  try {
    // Validate file type and size
    if (resumeFile.type !== "application/pdf") {
      throw new Error("Resume must be a PDF file");
    }

    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (resumeFile.size > maxSize) {
      throw new Error("Resume file must be smaller than 10MB");
    }

    // Check if user already applied for this job
    const { data: existingApplication } = await supabase
      .from("applications")
      .select("id")
      .eq("jobId", jobId)
      .eq("seekerId", seekerId)
      .single();

    if (existingApplication) {
      throw new Error("You have already applied for this position");
    }

    // Create clean filename
    const cleanName =
      fullName
        ?.trim()
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .substring(0, 50) || // Limit length
      "Resume";

    const fileName = `${cleanName}_Resume.pdf`;

    // Structured path: applications/{jobId}/{seekerId}/filename
    const filePath = `applications/${jobId}/${seekerId}/${fileName}`;

    console.log("Uploading resume to:", filePath);

    // Upload resume with structured path
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, resumeFile, {
        upsert: true, // Overwrite if exists (user updating application)
        cacheControl: "3600",
        contentType: "application/pdf",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Resume upload failed: ${uploadError.message}`);
    }

    // Store the file path (not signed URL) in database
    // We'll generate signed URLs when needed for viewing
    const { error: insertError } = await supabase.from("applications").insert([
      {
        jobId,
        seekerId,
        note,
        resumePath: filePath, // Store file path, not URL
        status: "in-review",
        reviewed: false,
        rating: null,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);

      // Cleanup: delete uploaded file if database insert fails
      await supabase.storage.from("resumes").remove([filePath]);

      throw new Error(`Application submission failed: ${insertError.message}`);
    }

    console.log("Application created successfully for job:", jobId);

    // Revalidate relevant pages
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/dashboard/applications");

    return {
      success: true,
      message: "Application submitted successfully!",
      filePath,
    };
  } catch (error) {
    console.error("Error in createApplication:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }
}

// export async function createApplication(formData) {
//   const jobId = formData.get("jobId");
//   const seekerId = formData.get("seekerId");
//   const fullName = formData.get("fullName");
//   const note = formData.get("note")?.trim();
//   const resumeFile = formData.get("resume");

//   // console.log(formData);

//   if (!jobId || !seekerId) throw new Error("Missing required fields");

//   // Upload resume
//   let resumeURL = null;
//   if (resumeFile) {
//     if (resumeFile.type !== "application/pdf") {
//       throw new Error("Resume must be a PDF file");
//     }

//     const cleanName = fullName?.toLowerCase().replace(/\s+/g, "_") || seekerId;
//     const filePath = `${cleanName}_${jobId}_cv.pdf`;

//     const { error: uploadError } = await supabase.storage
//       .from("resumes")
//       .upload(filePath, resumeFile, { upsert: true });

//     if (uploadError) throw new Error("Resume upload failed");

//     const {
//       data: { publicUrl },
//     } = supabase.storage.from("resumes").getPublicUrl(filePath, 60 * 60);

//     resumeURL = publicUrl;
//   }

//   // Insert into applications table
//   const { error } = await supabase.from("applications").insert([
//     {
//       jobId,
//       seekerId,
//       note,
//       resume: resumeURL,
//       status: "in-review",
//       reviewed: false,
//       rating: null,
//     },
//   ]);

//   if (error) throw new Error("Could not create application");

//   return { success: true };
// }

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
