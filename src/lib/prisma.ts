import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Clear stale cached instance on every hot reload in dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = undefined;
}

function createPrismaClient() {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !user || !password || !database) {
    throw new Error(`[prisma] missing env vars: DB_HOST=${host} DB_USER=${user} DB_NAME=${database}`);
  }

  console.log("[prisma] connecting to", host, port, user, database);

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    ssl: true,
    connectTimeout: 20000,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
