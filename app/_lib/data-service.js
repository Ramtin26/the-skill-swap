import { notFound } from "next/navigation";
import { supabase } from "./supabase";

/////////
// GET

export async function getJob(id) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, locationType, maxHires, deadline, image")
    .order("title");

  if (error) {
    throw new Error("Jobs could not be loaded");
  }

  return data;
}

export async function getPostedJobs(employerId) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employerId", employerId);

  if (error) throw new Error("Posted jobs could not be retrieved");

  return data;
}

export async function getUser(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // no row found
    console.error("getUser error:", error);
    throw new Error(`User could not be loaded: ${error.message}`);
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flag"
    );
    const countries = res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

export async function getSavedJobs(seekerId) {
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("id,jobId, jobs(id,title,companyName,location,averageSalary,image)")
    .eq("seekerId", seekerId);

  if (error) throw new Error("Saved jobs could not be retrieved");

  return data;
}

export async function getApplication(id) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Application could not get loaded");
  }

  return data;
}

export async function getAllApplications() {
  const { data, error } = await supabase
    .from("applications")
    .select("id, status, note, jobs(id,title)");

  if (error) throw new Error("All applications could not get loaded");

  return data;
}

export async function getApplications(seekerId) {
  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, created_at, resumePath, status, note, rating, jobs(id,title, companyName, image, locationType, positionLevel, averageSalary, deadline)"
    )
    .eq("seekerId", seekerId);

  if (error) {
    console.error(error);
    throw new Error("Applications could not get loaded");
  }

  return data;
}

export async function getApplicationsForEmployers(employerId) {
  // 1. Get all job IDs for this employer
  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id")
    .eq("employerId", employerId);

  if (jobsError) throw new Error("Jobs could not be retrieved");

  const jobIds = jobs.map((job) => job.id);
  if (jobIds.length === 0) return [];

  // 2. Get applications for those jobs
  const { data: applications, error: appsError } = await supabase
    .from("applications")
    .select(
      `
      id,
      created_at,
      status,
      rating,
      resumePath,
      jobs:jobId (id, title, companyName, maxHires),
      users:seekerId (id, fullName)
    `
    )
    .in("jobId", jobIds);

  if (appsError) throw new Error("Applications could not be retrieved");

  return applications ?? [];
}

/////////////
// CREATE

export async function createUser(newUser) {
  try {
    // 1. First check if auth user already exists
    const { data: existingAuthUsers, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("listUsers error:", listError);
    }

    let authUserId;
    const existingAuthUser = existingAuthUsers?.users?.find(
      (user) => user.email === newUser.email
    );

    if (existingAuthUser) {
      authUserId = existingAuthUser.id;
    } else {
      // Create new auth user
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: newUser.email,
          email_confirm: true,
          user_metadata: {
            full_name: newUser.fullName,
            provider: "google",
          },
        });

      if (authError)
        throw new Error(`Auth user creation failed: ${authError.message}`);

      authUserId = authData.user.id;
    }

    // 2. Now create/update the users table row
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: authUserId,
          ...newUser,
        },
      ])
      .select();

    if (error) throw new Error(`User could not be created: ${error.message}`);

    return data;
  } catch (error) {
    console.error("createUser failed:", error);
    throw error;
  }
}
