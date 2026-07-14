import { prisma } from "../../infrastructure/database/prisma.client.js";
import { logger } from "../../infrastructure/logging/index.js";

interface DependencyCheck {
  status: "up" | "down";
  latencyMs?: number;
  error?: string;
}

interface MemoryStats {
  rssMb: number;
  heapUsedMb: number;
  heapTotalMb: number;
  externalMb: number;
}

interface ReadinessResult {
  isHealthy: boolean;
  checks: Record<string, DependencyCheck>;
  memory: MemoryStats;
  uptimeSeconds: number;
}

const checkDatabase = async (): Promise<DependencyCheck> => {
  const start = process.hrtime();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [seconds, nanoseconds] = process.hrtime(start);
    return {
      status: "up",
      latencyMs: Math.round(seconds * 1000 + nanoseconds / 1e6),
    };
  } catch (error) {
    logger.error({ error }, "Health check: database unreachable");
    return { status: "down", error: "Connection failed" };
  }
};

const getMemoryStats = (): MemoryStats => {
  const memoryUsage = process.memoryUsage();
  return {
    rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
    heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    externalMb: Math.round(memoryUsage.external / 1024 / 1024),
  };
};

export const healthService = {
  getLiveness: () => ({
    status: "UP",
    version: process.env.npm_package_version ?? "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
  }),

  getReadiness: async (): Promise<ReadinessResult> => {
    const [database] = await Promise.all([checkDatabase()]);

    const checks = { database };
    const isHealthy = Object.values(checks).every(
      (check) => check.status === "up",
    );

    return {
      isHealthy,
      checks,
      memory: getMemoryStats(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  },
};
