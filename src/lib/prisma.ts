import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

function buildAdapter() {
  // Production: use TURSO_DATABASE_URL + TURSO_AUTH_TOKEN (edge-compatible remote libsql)
  if (process.env.TURSO_DATABASE_URL) {
    return new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  // Development: use local SQLite file
  const dbPath = path.resolve(process.cwd(), "dev.db");
  return new PrismaLibSql({ url: `file:${dbPath}` });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: buildAdapter() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
