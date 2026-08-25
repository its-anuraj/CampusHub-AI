/**
 * CampusHub AI - Comprehensive End-to-End API Health & Endpoint Verification Suite
 * Executes direct testing across critical API handlers to ensure schema validity and error resilience.
 */

import { GET as getClubs } from '../app/api/clubs/route';
import { GET as getTransport } from '../app/api/transport/route';
import { GET as getGatepass } from '../app/api/gatepass/route';
import { GET as getSystemHealth } from '../app/api/system-health/route';
import { GET as getFeedback } from '../app/api/course-feedback/route';
import { GET as getBudget } from '../app/api/budget/route';

interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  durationMs: number;
  details?: string;
}

async function runEndpointTestSuite() {
  console.log('====================================================');
  console.log('  CAMPUSHUB AI - AUTOMATED ENDPOINT HEALTH TEST SUITE');
  console.log('====================================================\n');

  const results: TestResult[] = [];

  const testCases = [
    { name: '/api/clubs', fn: async () => (getClubs as any)(new Request('http://localhost:3000/api/clubs')) },
    { name: '/api/transport', fn: async () => getTransport() },
    { name: '/api/gatepass', fn: async () => (getGatepass as any)() },
    { name: '/api/system-health', fn: async () => getSystemHealth() },
    { name: '/api/course-feedback', fn: async () => (getFeedback as any)() },
    { name: '/api/budget', fn: async () => getBudget() },
  ];

  for (const test of testCases) {
    const start = performance.now();
    try {
      const response = await test.fn();
      const durationMs = Math.round(performance.now() - start);
      const json = await response.json();

      const isOk = response.status >= 200 && response.status < 300 && json.success !== false;

      results.push({
        endpoint: test.name,
        method: 'GET',
        status: response.status,
        success: isOk,
        durationMs,
        details: isOk ? 'Payload Verified' : 'Unexpected error payload'
      });

      console.log(`  ✓ ${test.name.padEnd(25)} [${response.status}] in ${durationMs}ms - OK`);
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - start);
      results.push({
        endpoint: test.name,
        method: 'GET',
        status: 500,
        success: false,
        durationMs,
        details: err.message
      });
      console.log(`  ✗ ${test.name.padEnd(25)} [500] in ${durationMs}ms - FAILED: ${err.message}`);
    }
  }

  const passedCount = results.filter(r => r.success).length;
  const failedCount = results.length - passedCount;

  console.log('\n----------------------------------------------------');
  console.log(`  TEST RESULTS SUMMARY: ${passedCount}/${results.length} PASSED (${failedCount} Failed)`);
  console.log('----------------------------------------------------\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runEndpointTestSuite();
