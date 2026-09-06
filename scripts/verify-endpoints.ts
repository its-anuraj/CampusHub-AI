/**
 * CampusHub AI - Comprehensive End-to-End API Health & Endpoint Verification Suite
 * Executes automated assertions across 50+ critical API handlers to ensure schema validity and error resilience.
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
import { GET as getLabSims } from '../app/api/labs/simulations/route';
import { GET as getStudyGroups } from '../app/api/study-groups/route';
import { GET as getLaundry } from '../app/api/hostel/laundry/route';
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

// v3.3.0 Mega Update API Handlers
import { GET as getResearchSummarizer, POST as postResearchSummarizer } from '../app/api/ai/research-summarizer/route';
import { GET as getMockInterview, POST as postMockInterview } from '../app/api/ai/mock-interview/route';
import { GET as getCarpool, POST as postCarpool } from '../app/api/transport/carpool/route';
import { GET as getTutoring, POST as postTutoring } from '../app/api/tutoring/route';
import { GET as getPrinting, POST as postPrinting } from '../app/api/printing/route';
import { GET as getChores, POST as postChores } from '../app/api/hostel/chores/route';
import { GET as getSports, POST as postSports } from '../app/api/sports/route';
import { GET as getFacultyGrants, POST as postFacultyGrants } from '../app/api/faculty/grants/route';
import { GET as getFacultyTA, POST as postFacultyTA } from '../app/api/faculty/ta/route';
import { GET as getFacultyCIE, POST as postFacultyCIE } from '../app/api/faculty/cie/route';
import { GET as getFacultyGuestLectures, POST as postFacultyGuestLectures } from '../app/api/faculty/guest-lectures/route';
import { GET as getFacultyEarlyWarning, POST as postFacultyEarlyWarning } from '../app/api/faculty/early-warning/route';
import { GET as getFacultyAppraisal, POST as postFacultyAppraisal } from '../app/api/faculty/appraisal/route';
import { GET as getFacultyIPR, POST as postFacultyIPR } from '../app/api/faculty/ipr/route';
import { GET as getAdminEVCharging, POST as postAdminEVCharging } from '../app/api/admin/ev-charging/route';
import { GET as getAdminProcurement, POST as postAdminProcurement } from '../app/api/admin/procurement/route';
import { GET as getAdminWater, POST as postAdminWater } from '../app/api/admin/water/route';
import { GET as getAdminEmergencyBroadcast, POST as postAdminEmergencyBroadcast } from '../app/api/admin/emergency-broadcast/route';
import { GET as getAdminRFID, POST as postAdminRFID } from '../app/api/admin/rfid/route';
import { GET as getAdminRankings } from '../app/api/admin/rankings/route';
import { GET as getParentHealth, POST as postParentHealth } from '../app/api/parent/health/route';
import { GET as getParentFeeInstallments, POST as postParentFeeInstallments } from '../app/api/parent/fee-installments/route';
import { GET as getParentLivestreams, POST as postParentLivestreams } from '../app/api/parent/livestreams/route';
import { POST as postChangePassword } from '../app/api/auth/change-password/route';

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
  console.log('  CAMPUSHUB AI - AUTOMATED ENDPOINT HEALTH TEST SUITE (v3.3.0)');
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

    // Student Suite v3.2.0
    { name: '/api/ai/code-check', fn: async () => postCodeCheck(new Request('http://localhost:3000/api/ai/code-check', { method: 'POST', body: JSON.stringify({ code: 'function test() { return 42; }' }) })) },
    { name: '/api/labs/simulations', fn: async () => getLabSims() },
    { name: '/api/study-groups', fn: async () => getStudyGroups() },
    { name: '/api/hostel/laundry', fn: async () => getLaundry() },
    { name: '/api/transport/bikes', fn: async () => getBikes() },
    { name: '/api/student-budget', fn: async () => getStudentBudget() },
    { name: '/api/alumni/referrals', fn: async () => getAlumniReferrals() },
    { name: '/api/events/live-poll', fn: async () => getLivePoll() },
    { name: '/api/lost-found/claims', fn: async () => getLostFoundClaims() },

    // Faculty Suite v3.2.0
    { name: '/api/ai/exam-generator', fn: async () => postExamGenerator(new Request('http://localhost:3000/api/ai/exam-generator', { method: 'POST', body: JSON.stringify({ courseCode: 'CS401', topic: 'Raft Consensus' }) })) },
    { name: '/api/assignments/rubrics', fn: async () => getRubrics() },
    { name: '/api/faculty/office-hours', fn: async () => getOfficeHours() },
    { name: '/api/faculty/accreditation', fn: async () => getAccreditation() },
    { name: '/api/labs/maintenance', fn: async () => getLabMaintenance() },

    // Admin Suite v3.2.0
    { name: '/api/admin/sustainability', fn: async () => getSustainability() },
    { name: '/api/security/visitors', fn: async () => getVisitors() },
    { name: '/api/admin/timetable', fn: async () => getTimetable() },
    { name: '/api/admin/iot', fn: async () => getIoT() },
    { name: '/api/admin/endowment', fn: async () => getEndowment() },
    { name: '/api/admin/audit-logs', fn: async () => getAuditLogs() },

    // Parent Suite & Utilities v3.2.0
    { name: '/api/parent/ptm', fn: async () => getPtm() },
    { name: '/api/parent/safety', fn: async () => getParentSafety() },
    { name: '/api/parent/mess', fn: async () => getParentMess() },
    { name: '/api/certificates/generate-pdf', fn: async () => postGeneratePdf(new Request('http://localhost:3000/api/certificates/generate-pdf', { method: 'POST', body: JSON.stringify({ type: 'TRANSCRIPT', studentName: 'Aditya Singh', rollNo: 'CS2026-088' }) })) },

    // NEW v3.3.0 Endpoints
    { name: '/api/ai/research-summarizer (GET)', fn: async () => getResearchSummarizer() },
    { name: '/api/ai/research-summarizer (POST)', fn: async () => postResearchSummarizer(new Request('http://localhost:3000/api/ai/research-summarizer', { method: 'POST', body: JSON.stringify({ paperTitle: 'Transformers in IoT', abstractText: 'Evaluating self-attention on resource-constrained MCU nodes.' }) })) },
    { name: '/api/ai/mock-interview (GET)', fn: async () => getMockInterview() },
    { name: '/api/ai/mock-interview (POST)', fn: async () => postMockInterview(new Request('http://localhost:3000/api/ai/mock-interview', { method: 'POST', body: JSON.stringify({ trackId: 'track-dsa', questionId: 'q1', studentAnswer: 'An LRU Cache can be implemented using a hash map combined with a doubly linked list.' }) })) },
    { name: '/api/transport/carpool (GET)', fn: async () => getCarpool() },
    { name: '/api/tutoring (GET)', fn: async () => getTutoring() },
    { name: '/api/printing (GET)', fn: async () => getPrinting() },
    { name: '/api/hostel/chores (GET)', fn: async () => getChores() },
    { name: '/api/sports (GET)', fn: async () => getSports() },
    { name: '/api/faculty/grants (GET)', fn: async () => getFacultyGrants() },
    { name: '/api/faculty/ta (GET)', fn: async () => getFacultyTA() },
    { name: '/api/faculty/cie (GET)', fn: async () => getFacultyCIE() },
    { name: '/api/faculty/guest-lectures (GET)', fn: async () => getFacultyGuestLectures() },
    { name: '/api/faculty/early-warning (GET)', fn: async () => getFacultyEarlyWarning() },
    { name: '/api/faculty/appraisal (GET)', fn: async () => getFacultyAppraisal() },
    { name: '/api/faculty/ipr (GET)', fn: async () => getFacultyIPR() },
    { name: '/api/admin/ev-charging (GET)', fn: async () => getAdminEVCharging() },
    { name: '/api/admin/procurement (GET)', fn: async () => getAdminProcurement() },
    { name: '/api/admin/water (GET)', fn: async () => getAdminWater() },
    { name: '/api/admin/emergency-broadcast (GET)', fn: async () => getAdminEmergencyBroadcast() },
    { name: '/api/admin/rfid (GET)', fn: async () => getAdminRFID() },
    { name: '/api/admin/rankings (GET)', fn: async () => getAdminRankings() },
    { name: '/api/parent/health (GET)', fn: async () => getParentHealth() },
    { name: '/api/parent/fee-installments (GET)', fn: async () => getParentFeeInstallments() },
    { name: '/api/parent/livestreams (GET)', fn: async () => getParentLivestreams() },
    { name: '/api/auth/change-password (POST)', fn: async () => postChangePassword(new Request('http://localhost:3000/api/auth/change-password', { method: 'POST', body: JSON.stringify({ email: 'ajsinghindolia@gmail.com', oldPassword: '001234', newPassword: '001234new' }) })) },
    { name: '/api/auth/change-password (Reset to 001234)', fn: async () => postChangePassword(new Request('http://localhost:3000/api/auth/change-password', { method: 'POST', body: JSON.stringify({ email: 'ajsinghindolia@gmail.com', oldPassword: '001234new', newPassword: '001234' }) })) },
  ];


  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    const start = performance.now();
    try {
      const response = await tc.fn();
      const duration = Math.round(performance.now() - start);
      const json = await response.json();

      const isOk = response.status >= 200 && response.status < 300 && (json.success === true || Array.isArray(json) || json.title || json.code);

      if (isOk) {
        passed++;
        console.log(`  \x1b[32m✔ PASS\x1b[0m [${response.status}] ${tc.name} (${duration}ms)`);
        results.push({ endpoint: tc.name, method: 'TEST', status: response.status, success: true, durationMs: duration });
      } else {
        failed++;
        console.log(`  \x1b[31m✖ FAIL\x1b[0m [${response.status}] ${tc.name} (${duration}ms) - ${json.error || json.message || 'Validation Failed'}`);
        results.push({ endpoint: tc.name, method: 'TEST', status: response.status, success: false, durationMs: duration, details: json.error });
      }
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      failed++;
      console.log(`  \x1b[31m✖ ERR\x1b[0m  ${tc.name} (${duration}ms) - ${err.message}`);
      results.push({ endpoint: tc.name, method: 'TEST', status: 500, success: false, durationMs: duration, details: err.message });
    }
  }

  console.log('\n====================================================');
  console.log(`  SUITE RUN COMPLETE: ${passed}/${testCases.length} Passed (${failed} Failed)`);
  console.log(`  Pass Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runEndpointTestSuite().catch(err => {
  console.error('Fatal test harness execution error:', err);
  process.exit(1);
});
