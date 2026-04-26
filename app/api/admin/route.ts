import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "bingoadmin2024";

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-password");
  return auth === ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, id } = body;

  if (!id || !action) {
    return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
  }

  if (action === "approve") {
    await prisma.bingoHall.update({
      where: { id: Number(id) },
      data: { status: "active" },
    });
    return NextResponse.json({ success: true });
  }

  if (action === "reject") {
    await prisma.bingoHall.update({
      where: { id: Number(id) },
      data: { status: "rejected" },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
