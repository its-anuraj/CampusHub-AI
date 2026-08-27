/**
 * CampusHub AI - Runtime System Diagnostics & Memory Telemetry
 */

export interface SystemDiagnostics {
  nodeVersion: string;
  uptimeSeconds: number;
  memoryUsageMb: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  environment: string;
  timestamp: string;
}

export function getSystemDiagnostics(): SystemDiagnostics {
  const mem = process.memoryUsage();
  return {
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMb: {
      rss: Number((mem.rss / 1024 / 1024).toFixed(2)),
      heapTotal: Number((mem.heapTotal / 1024 / 1024).toFixed(2)),
      heapUsed: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
      external: Number((mem.external / 1024 / 1024).toFixed(2))
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };
}
