import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  if (!q) {
    return {
      title: "Search Bingo Halls",
      description: "Search for bingo halls by city, state, name, or zip code.",
    };
  }
  return {
    title: `Bingo Halls matching "${q}"`,
    description: `Search results for "${q}". Find bingo halls by city, state, name, or zip code.`,
  };
}

const PAGE_SIZE = 20;

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  let halls: {
    id: number;
    slug: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string | null;
    hours: string | null;
    stateSlug: string;
    citySlug: string;
  }[] = [];
  let total = 0;

  if (query) {
    const where = {
      status: "active",
      OR: [
        { name: { contains: query } },
        { city: { contains: query } },
        { state: { contains: query } },
        { zip: { contains: query } },
        { address: { contains: query } },
      ],
    };

    [halls, total] = await Promise.all([
      prisma.bingoHall.findMany({
        where,
        select: {
          id: true,
          slug: true,
          name: true,
          address: true,
          city: true,
          state: true,
          zip: true,
          phone: true,
          hours: true,
          stateSlug: true,
          citySlug: true,
        },
        orderBy: [{ state: "asc" }, { city: "asc" }, { name: "asc" }],
        take: PAGE_SIZE,
        skip,
      }),
      prisma.bingoHall.count({ where }),
    ]);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams({ q: query, page: String(p) });
    return `/search?${params}`;
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Search Bingo Halls
      </h1>

      {/* Search form */}
      <form action="/search" method="GET" className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="City, state, zip, or hall name..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />
          <button
            type="submit"
            className="bg-purple-800 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      {!query && (
        <p className="text-gray-500 text-center py-12">
          Enter a city, state abbreviation, zip code, or hall name to find bingo halls near you.
        </p>
      )}

      {query && total === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-700 text-lg mb-2">
            No bingo halls found for &ldquo;{query}&rdquo;.
          </p>
          <p className="text-gray-500 text-sm">
            Try searching by state abbreviation (e.g. &quot;CA&quot;), city name, or zip code.
          </p>
          <div className="mt-6">
            <Link href="/" className="text-purple-700 hover:underline text-sm">
              Browse by state →
            </Link>
          </div>
        </div>
      )}

      {query && total > 0 && (
        <>
          <p className="text-gray-600 mb-4 text-sm">
            {total.toLocaleString()} result{total !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            {totalPages > 1 && ` — page ${page} of ${totalPages}`}
          </p>

          <div className="space-y-3">
            {halls.map((hall) => (
              <Link
                key={hall.slug}
                href={`/bingo-halls/${hall.slug}`}
                className="block border border-gray-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-sm transition-all"
              >
                <h2 className="font-semibold text-purple-900 mb-0.5">
                  {hall.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {hall.address}, {hall.city}, {hall.state} {hall.zip}
                </p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
                  {hall.phone && <span>📞 {hall.phone}</span>}
                  {hall.hours && <span>🕐 {hall.hours}</span>}
                  <Link
                    href={`/${hall.stateSlug}/${hall.citySlug}`}
                    className="text-purple-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    More in {hall.city} →
                  </Link>
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
        </>
      )}
    </main>
  );
}
