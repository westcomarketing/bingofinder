import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { STATE_SLUGS } from "@/lib/states";

export const dynamic = "force-dynamic";

const BASE_URL = "https://bingofinder.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // State pages
  const stateSlugs = Object.values(STATE_SLUGS);
  for (const slug of stateSlugs) {
    entries.push({
      url: `${BASE_URL}/${slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // City pages
  const cities = await prisma.bingoHall.groupBy({
    by: ["stateSlug", "citySlug"],
    where: { status: "active" },
  });
  for (const city of cities) {
    entries.push({
      url: `${BASE_URL}/${city.stateSlug}/${city.citySlug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Individual hall pages
  const halls = await prisma.bingoHall.findMany({
    where: { status: "active" },
    select: { slug: true, updatedAt: true },
  });
  for (const hall of halls) {
    entries.push({
      url: `${BASE_URL}/bingo-halls/${hall.slug}`,
      lastModified: hall.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
