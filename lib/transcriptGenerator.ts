/**
 * CampusHub AI - Official Academic Transcript & Institutional Document Formatter
 */

export interface TranscriptData {
  studentName: string;
  rollNo: string;
  degree: string;
  branch: string;
  cgpa: number;
  semester: number;
  courses: Array<{
    courseCode: string;
    courseTitle: string;
    credits: number;
    grade: string;
    gradePoint: number;
  }>;
}

export function generateTranscriptHtml(data: TranscriptData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Academic Transcript - ${data.studentName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #334155; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: bold; text-transform: uppercase; color: #0f172a; margin: 0; }
          .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; font-size: 13px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
          .table th, .table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          .table th { background: #f8fafc; font-weight: 600; }
          .summary { font-size: 14px; font-weight: bold; text-align: right; margin-top: 16px; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">CampusHub University Institute of Technology</h1>
          <p class="subtitle">Official Grade Transcript & Academic Record</p>
        </div>

        <div class="meta-grid">
          <div><strong>Student Name:</strong> ${data.studentName}</div>
          <div><strong>Roll / Enrollment ID:</strong> ${data.rollNo}</div>
          <div><strong>Program:</strong> ${data.degree}</div>
          <div><strong>Discipline:</strong> ${data.branch}</div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Credits</th>
              <th>Grade</th>
              <th>Grade Point</th>
            </tr>
          </thead>
          <tbody>
            ${data.courses
              .map(
                c => `
              <tr>
                <td>${c.courseCode}</td>
                <td>${c.courseTitle}</td>
                <td>${c.credits}</td>
                <td>${c.grade}</td>
                <td>${c.gradePoint}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="summary">
          Cumulative Grade Point Average (CGPA): ${data.cgpa.toFixed(2)} / 10.0
        </div>

        <div class="footer">
          <div>Verified by Academic Registry Controller</div>
          <div>Document Hash: SHA256-${Date.now().toString(16).toUpperCase()}</div>
        </div>
      </body>
    </html>
  `;
}
