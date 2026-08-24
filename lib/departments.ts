export interface Department {
  code: string;
  name: string;
  category: 'ENGINEERING' | 'MANAGEMENT' | 'SCIENCES' | 'OTHER';
}

export const DEPARTMENTS: Department[] = [
  { code: 'CSE', name: 'Computer Science & Engineering', category: 'ENGINEERING' },
  { code: 'IT', name: 'Information Technology', category: 'ENGINEERING' },
  { code: 'AIML', name: 'AI & Machine Learning', category: 'ENGINEERING' },
  { code: 'DS', name: 'Data Science & Analytics', category: 'ENGINEERING' },
  { code: 'ECE', name: 'Electronics & Communication Eng.', category: 'ENGINEERING' },
  { code: 'EEE', name: 'Electrical & Electronics Eng.', category: 'ENGINEERING' },
  { code: 'MECH', name: 'Mechanical Engineering', category: 'ENGINEERING' },
  { code: 'CIVIL', name: 'Civil Engineering', category: 'ENGINEERING' },
  { code: 'CHE', name: 'Chemical Engineering', category: 'ENGINEERING' },
  { code: 'BT', name: 'Biotechnology & Bio-Engineering', category: 'ENGINEERING' },
  { code: 'MBA', name: 'Master of Business Administration', category: 'MANAGEMENT' },
  { code: 'BBA', name: 'Bachelor of Business Administration', category: 'MANAGEMENT' },
  { code: 'ASH', name: 'Applied Sciences & Humanities', category: 'SCIENCES' },
];

export const departments = DEPARTMENTS;

