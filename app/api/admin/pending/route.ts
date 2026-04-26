import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "bingoadmin2024";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  if (auth !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  return NextResponse.json({ halls });
}
