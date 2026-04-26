import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STATE_NAMES, STATE_SLUGS } from "@/lib/states";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hall = await prisma.bingoHall.findUnique({ where: { slug } });
  if (!hall) return {};

  const stateName = STATE_NAMES[hall.state] ?? hall.state;

  return {
    title: `${hall.name} — Bingo in ${hall.city}, ${hall.state}`,
    description: `${hall.name} is a bingo hall in ${hall.city}, ${stateName}. Address: ${hall.address}. ${hall.hours ? `Hours: ${hall.hours}.` : ""} ${hall.phone ? `Call: ${hall.phone}.` : ""}`,
    alternates: {
      canonical: `/bingo-halls/${slug}`,
    },
  };
}

export default async function HallPage({ params }: Props) {
  const { slug } = await params;
  const hall = await prisma.bingoHall.findUnique({ where: { slug } });

  if (!hall || hall.status !== "active") notFound();

  const stateName = STATE_NAMES[hall.state] ?? hall.state;
  const stateSlug = STATE_SLUGS[hall.state];

  // Structured data (LocalBusiness schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: hall.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: hall.address,
      addressLocality: hall.city,
      addressRegion: hall.state,
      postalCode: hall.zip,
      addressCountry: "US",
    },
    telephone: hall.phone ?? undefined,
    url: hall.website ?? undefined,
    openingHours: hall.hours ?? undefined,
    geo: hall.lat && hall.lng
      ? {
          "@type": "GeoCoordinates",
          latitude: hall.lat,
          longitude: hall.lng,
        }
      : undefined,
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        &rsaquo;{" "}
        {stateSlug && (
          <>
            <Link href={`/${stateSlug}`} className="hover:underline">
              {stateName}
            </Link>{" "}
            &rsaquo;{" "}
            <Link
              href={`/${stateSlug}/${hall.citySlug}`}
              className="hover:underline"
            >
              {hall.city}
            </Link>{" "}
            &rsaquo;{" "}
          </>
        )}
        <span className="text-gray-900">{hall.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">{hall.name}</h1>
      <p className="text-lg text-gray-600 mb-6">
        Bingo Hall in {hall.city}, {hall.state}
      </p>

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        <div className="p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Location
          </h2>
          <address className="not-italic text-gray-900">
            {hall.address}
            <br />
            {hall.city}, {hall.state} {hall.zip}
          </address>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              `${hall.address}, ${hall.city}, ${hall.state} ${hall.zip}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-purple-700 hover:underline"
          >
            Get Directions →
          </a>
        </div>

        {hall.phone && (
          <div className="p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Phone
            </h2>
            <a
              href={`tel:${hall.phone.replace(/\D/g, "")}`}
              className="text-gray-900 hover:text-purple-700"
            >
              {hall.phone}
            </a>
          </div>
        )}

        {hall.hours && (
          <div className="p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Hours / Schedule
            </h2>
            <p className="text-gray-900">{hall.hours}</p>
          </div>
        )}

        {hall.website && (
          <div className="p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Website
            </h2>
            <a
              href={hall.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:underline break-all"
            >
              {hall.website}
            </a>
          </div>
        )}

        {hall.description && (
          <div className="p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              About
            </h2>
            <p className="text-gray-700 leading-relaxed">{hall.description}</p>
          </div>
        )}
      </div>

      {/* SEO content */}
      <section className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          About {hall.name}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {hall.name} is a bingo hall located in {hall.city}, {stateName}.{" "}
          {hall.hours && `Games are held ${hall.hours}.`} For the most current
          schedule and admission prices, call {hall.phone ?? "the venue"}{" "}
          directly. Schedules may change for holidays and special events.
        </p>
      </section>

      <div className="mt-6 text-center">
        {stateSlug && (
          <Link
            href={`/${stateSlug}/${hall.citySlug}`}
            className="text-purple-700 hover:underline text-sm"
          >
            ← More bingo halls in {hall.city}, {hall.state}
          </Link>
        )}
      </div>
    </main>
  );
}
