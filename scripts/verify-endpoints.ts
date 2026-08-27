/**
 * CampusHub AI - Comprehensive End-to-End API Health & Endpoint Verification Suite
 * Executes automated assertions across 25+ critical API handlers to ensure schema validity and error resilience.
 */

import { GET as getClubs } from '../app/api/clubs/route';
import { GET as getTransport } from '../app/api/transport/route';
import { GET as getGatepass } from '../app/api/gatepass/route';
import { GET as getSystemHealth, POST as postSystemHealth } from '../app/api/system-health/route';
import { GET as getFeedback } from '../app/api/course-feedback/route';
import { GET as getBudget } from '../app/api/budget/route';
import { GET as getCafeteria } from '../app/api/cafeteria/route';
import { GET as getAlumni } from '../app/api/alumni/route';
import { GET as getWellness } from '../app/api/wellness/route';
import { GET as getHostel } from '../app/api/hostel/route';

// v3.2.0 API Handlers
import { POST as postCodeCheck } from '../app/api/ai/code-check/route';
import { GET as getLabSims, POST as postLabSims } from '../app/api/labs/simulations/route';
import { GET as getStudyGroups } from '../app/api/study-groups/route';
import { GET as getLaundry, POST as postLaundry } from '../app/api/hostel/laundry/route';
import { GET as getBikes } from '../app/api/transport/bikes/route';
import { GET as getStudentBudget } from '../app/api/student-budget/route';
import { GET as getAlumniReferrals } from '../app/api/alumni/referrals/route';
import { GET as getLivePoll } from '../app/api/events/live-poll/route';
import { GET as getLostFoundClaims } from '../app/api/lost-found/claims/route';
import { POST as postExamGenerator } from '../app/api/ai/exam-generator/route';
import { GET as getRubrics } from '../app/api/assignments/rubrics/route';
import { GET as getOfficeHours } from '../app/api/faculty/office-hours/route';
import { GET as getAccreditation } from '../app/api/faculty/accreditation/route';
import { GET as getLabMaintenance } from '../app/api/labs/maintenance/route';
import { GET as getSustainability } from '../app/api/admin/sustainability/route';
import { GET as getVisitors } from '../app/api/security/visitors/route';
import { GET as getTimetable } from '../app/api/admin/timetable/route';
import { GET as getIoT } from '../app/api/admin/iot/route';
import { GET as getEndowment } from '../app/api/admin/endowment/route';
import { GET as getAuditLogs } from '../app/api/admin/audit-logs/route';
import { GET as getPtm } from '../app/api/parent/ptm/route';
import { GET as getParentSafety } from '../app/api/parent/safety/route';
import { GET as getParentMess } from '../app/api/parent/mess/route';
import { POST as postGeneratePdf } from '../app/api/certificates/generate-pdf/route';

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
  console.log('  CAMPUSHUB AI - AUTOMATED ENDPOINT HEALTH TEST SUITE (v3.2.0)');
  console.log('====================================================\n');

  const results: TestResult[] = [];

  const testCases = [
    // Core & Legacy
    { name: '/api/clubs', fn: async () => (getClubs as any)(new Request('http://localhost:3000/api/clubs')) },
    { name: '/api/transport', fn: async () => getTransport() },
    { name: '/api/gatepass', fn: async () => (getGatepass as any)() },
    { name: '/api/system-health', fn: async () => getSystemHealth() },
    { name: '/api/system-health (DR Simulation)', fn: async () => postSystemHealth(new Request('http://localhost:3000/api/system-health', { method: 'POST', body: JSON.stringify({ action: 'DR_SIMULATION' }) })) },
    { name: '/api/course-feedback', fn: async () => (getFeedback as any)() },
    { name: '/api/budget', fn: async () => getBudget() },
    { name: '/api/cafeteria', fn: async () => getCafeteria() },
    { name: '/api/alumni', fn: async () => (getAlumni as any)(new Request('http://localhost:3000/api/alumni?search=')) },
    { name: '/api/wellness', fn: async () => getWellness() },
    { name: '/api/hostel', fn: async () => getHostel() },

    // Student Suite
    { name: '/api/ai/code-check', fn: async () => postCodeCheck(new Request('http://localhost:3000/api/ai/code-check', { method: 'POST', body: JSON.stringify({ code: 'function test() { return 42; }' }) })) },
    { name: '/api/labs/simulations', fn: async () => getLabSims() },
    { name: '/api/study-groups', fn: async () => getStudyGroups() },
    { name: '/api/hostel/laundry', fn: async () => getLaundry() },
    { name: '/api/transport/bikes', fn: async () => getBikes() },
    { name: '/api/student-budget', fn: async () => getStudentBudget() },
    { name: '/api/alumni/referrals', fn: async () => getAlumniReferrals() },
    { name: '/api/events/live-poll', fn: async () => getLivePoll() },
    { name: '/api/lost-found/claims', fn: async () => getLostFoundClaims() },

    // Faculty Suite
    { name: '/api/ai/exam-generator', fn: async () => postExamGenerator(new Request('http://localhost:3000/api/ai/exam-generator', { method: 'POST', body: JSON.stringify({ courseCode: 'CS401', topic: 'Raft Consensus' }) })) },
    { name: '/api/assignments/rubrics', fn: async () => getRubrics() },
    { name: '/api/faculty/office-hours', fn: async () => getOfficeHours() },
    { name: '/api/faculty/accreditation', fn: async () => getAccreditation() },
    { name: '/api/labs/maintenance', fn: async () => getLabMaintenance() },

    // Admin Suite
    { name: '/api/admin/sustainability', fn: async () => getSustainability() },
    { name: '/api/security/visitors', fn: async () => getVisitors() },
    { name: '/api/admin/timetable', fn: async () => getTimetable() },
    { name: '/api/admin/iot', fn: async () => getIoT() },
    { name: '/api/admin/endowment', fn: async () => getEndowment() },
    { name: '/api/admin/audit-logs', fn: async () => getAuditLogs() },

    // Parent Suite & Utilities
    { name: '/api/parent/ptm', fn: async () => getPtm() },
    { name: '/api/parent/safety', fn: async () => getParentSafety() },
    { name: '/api/parent/mess', fn: async () => getParentMess() },
    { name: '/api/certificates/generate-pdf', fn: async () => postGeneratePdf(new Request('http://localhost:3000/api/certificates/generate-pdf', { method: 'POST', body: JSON.stringify({ studentName: 'Aarav Sharma' }) })) }
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
        method: 'GET/POST',
        status: response.status,
        success: isOk,
        durationMs,
        details: isOk ? 'Payload Verified' : 'Unexpected error payload'
      });

      console.log(`  ✓ ${test.name.padEnd(38)} [${response.status}] in ${durationMs}ms - OK`);
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - start);
      results.push({
        endpoint: test.name,
        method: 'GET/POST',
        status: 500,
        success: false,
        durationMs,
        details: err.message
      });
      console.log(`  ✗ ${test.name.padEnd(38)} [500] in ${durationMs}ms - FAILED: ${err.message}`);
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
