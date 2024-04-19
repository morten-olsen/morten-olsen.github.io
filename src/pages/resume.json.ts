import { data } from '@/data/data.ts'

export async function GET() {
  const resume = await data.getJsonResume()
  return new Response(JSON.stringify(resume, null, 2))
}
