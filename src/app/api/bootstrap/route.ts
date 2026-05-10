import { getBootstrapPayload } from "@/server/repositories/movequest-repository";

export async function GET() {
  const payload = await getBootstrapPayload();

  return Response.json(payload);
}
