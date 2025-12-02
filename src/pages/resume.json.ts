import { data } from "~/data/data"

export async function GET() {
  const resume = await data.profile.getResumeJson();
  return new Response(JSON.stringify(resume, null, 2))
}
