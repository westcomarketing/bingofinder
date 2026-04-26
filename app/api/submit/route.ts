import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, address, city, state, zip, phone, hours, website, submitterName, submitterEmail } = body;

    // Basic validation
    if (!name?.trim() || !address?.trim() || !city?.trim() || !state?.trim() || !zip?.trim()) {
      return NextResponse.json({ error: "Name, address, city, state, and zip are required." }, { status: 400 });
    }

    // Build slug
    const baseSlug = slugify(`${name}-bingo-${city}-${state}`);
    let slug = baseSlug;
    let n = 2;
    while (await prisma.bingoHall.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`;
    }

    await prisma.bingoHall.create({
      data: {
        name: name.trim(),
        slug,
        address: address.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase(),
        stateSlug: slugify(city.trim()), // will be overridden if state name known
        citySlug: slugify(city.trim()),
        zip: zip.trim(),
        phone: phone?.trim() || null,
        hours: hours?.trim() || null,
        website: website?.trim() || null,
        submitterName: submitterName?.trim() || null,
        submitterEmail: submitterEmail?.trim() || null,
        status: "pending_review",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
