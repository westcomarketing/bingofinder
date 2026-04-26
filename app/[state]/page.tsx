import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugToStateName, slugToStateAbbr, STATE_SLUGS } from "@/lib/states";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ state: string }>;
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 40;

export async function generateStaticParams() {
  return Object.values(STATE_SLUGS).map((state) => ({ state }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const stateName = slugToStateName(stateSlug);
  if (!stateName) return {};
  return {
    title: `Bingo Halls in ${stateName}`,
    description: `Find bingo halls in ${stateName}. Browse local bingo halls by city with hours, phone numbers, and directions.`,
    alternates: { canonical: `/${stateSlug}` },
  };
}

async function getStateCities(stateAbbr: string) {
  return prisma.bingoHall.groupBy({
    by: ["city", "citySlug"],
    _count: { id: true },
    where: { state: stateAbbr, status: "active" },
    orderBy: { city: "asc" },
  });
}

export default async function StatePage({ params, searchParams }: Props) {
  const { state: stateSlug } = await params;
  const { page: pageParam } = await searchParams;
  const stateName = slugToStateName(stateSlug);
  const stateAbbr = slugToStateAbbr(stateSlug);

  if (!stateName || !stateAbbr) notFound();

  const allCities = await getStateCities(stateAbbr);
  const totalHalls = allCities.reduce((sum, c) => sum + c._count.id, 0);

  if (totalHalls === 0) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.ceil(allCities.length / PAGE_SIZE);
  const pagedCities = allCities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const buildPageUrl = (p: number) => `/${stateSlug}?page=${p}`;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link>{" "}
        &rsaquo; <span className="text-gray-900">{stateName}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Bingo Halls in {stateName}
      </h1>
      <p className="text-gray-600 mb-8">
        {totalHalls} bingo hall{totalHalls !== 1 ? "s" : ""} across{" "}
        {allCities.length} {allCities.length !== 1 ? "cities" : "city"} in {stateName}.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pagedCities.map((city) => (
          <Link
            key={city.citySlug}
            href={`/${stateSlug}/${city.citySlug}`}
            className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{city.city}</span>
            <span className="text-sm text-gray-500 ml-2 shrink-0">
              {city._count.id} hall{city._count.id !== 1 ? "s" : ""}
            </span>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              ← Previous
            </Link>
          )}
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={buildPageUrl(page + 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Next →
            </Link>
          )}
        </nav>
      )}

      <section className="mt-12 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Finding Bingo in {stateName}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {stateName} has {totalHalls} bingo halls spanning {allCities.length} cities. Many locations
          are hosted at VFW posts, American Legion halls, Eagles lodges, and Knights of Columbus chapters.
          Check individual listings for current schedules as hours may vary by season.
        </p>
        <div className="mt-4">
          <Link href="/submit" className="text-purple-700 hover:underline text-sm">
            Know a hall not listed? Submit it →
          </Link>
        </div>
      </section>
    </main>
  );
}
