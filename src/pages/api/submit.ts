import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const prerender = false;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      name,
      address,
      city,
      state,
      zip,
      phone,
      hours,
      website,
      submitterName,
      submitterEmail,
    } = body ?? {};

    if (!name?.trim() || !address?.trim() || !city?.trim() || !state?.trim() || !zip?.trim()) {
      return new Response(
        JSON.stringify({ error: "Name, address, city, state, and zip are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

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
        stateSlug: slugify(city.trim()),
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Submit error:", err);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
