export interface Department {
  code: string;
  name: string;
  category: 'ENGINEERING' | 'MANAGEMENT' | 'SCIENCES' | 'OTHER';
}

export const DEPARTMENTS: Department[] = [
  { code: 'CSE', name: 'Computer Science & Engineering', category: 'ENGINEERING' },
  { code: 'CSE-AIML', name: 'CSE - Artificial Intelligence & Machine Learning', category: 'ENGINEERING' },
  { code: 'CSE-DS', name: 'CSE - Data Science & Analytics', category: 'ENGINEERING' },
  { code: 'IT', name: 'Information Technology', category: 'ENGINEERING' },
  { code: 'ECE', name: 'Electronics & Communication Engineering', category: 'ENGINEERING' },
  { code: 'MECH', name: 'Mechanical Engineering', category: 'ENGINEERING' },
  { code: 'CIVIL', name: 'Civil Engineering', category: 'ENGINEERING' },
  { code: 'MBA', name: 'Master of Business Administration', category: 'MANAGEMENT' },
  { code: 'MCA', name: 'Master of Computer Applications', category: 'OTHER' },
  { code: 'ASH', name: 'Applied Sciences & Humanities', category: 'SCIENCES' },
];

export const departments = DEPARTMENTS;

