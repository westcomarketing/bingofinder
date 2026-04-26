import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugToStateName, slugToStateAbbr } from "@/lib/states";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 20;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const stateName = slugToStateName(stateSlug);
  if (!stateName) return {};

  const hall = await prisma.bingoHall.findFirst({
    where: { stateSlug, citySlug, status: "active" },
  });
  if (!hall) return {};

  return {
    title: `Bingo Halls in ${hall.city}, ${hall.state}`,
    description: `Find ${hall.city} bingo halls. Browse local bingo halls in ${hall.city}, ${stateName} with hours, addresses, and phone numbers.`,
    alternates: { canonical: `/${stateSlug}/${citySlug}` },
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const { page: pageParam } = await searchParams;
  const stateName = slugToStateName(stateSlug);
  const stateAbbr = slugToStateAbbr(stateSlug);

  if (!stateName || !stateAbbr) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = { stateSlug, citySlug, status: "active" };

  const [halls, total] = await Promise.all([
    prisma.bingoHall.findMany({
      where,
      orderBy: { name: "asc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.bingoHall.count({ where }),
  ]);

  if (total === 0) notFound();

  const cityName = halls[0]?.city ?? citySlug;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildPageUrl = (p: number) => `/${stateSlug}/${citySlug}?page=${p}`;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link>{" "}
        &rsaquo;{" "}
        <Link href={`/${stateSlug}`} className="hover:underline">{stateName}</Link>{" "}
        &rsaquo; <span className="text-gray-900">{cityName}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Bingo Halls in {cityName}, {stateAbbr}
      </h1>
      <p className="text-gray-600 mb-8">
        {total} bingo hall{total !== 1 ? "s" : ""} in {cityName}, {stateName}.
        {totalPages > 1 && ` Page ${page} of ${totalPages}.`}
      </p>

      <div className="space-y-3">
        {halls.map((hall) => (
          <Link
            key={hall.slug}
            href={`/bingo-halls/${hall.slug}`}
            className="flex flex-col sm:flex-row sm:items-center gap-3 border border-gray-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-sm transition-all"
          >
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-purple-900 leading-tight mb-0.5">
                {hall.name}
              </h2>
              <p className="text-gray-600 text-sm truncate">
                {hall.address}, {hall.city}, {hall.state} {hall.zip}
              </p>
            </div>
            <div className="flex flex-row sm:flex-col gap-2 sm:gap-1 text-xs text-gray-500 shrink-0">
              {hall.phone && (
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  📞 {hall.phone}
                </span>
              )}
              {hall.hours && (
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  🕐 {hall.hours}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              ← Previous
            </Link>
          )}
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Next →
            </Link>
          )}
        </nav>
      )}

      <section className="mt-12 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Bingo in {cityName}, {stateName}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {cityName} has {total} bingo hall{total !== 1 ? "s" : ""} available. Click any listing
          above for full details including address, hours, and contact information. Many {cityName}{" "}
          bingo halls also host special events and progressive jackpot games — call ahead to confirm
          current schedules.
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
