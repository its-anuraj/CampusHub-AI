/**
 * CampusHub AI - Server-Side Request Latency & Performance Profiler
 */

export interface LatencyRecord {
  endpoint: string;
  durationMs: number;
  statusCode: number;
  timestamp: string;
}

class Profiler {
  private records: LatencyRecord[] = [];
  private maxRecords = 100;

  public log(endpoint: string, durationMs: number, statusCode: number = 200) {
    const record: LatencyRecord = {
      endpoint,
      durationMs: Number(durationMs.toFixed(2)),
      statusCode,
      timestamp: new Date().toISOString()
    };

    this.records.unshift(record);
    if (this.records.length > this.maxRecords) {
      this.records.pop();
    }
  }

  public getMetrics() {
    if (this.records.length === 0) {
      return { avgLatencyMs: 0, p95LatencyMs: 0, totalRequests: 0 };
    }

    const durations = this.records.map(r => r.durationMs).sort((a, b) => a - b);
    const sum = durations.reduce((a, b) => a + b, 0);
    const avgLatencyMs = Number((sum / durations.length).toFixed(2));
    const p95Idx = Math.floor(durations.length * 0.95);
    const p95LatencyMs = durations[p95Idx] || durations[durations.length - 1];

    return {
      avgLatencyMs,
      p95LatencyMs,
      totalRequests: this.records.length,
      recentRecords: this.records.slice(0, 10)
    };
  }
}

export const profiler = new Profiler();
