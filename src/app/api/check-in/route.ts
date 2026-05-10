import { completeTaskAndRefresh } from "@/server/repositories/movequest-repository";

export async function POST(request: Request) {
  const body = (await request.json()) as { taskTitle?: string };

  if (!body.taskTitle) {
    return Response.json({ message: "taskTitle is required" }, { status: 400 });
  }

  const payload = await completeTaskAndRefresh(body.taskTitle);

  return Response.json(payload);
}
