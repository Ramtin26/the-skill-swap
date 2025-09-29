import { NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";
import { getSavedJobs } from "@/app/_lib/data-service";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json([], { status: 200 });

  const userId = session.user.id;
  const data = await getSavedJobs(userId);

  return NextResponse.json(data.map((row) => row.jobId));
}
