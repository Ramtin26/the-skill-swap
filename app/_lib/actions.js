"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase, supabaseUrl } from "./supabase";
import {
  buildImageName,
  capitalize,
  flagToCountryCode,
} from "@/app/helper/helper";
import {
  getApplications,
  getPostedJobs,
  getSavedJobs,
  getUser,
} from "./data-service";
import { redirect } from "next/navigation";

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
  // console.log("FormData:", formData);

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
    revalidatePath("/dashboard");

    return { status: "unsaved" };
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

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/dashboard");

    return { status: "saved" };
  }
}

export async function createApplication(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const jobId = formData.get("jobId");
  const seekerId = formData.get("seekerId");
  const fullName = formData.get("fullName");
  const note = formData.get("note")?.trim();
  const resumeFile = formData.get("resume");

  // console.log(formData);

  if (!jobId || !seekerId) throw new Error("Missing required fields");
  if (!resumeFile || resumeFile.size === 0)
    throw new Error("Resume is required");

  // try {
  // Validate file type and size
  if (resumeFile.type !== "application/pdf") {
    throw new Error("Resume must be a PDF file");
  }

  const maxSize = 5 * 1024 * 1024; // 10MB limit
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

  // console.log("Uploading resume to:", filePath);

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

  // console.log("Application created successfully for job:", jobId);

  // Revalidate relevant pages
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard/applications");

  // Redirect
  redirect("/jobs/thankyou");

  // return {
  //   success: true,
  //   message: "Application submitted successfully!",
  //   filePath,
  // };
  // } catch (error) {
  //   console.error("Error in createApplication:", error);
  //   throw new Error(error.message || "An unexpected error occurred");
  // }
}

export async function updateApplication(formData) {
  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // console.log(formData);
  const applicationId = formData.get("applicationId");
  const resumeFile = formData.get("resume");
  const note = formData.get("note")?.trim();

  // 2) Authorization
  const userApplications = await getApplications(session.user.seekerId);
  const userApplicationIds = userApplications.map(
    (application) => application.id
  );
  const application = userApplications.find(
    (application) => application.id === applicationId
  );
  // console.log(application);

  if (!userApplicationIds.includes(applicationId))
    throw new Error("You are not allowed to update this application");

  const updateData = { note };

  // try {
  // Validate file type and size
  if (resumeFile.type !== "application/pdf") {
    throw new Error("Resume must be a PDF file");
  }

  const maxSize = 5 * 1024 * 1024; // 10MB limit
  if (resumeFile.size > maxSize) {
    throw new Error("Resume file must be smaller than 5MB");
  }

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

  // console.log(updateData);

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

  // return {
  //   success: true,
  //   message: "Application updated successfully!",
  // };
  // } catch (error) {
  //   console.error("Error in updateApplication:", error);
  //   throw new Error(error.message || "An unexpected error occurred");
  // }
}

export async function deleteApplication(applicationId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // const userApplications = await getApplications(session.user.seekerId);
  // const userApplicationIds = userApplications.map(
  //   (application) => application.id
  // );

  // if (!userApplicationIds.includes(applicationId))
  //   throw new Error("You are not allowed to delete this application");

  // Get the application to retrieve its resumePath
  const { data: application, error: fetchError } = await supabase
    .from("applications")
    .select("id, seekerId, resumePath")
    .eq("id", applicationId)
    .single();

  if (fetchError || !application) {
    throw new Error("Application not found");
  }

  // Make sure it belongs to the current user
  if (application.seekerId !== session.user.seekerId) {
    throw new Error("You are not allowed to delete this application");
  }

  // Delete the file from storage first
  if (application.resumePath) {
    const { error: storageError } = await supabase.storage
      .from("resumes")
      .remove([application.resumePath]);

    if (storageError) {
      console.error("Resume removal failed:", storageError.message);
      // not throwing here — let DB delete continue
    }
  }

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", applicationId);

  // For testing
  await new Promise((res) => setTimeout(res, 3000));

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

  if (!data.length) return 0; // no ratings yet

  const avg = data.reduce((sum, row) => sum + row.rating, 0) / data.length;

  return Number(avg.toFixed(1)); // e.g. 3.5
}

export async function updateRating({ applicationId, rating }) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // ✅ 1) Get jobId + employerId for this application
  const { data: appData, error: appError } = await supabase
    .from("applications")
    .select("seekerId ,jobId, jobs!inner(employerId)")
    .eq("id", applicationId)
    .single();

  if (appError || !appData)
    throw new Error("Application not found or failed to fetch job info");

  const { seekerId, jobs } = appData;
  const employerId = jobs?.employerId;

  // ✅ 2) Auth check: only the job's employer can rate
  if (employerId !== session.user.seekerId) {
    throw new Error("You are not allowed to update this rating");
  }

  const { error } = await supabase
    .from("applications")
    .update({ rating })
    .eq("id", applicationId); // target the right application

  if (error) throw new Error("Could not update rating");

  // ➡️ return fresh average
  const avg = await getAverageRating(seekerId);

  revalidatePath("/dashboard");
  return avg;
}

export async function updateStatus({ applicationId, status }) {
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) {
    console.error("Error updating status:", error.message);
    throw new Error("Could not update status");
  }
}

