"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth, signIn, signOut } from "./auth";
import { supabase, supabaseUrl } from "./supabase";
import { getApplications } from "./data-service";
import { capitalize, flagToCountryCode } from "@/app/helper/helper";

export async function updateRole(role) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", session.user.id);

  if (error) throw new Error("Role could not be updated");
}

export async function updateUser(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const [nationality, flagEmoji] = formData.get("nationality").split("%");
  const countryCode = flagEmoji ? flagToCountryCode(flagEmoji.trim()) : null;
  const countryFlag = countryCode
    ? `https://flagcdn.com/${countryCode}.svg`
    : null;

  const role = formData.get("role");
  const updateData = {
    fullName: formData.get("fullName"),
    nationality,
    countryFlag,
    role,
  };

  if (role === "seeker") {
    updateData.skills = JSON.parse(formData.get("skills") || "[]");
    updateData.experience = JSON.parse(formData.get("experience") || "[]");
    updateData.shortBio = formData.get("shortBio") || "";
    updateData.companyName = null;
    updateData.companySize = null;
  } else if (role === "employer") {
    updateData.companyName = formData.get("companyName");
    updateData.companySize = Number(formData.get("companySize") || null);
    updateData.shortBio = formData.get("shortBio") || "";
    updateData.skills = [];
    updateData.experience = [];
  }

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", session.user.id);

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
  } else {
    const { data: existing, error: selectError } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("seekerId", seekerId)
      .eq("jobId", jobId)
      .maybeSingle();

    if (selectError) throw new Error("Could not check existing saved jobs");

    if (!existing) {
      const { error: insertError } = await supabase
        .from("saved_jobs")
        .insert([{ seekerId, jobId }]);

      if (insertError) throw new Error("Could not save job");
    }
  }
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard");

  return { status: isSaved ? "unsaved" : "saved" };
}

export async function createApplication(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const jobId = formData.get("jobId");
  const seekerId = formData.get("seekerId");
  const fullName = formData.get("fullName");
  const note = formData.get("note")?.trim();
  const resumeFile = formData.get("resume");

  if (!jobId || !seekerId) throw new Error("Missing required fields");
  if (!resumeFile || resumeFile.size === 0)
    throw new Error("Resume is required");
  if (resumeFile.type !== "application/pdf") {
    throw new Error("Resume must be a PDF file");
  }

  const maxSize = 5 * 1024 * 1024; // 5MB limit
  if (resumeFile.size > maxSize) {
    throw new Error("Resume file must be smaller than 5MB");
  }

  // Check if user already applied for this job
  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id")
    .eq("jobId", jobId)
    .eq("seekerId", seekerId)
    .single();

  if (existingApplication)
    throw new Error("You have already applied for this position");

  // Create clean filename
  const cleanName =
    fullName
      ?.trim()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50) || "Resume";

  const fileName = `${cleanName}_Resume.pdf`;
  const filePath = `applications/${jobId}/${seekerId}/${fileName}`;

  // Upload resume with structured path
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, resumeFile, {
      cacheControl: "3600",
      contentType: "application/pdf",
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw new Error(`Resume upload failed: ${uploadError.message}`);
  }

  const { error: insertError } = await supabase.from("applications").insert([
    {
      jobId,
      seekerId,
      note,
      resumePath: filePath,
      status: "in-review",
      rating: null,
    },
  ]);

  if (insertError) {
    console.error("Insert error:", insertError);

    await supabase.storage.from("resumes").remove([filePath]);
    throw new Error(`Application submission failed: ${insertError.message}`);
  }

  // Revalidate relevant pages
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard/applications");

  // Redirect
  redirect("/jobs/thankyou");
}

export async function updateApplication(formData) {
  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const applicationId = formData.get("applicationId");
  const resumeFile = formData.get("resume");
  const note = formData.get("note")?.trim();

  // 2) Authorization
  const userApplications = await getApplications(session.user.id);
  const userApplicationIds = userApplications.map(
    (application) => application.id
  );
  const application = userApplications.find(
    (application) => application.id === applicationId
  );

  if (!userApplicationIds.includes(applicationId))
    throw new Error("You are not allowed to update this application");

  const updateData = { note };

  if (resumeFile.type !== "application/pdf")
    throw new Error("Resume must be a PDF file");

  const maxSize = 5 * 1024 * 1024;
  if (resumeFile.size > maxSize)
    throw new Error("Resume file must be smaller than 5MB");

  const filePath = application.resumePath;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, resumeFile, {
      upsert: true, // overwrite this time
      cacheControl: "3600",
      contentType: "application/pdf",
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw new Error(`Resume upload failed: ${uploadError.message}`);
  }

  updateData.resumePath = filePath;

  const { error: updateError } = await supabase
    .from("applications")
    .update(updateData)
    .eq("id", applicationId);

  if (updateError) {
    console.error("Update error:", updateError);
    throw new Error(`Application update failed: ${updateError.message}`);
  }

  // 5) Revalidate affected paths
  revalidatePath(`/dashboard/applications`);
  revalidatePath(`/dashboard/applications/${applicationId}`);

  // 6) Redirect
  redirect("/dashboard/applications");
}

export async function deleteApplication(applicationId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const { data: application, error: fetchError } = await supabase
    .from("applications")
    .select("seekerId, resumePath")
    .eq("id", applicationId)
    .single();

  if (fetchError || !application) {
    throw new Error("Application not found");
  }

  if (application.seekerId !== session.user.id) {
    throw new Error("You are not allowed to delete this application");
  }

  if (application.resumePath) {
    const { error: storageError } = await supabase.storage
      .from("resumes")
      .remove([application.resumePath]);

    if (storageError)
      console.error("Resume removal failed:", storageError.message);
  }

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", applicationId);

  if (error) throw new Error("Application could not be deleted");

  revalidatePath("/dashboard/applications");
}

