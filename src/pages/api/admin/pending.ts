import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";

export const prerender = false;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "bingoadmin2024";

export const GET: APIRoute = async ({ request }) => {
  const auth = request.headers.get("x-admin-password");
  if (auth !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const halls = await prisma.bingoHall.findMany({
    where: { status: "pending_review" },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      phone: true,
      hours: true,
      website: true,
      submitterName: true,
      submitterEmail: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return new Response(JSON.stringify({ halls }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
