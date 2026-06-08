import { NextResponse } from "next/server";
import { getSubjectsFromFS } from "@/lib/content-registry.server";

export async function GET() {
  const subjects = await getSubjectsFromFS();
  return NextResponse.json(subjects);
}
