import type { APIRoute } from "astro";
import { prisma } from "../lib/prisma";
import { STATE_SLUGS } from "../lib/states";

export const prerender = false;

const BASE_URL = "https://bingofinder.com";

interface Entry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

function entryXml(entry: Entry): string {
  return [
    "<url>",
    `<loc>${entry.loc}</loc>`,
    entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : "",
    entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : "",
    entry.priority ? `<priority>${entry.priority}</priority>` : "",
    "</url>",
  ]
    .filter(Boolean)
    .join("");
}

export const GET: APIRoute = async () => {
  const entries: Entry[] = [
    {
      loc: BASE_URL,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "1.0",
    },
  ];

  for (const slug of Object.values(STATE_SLUGS)) {
    entries.push({
      loc: `${BASE_URL}/${slug}`,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  const cities = await prisma.bingoHall.groupBy({
    by: ["stateSlug", "citySlug"],
    where: { status: "active" },
  });
  for (const city of cities) {
    entries.push({
      loc: `${BASE_URL}/${city.stateSlug}/${city.citySlug}`,
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  const halls = await prisma.bingoHall.findMany({
    where: { status: "active" },
    select: { slug: true, updatedAt: true },
  });
  for (const hall of halls) {
    entries.push({
      loc: `${BASE_URL}/bingo-halls/${hall.slug}`,
      lastmod: hall.updatedAt.toISOString(),
      changefreq: "monthly",
      priority: "0.5",
    });
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries.map(entryXml).join("") +
    `</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
};
