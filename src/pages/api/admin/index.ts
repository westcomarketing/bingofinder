import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";

export const prerender = false;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "bingoadmin2024";

function checkAuth(request: Request): boolean {
  const auth = request.headers.get("x-admin-password");
  return auth === ADMIN_PASSWORD;
}

export const POST: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json().catch(() => ({}));
  const { action, id } = body ?? {};

  if (!id || !action) {
    return new Response(JSON.stringify({ error: "Missing id or action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "approve") {
    await prisma.bingoHall.update({
      where: { id: Number(id) },
      data: { status: "active" },
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "reject") {
    await prisma.bingoHall.update({
      where: { id: Number(id) },
      data: { status: "rejected" },
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Unknown action" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};
