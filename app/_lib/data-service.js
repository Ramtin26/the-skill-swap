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

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getJobs() {
  // try {
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, locationType, maxHires, deadline, image", {
      head: false,
    })
    .order("title");

  if (error) {
    console.error("getJobs error:", error);
    throw new Error("Jobs could not be loaded");
  }

  return data;
  // } catch (err) {
  //   console.error("💥 getJobs failed:", err);
  //   throw err; // Let Next.js handle it or catch higher up
  // }
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
  // try {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    // Supabase "row not found" = PGRST116
    if (error.code === "PGRST116") {
      console.warn(`⚠️ No user found for email: ${email}`);
      return null; // safer than throwing
    }

    console.error("getUser error:", error);
    throw new Error(`User could not be loaded: ${error.message}`);
  }

  return data;
  // } catch (err) {
  //   console.error("💥 getUser failed:", err);
  //   throw err;
  // }
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flag"
      // "https://restcountries.com/v2/all?fields=name,flag"
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

  // return data.map((row) => row.jobId);
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
  if (jobIds.length === 0) return []; // employer has no jobs

  // console.log("jobs:", jobs);
  // console.log("Job IDs: ", jobIds);

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

  // console.log("Applications:", applications);

  if (appsError) throw new Error("Applications could not be retrieved");

  // 2) get applications for these job ids (simple select)
  // const { data: applications, error: appsError } = await supabase
  //   .from("applications")
  //   .select("id, created_at, status, rating, resumePath, jobId, seekerId")
  //   .in("jobId", jobIds);

  // console.log(applications);

  // if (appsError) {
  //   console.error("getApplicationsForEmployers: appsError", appsError);
  //   throw new Error("Applications could not be retrieved");
  // }

  return applications ?? [];
}

/////////////
// CREATE

export async function createUser(newUser) {
  try {
    // console.log("🔧 Checking/creating user for:", newUser.email);

    // 1. First check if auth user already exists
    const { data: existingAuthUsers, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("Error checking existing users:", listError);
    }

    let authUserId;
    const existingAuthUser = existingAuthUsers?.users?.find(
      (user) => user.email === newUser.email
    );

    if (existingAuthUser) {
      // console.log("✅ Auth user already exists:", existingAuthUser.id);
      authUserId = existingAuthUser.id;
    } else {
      // Create new auth user
      // console.log("🔧 Creating new Supabase auth user");
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: newUser.email,
          email_confirm: true,
          user_metadata: {
            full_name: newUser.fullName,
            provider: "google",
          },
        });

      if (authError) {
        console.error("Auth user creation failed:", authError);
        throw new Error(`Auth user creation failed: ${authError.message}`);
      }

      authUserId = authData.user.id;
      // console.log("✅ New auth user created:", authUserId);
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

    // console.log("createUser result - data:", data, "error:", error);

    if (error) {
      console.error("Database error in createUser:", error);
      throw new Error(`User could not be created: ${error.message}`);
    }

    // console.log("✅ User created successfully in users table");
    return data;
  } catch (error) {
    console.error("💥 createUser failed:", error);
    throw error;
  }
}

// export async function createUser(newUser) {
//   const { data, error } = await supabase
//     .from("users")
//     .insert([newUser])
//     .select();

//   // console.log("createUser result - data:", data, "error:", error);

//   // if (error) {
//   //   console.error("Database error in createUser:", error);
//   //   throw new Error(`User could not be created: ${error.message}`);
//   // }

//   if (error) {
//     console.error(error);
//     throw new Error("User could not be created");
//   }

//   return data;
// }
