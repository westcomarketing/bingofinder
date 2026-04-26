import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugToStateName, slugToStateAbbr } from "@/lib/states";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ state: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const stateName = slugToStateName(stateSlug);
  if (!stateName) return {};

  const hall = await prisma.bingoHall.findFirst({
    where: {
      stateSlug,
      citySlug,
      status: "active",
    },
  });
  if (!hall) return {};

  return {
    title: `Bingo Halls in ${hall.city}, ${hall.state}`,
    description: `Find ${hall.city} bingo halls. Browse local bingo halls in ${hall.city}, ${stateName} with hours, addresses, and phone numbers.`,
    alternates: {
      canonical: `/${stateSlug}/${citySlug}`,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const stateName = slugToStateName(stateSlug);
  const stateAbbr = slugToStateAbbr(stateSlug);

  if (!stateName || !stateAbbr) notFound();

  const halls = await prisma.bingoHall.findMany({
    where: { stateSlug, citySlug, status: "active" },
    orderBy: { name: "asc" },
  });

  if (halls.length === 0) notFound();

  const cityName = halls[0].city;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        &rsaquo;{" "}
        <Link href={`/${stateSlug}`} className="hover:underline">
          {stateName}
        </Link>{" "}
        &rsaquo; <span className="text-gray-900">{cityName}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Bingo Halls in {cityName}, {stateAbbr}
      </h1>
      <p className="text-gray-600 mb-8">
        {halls.length} bingo hall{halls.length !== 1 ? "s" : ""} in{" "}
        {cityName}, {stateName}.
      </p>

      <div className="space-y-4">
        {halls.map((hall) => (
          <Link
            key={hall.slug}
            href={`/bingo-halls/${hall.slug}`}
            className="block border border-gray-200 rounded-xl p-5 hover:border-purple-400 hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-semibold text-purple-900 mb-1">
              {hall.name}
            </h2>
            <p className="text-gray-700 text-sm mb-2">
              {hall.address}, {hall.city}, {hall.state} {hall.zip}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {hall.phone && (
                <span>📞 {hall.phone}</span>
              )}
              {hall.hours && (
                <span>🕐 {hall.hours}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-12 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Bingo in {cityName}, {stateName}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {cityName} has {halls.length} bingo hall
          {halls.length !== 1 ? "s" : ""} available. Click any listing above
          for full details including address, hours, and contact information.
          Many {cityName} bingo halls also host special events and progressive
          jackpot games — call ahead to confirm current schedules.
        </p>
      </section>
    </main>
  );
}