export async function updateMaxHires({ jobId }) {
  // 1️⃣ Fetch current maxHires
  const { data: job, error: fetchError } = await supabase
    .from("jobs")
    .select("maxHires")
    .eq("id", jobId)
    .single();

  if (fetchError) {
    console.error("Error fetching job:", fetchError.message);
    throw new Error("Could not fetch job");
  }

  if (!job || job.maxHires <= 0) {
    throw new Error("No capacity left for this job");
  }

  // 2️⃣ Decrement
  const { error: updateError } = await supabase
    .from("jobs")
    .update({ maxHires: job.maxHires - 1 })
    .eq("id", jobId);

  if (updateError) {
    console.error("Error updating maxHires:", updateError.message);
    throw new Error("Could not update maxHires");
  }

  revalidatePath("/dashboard");
}

export async function getResumeSignedURL({ resumePath }) {
  const { data, error } = await supabase.storage
    .from("resumes") // bucket name
    .createSignedUrl(resumePath, 60 * 5); // valid for 5 mins

  if (error) {
    console.error("Error creating signed URL:", error.message);
    throw new Error("Could not create signed URL");
  }

  return data.signedUrl;
}

// export async function createJob(formData) {
//   console.log(formData);

//   // pull fields from formData
//   const title = formData.get("title");
//   const companyName = formData.get("companyName");
//   const city = formData.get("city");
//   const country = formData.get("country");
//   const locationType = formData.get("locationType");
//   const averageSalary = Number(formData.get("averageSalary"));
//   const maxHires = Number(formData.get("maxHires"));
//   const positionLevel = formData.get("positionLevel");
//   const employmentType = formData.get("employmentType");

//   const deadlineInput = formData.get("deadline");
//   const deadline = deadlineInput ? new Date(deadlineInput).toISOString() : null;

//   const description = formData.get("description");
//   const imageFile = formData.get("image");
//   const employerId = formData.get("employerId");

//   let imageUrl = null;

//   if (imageFile && imageFile.name) {
//     // give image a unique name
//     const imageName = `${Math.random()}-${imageFile.name}`.replaceAll("/", "");

//     // upload to supabase storage
//     const { error: uploadError } = await supabase.storage
//       .from("job-images")
//       .upload(imageName, imageFile, {
//         cacheControl: "3600",
//         upsert: false,
//       });

//     if (uploadError) {
//       console.error("Image upload failed:", uploadError.message);
//       throw new Error("Could not upload job image.");
//     }

//     // construct public URL
//     imageUrl = `${supabaseUrl}/storage/v1/object/public/job-images/${imageName}`;
//   }

//   // insert job row
//   const { error } = await supabase.from("jobs").insert([
//     {
//       title,
//       companyName,
//       location: `${capitalize(city)}, ${capitalize(country)}`,
//       locationType,
//       averageSalary,
//       maxHires,
//       positionLevel,
//       employmentType,
//       deadline,
//       description,
//       image: imageUrl,
//       employerId,
//     },
//   ]);

//   if (error) {
//     console.error("Insert job failed:", error.message);
//     throw new Error("Could not create job.");
//   }

//   redirect("/dashboard/postedJobs/successful");
// }

// export async function updateJob(formData) {
//   console.log(formData);
//   const jobId = formData.get("id");
//   const imageFile = formData.get("image");

//   let imageUrl = null;

//   // 1. Handle new image if uploaded
//   if (imageFile && imageFile.name) {
//     const imageName = `${Math.random()}-${imageFile.name}`.replaceAll("/", "");

//     const { error: uploadError } = await supabase.storage
//       .from("job-images")
//       .upload(imageName, imageFile, {
//         cacheControl: "3600",
//         upsert: false, // don’t overwrite an existing file
//       });

//     if (uploadError) {
//       console.error("Image upload failed:", uploadError.message);
//       throw new Error("Could not upload job image.");
//     }

//     // Construct public URL
//     imageUrl = `${supabaseUrl}/storage/v1/object/public/job-images/${imageName}`;
//   }

//   // 2. Prepare job data
//   const jobData = {
//     title: formData.get("title"),
//     companyName: formData.get("companyName"),
//     city: formData.get("city"),
//     country: formData.get("country"),
//     locationType: formData.get("locationType"),
//     averageSalary: Number(formData.get("averageSalary")),
//     maxHires: Number(formData.get("maxHires")),
//     positionLevel: formData.get("positionLevel"),
//     employmentType: formData.get("employmentType"),
//     deadline: new Date(formData.get("deadline")).toISOString(),
//     description: formData.get("description"),
//     ...(imageUrl && { image: imageUrl }),
//   };

//   console.log(jobData);

//   const { error } = await supabase.from("jobs").update(jobData).eq("id", jobId);

//   if (error) throw new Error(error.message);
// }

export async function createUpdateJob(formData) {
  const session = await auth();
  console.log(formData);
  const jobId = formData.get("id"); // null for new job
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
  const employerId = session.user.seekerId;

  // Guard for valid file
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
      // Delete old image if exists
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
      imageUrl = existingJob.image; // keep old one
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

  // Verify ownership
  const { data: job, error: fetchError } = await supabase
    .from("jobs")
    .select("employerId, image")
    .eq("id", jobId)
    .single();

  if (fetchError || job.employerId !== session.user.seekerId)
    throw new Error("You are not allowed to delete this job");

  // Delete image if exists
  if (job.image) {
    const oldPath = job.image.split("/").pop();
    await supabase.storage.from("job-images").remove([oldPath]);
  }

  const { error } = await supabase.from("jobs").delete().eq("id", jobId);

  // For testing
  await new Promise((res) => setTimeout(res, 3000));

  if (error) throw new Error("The job could not be deleted");

  revalidatePath("/dashboard/postedJobs");
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
