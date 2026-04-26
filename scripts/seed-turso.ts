/**
 * seed-turso.ts
 * Copies all active bingo halls from local dev.db → Turso remote DB.
 * Run via: TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/seed-turso.ts
 */
import { PrismaClient as LocalClient } from "../app/generated/prisma/client";
import { PrismaLibSql as LocalAdapter } from "@prisma/adapter-libsql";
import path from "path";

// Source: local SQLite
const localAdapter = new LocalAdapter({ url: `file:${path.resolve(process.cwd(), "dev.db")}` });
const localDb = new LocalClient({ adapter: localAdapter });

// Destination: Turso
const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;
if (!TURSO_DATABASE_URL) throw new Error("TURSO_DATABASE_URL not set");

const remoteAdapter = new LocalAdapter({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN });
const remoteDb = new LocalClient({ adapter: remoteAdapter });

async function main() {
  const halls = await localDb.bingoHall.findMany({ where: { status: "active" } });
  console.log(`Copying ${halls.length} halls to Turso...`);

  let count = 0;
  for (const hall of halls) {
    await remoteDb.bingoHall.upsert({
      where: { slug: hall.slug },
      update: {},
      create: {
        name: hall.name,
        slug: hall.slug,
        address: hall.address,
        city: hall.city,
        state: hall.state,
        stateSlug: hall.stateSlug,
        citySlug: hall.citySlug,
        zip: hall.zip,
        phone: hall.phone,
        hours: hall.hours,
        website: hall.website,
        description: hall.description,
        lat: hall.lat,
        lng: hall.lng,
        status: hall.status,
      },
    });
    count++;
    if (count % 100 === 0) console.log(`  ${count}/${halls.length}...`);
  }

  console.log(`Done! ${count} halls copied to Turso.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await localDb.$disconnect();
    await remoteDb.$disconnect();
  });