export async function getAverageRating(seekerId) {
  const { data, error } = await supabase
    .from("applications")
    .select("rating")
    .eq("seekerId", seekerId)
    .not("rating", "is", null);

  if (error) throw new Error(error.message);

  if (!data.length) return 0;

  const avg = data.reduce((sum, row) => sum + row.rating, 0) / data.length;

  return Number(avg.toFixed(1));
}

export async function updateRating({ applicationId, rating }) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const { data: appData, error: appError } = await supabase
    .from("applications")
    .select("seekerId, jobId, jobs!inner(employerId)")
    .eq("id", applicationId)
    .single();

  if (appError || !appData)
    throw new Error("Application not found or failed to fetch job info");

  const { seekerId, jobs } = appData;
  const employerId = jobs?.employerId;

  if (employerId !== session.user.id)
    throw new Error("You are not allowed to update this rating");

  const { error } = await supabase
    .from("applications")
    .update({ rating })
    .eq("id", applicationId);

  if (error) throw new Error("Could not update rating");

  const avg = await getAverageRating(seekerId);
  revalidatePath("/dashboard");
  return avg;
}

export async function updateStatus({ applicationId, status }) {
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) throw new Error("Could not update status");
}

export async function updateMaxHires({ jobId }) {
  const { data: job, error: fetchError } = await supabase
    .from("jobs")
    .select("maxHires")
    .eq("id", jobId)
    .single();

  if (error || !job) throw new Error("Could not fetch job");
  if (job.maxHires <= 0) throw new Error("No capacity left for this job");

  const { error: updateError } = await supabase
    .from("jobs")
    .update({ maxHires: job.maxHires - 1 })
    .eq("id", jobId);

  if (updateError) throw new Error("Could not update maxHires");

  revalidatePath("/dashboard");
}

export async function getResumeSignedURL({ resumePath }) {
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(resumePath, 60 * 5);

  if (error) throw new Error("Could not create signed URL");

  return data.signedUrl;
}

export async function createUpdateJob(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const jobId = formData.get("id");
  const title = formData.get("title")?.trim();
  const companyName = formData.get("companyName")?.trim();
  const city = formData.get("city")?.trim();
  const country = formData.get("country")?.trim();
  const locationType = formData.get("locationType");
  const averageSalary = Number(formData.get("averageSalary"));
  const maxHires = Number(formData.get("maxHires"));
  const positionLevel = formData.get("positionLevel");
  const employmentType = formData.get("employmentType");
  const deadlineInput = formData.get("deadline");
  const deadline = deadlineInput ? new Date(deadlineInput).toISOString() : null;
  const description = formData.get("description")?.trim();
  const imageFile = formData.get("image");
  const employerId = session.user.id;

  const hasValidFile =
    imageFile &&
    imageFile.size > 0 &&
    imageFile.name !== "undefined" &&
    imageFile.type !== "application/octet-stream";

  let imageUrl = null;

  if (!jobId) {
    // CREATE
    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          title,
          companyName,
          location: `${capitalize(city)}, ${capitalize(country)}`,
          locationType,
          averageSalary,
          maxHires,
          positionLevel,
          employmentType,
          deadline,
          description,
          image: null,
          employerId,
        },
      ])
      .select("id")
      .single();

    if (error) throw new Error("Could not create job.");

    const newJobId = data.id;

    if (hasValidFile) {
      const imageName = `${newJobId}-${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("job-images")
        .upload(imageName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw new Error("Could not upload job image.");

      imageUrl = `${supabaseUrl}/storage/v1/object/public/job-images/${imageName}`;

      await supabase
        .from("jobs")
        .update({ image: imageUrl })
        .eq("id", newJobId);
    }

    redirect("/dashboard/postedJobs/successful");
  } else {
    // UPDATE
    const { data: existingJob, error: fetchError } = await supabase
      .from("jobs")
      .select("image")
      .eq("id", jobId)
      .single();

    if (fetchError) throw new Error("Job not found.");

    if (hasValidFile) {
      if (existingJob.image) {
        const oldPath = existingJob.image.split("/").pop();
        await supabase.storage.from("job-images").remove([oldPath]);
      }

      const imageName = `${jobId}-${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("job-images")
        .upload(imageName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw new Error("Could not upload new job image.");

      imageUrl = `${supabaseUrl}/storage/v1/object/public/job-images/${imageName}`;
    } else {
      imageUrl = existingJob.image;
    }

    const jobData = {
      title,
      companyName,
      location: `${capitalize(city)}, ${capitalize(country)}`,
      locationType,
      averageSalary,
      maxHires,
      positionLevel,
      employmentType,
      deadline,
      description,
      image: imageUrl,
    };

    const { error: updateError } = await supabase
      .from("jobs")
      .update(jobData)
      .eq("id", jobId);

    if (updateError) throw new Error(updateError.message);

    revalidatePath("/dashboard/postedJobs");
  }
}

export async function deletePostedJob(jobId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const { data: job, error: fetchError } = await supabase
    .from("jobs")
    .select("employerId, image")
    .eq("id", jobId)
    .single();

  if (fetchError || job.employerId !== session.user.id)
    throw new Error("You are not allowed to delete this job");

  if (job.image) {
    const oldPath = job.image.split("/").pop();
    await supabase.storage.from("job-images").remove([oldPath]);
  }

  const { error } = await supabase.from("jobs").delete().eq("id", jobId);

  if (error) throw new Error("The job could not be deleted");

  revalidatePath("/dashboard/postedJobs");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/onboarding/role" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
