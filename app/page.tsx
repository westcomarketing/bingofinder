import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATE_NAMES, STATE_SLUGS } from "@/lib/states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BingoFinder — Find Bingo Halls Near You in the United States",
  description:
    "Discover bingo halls near you across all 50 states. Search 500+ local bingo halls with hours, phone numbers, and directions. Find your next game in under 30 seconds.",
  openGraph: {
    title: "BingoFinder — Find Bingo Halls Near You",
    description:
      "Discover 500+ bingo halls across the United States. Find local games near you.",
    type: "website",
  },
};

async function getStateCounts() {
  const counts = await prisma.bingoHall.groupBy({
    by: ["state"],
    _count: { id: true },
    orderBy: { state: "asc" },
    where: { status: "active" },
  });
  return counts;
}

export default async function HomePage() {
  const stateCounts = await getStateCounts();
  const totalHalls = stateCounts.reduce((sum, s) => sum + s._count.id, 0);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-purple-900 to-purple-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Bingo Halls Near You
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            {totalHalls.toLocaleString()}+ bingo halls across all 50 states.
            Find your next game in seconds.
          </p>
          <div className="max-w-xl mx-auto">
            <form action="/search" method="GET" className="flex gap-2">
              <input
                type="text"
                name="q"
                placeholder="Search by city, state, or zip code..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-lg"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold px-6 py-3 rounded-lg text-lg"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* State directory */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Browse Bingo Halls by State
        </h2>
        <p className="text-gray-600 mb-8">
          Select your state to find local bingo halls, hours, and contact info.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {stateCounts.map((sc) => {
            const stateName = STATE_NAMES[sc.state];
            const stateSlug = STATE_SLUGS[sc.state];
            if (!stateName || !stateSlug) return null;
            return (
              <Link
                key={sc.state}
                href={`/${stateSlug}`}
                className="block border border-gray-200 rounded-lg p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors"
              >
                <div className="font-semibold text-gray-900 text-sm">
                  {stateName}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {sc._count.id} hall{sc._count.id !== 1 ? "s" : ""}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO content */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About BingoFinder
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              BingoFinder is the most trusted, comprehensive directory of bingo
              halls in the United States. Whether you&apos;re looking for a fun
              Friday night out, a community fundraiser, or a regular weekly game,
              we help you find the perfect local bingo hall in under 30 seconds.
            </p>
            <p>
              Our database includes {totalHalls.toLocaleString()}+ verified
              bingo halls across all 50 states, with accurate hours, phone
              numbers, and directions. We cover VFW halls, American Legion posts,
              Knights of Columbus, Eagles, Moose Lodge, and dedicated bingo
              centers.
            </p>
            <p>
              Bingo is one of America&apos;s most popular social games, enjoyed
              by millions of players every week. From church halls to dedicated
              bingo palaces, we&apos;ve got you covered wherever you are.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
