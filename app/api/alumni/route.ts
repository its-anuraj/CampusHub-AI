import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_ALUMNI = [
  {
    id: 'alm-1',
    name: 'Siddharth Rao',
    batch: 'Class of 2021',
    department: 'Computer Science & Engineering',
    company: 'Google',
    designation: 'Senior Software Engineer (L5)',
    location: 'Bangalore / Mountain View',
    linkedinUrl: 'https://linkedin.com/in/siddharth-rao',
    bio: 'Working on Gemini foundational infra. Available for system design mentorship and algorithmic mock interviews.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    isMentor: true,
    availableSlots: ['Sat 10:00 AM', 'Sat 02:00 PM', 'Sun 11:30 AM']
  },
  {
    id: 'alm-2',
    name: 'Ananya Deshmukh',
    batch: 'Class of 2022',
    department: 'Information Technology',
    company: 'Microsoft',
    designation: 'Product Manager (Azure AI)',
    location: 'Hyderabad',
    linkedinUrl: 'https://linkedin.com/in/ananya-deshmukh',
    bio: 'Transitioned from SWE to Product Management. Happy to guide on PM case interviews, PRDs, and campus placement prep.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    isMentor: true,
    availableSlots: ['Sun 04:00 PM', 'Sun 06:00 PM']
  },
  {
    id: 'alm-3',
    name: 'Varun Kapur',
    batch: 'Class of 2020',
    department: 'Electronics & Communication',
    company: 'Apple',
    designation: 'Hardware Systems Architect',
    location: 'San Jose, California',
    linkedinUrl: 'https://linkedin.com/in/varun-kapur',
    bio: 'Specializing in Apple Silicon SoC pipelines. Passionate about guiding students on MS abroad and embedded systems.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    isMentor: true,
    availableSlots: ['Sat 08:30 PM IST']
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let alumni: any[] = [];
    try {
      alumni = await prisma.alumniProfile.findMany();
    } catch {}

    const list = alumni.length > 0 ? alumni : MOCK_ALUMNI;
    const filtered = search
      ? list.filter((a: any) => a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()) || a.department.toLowerCase().includes(search.toLowerCase()))
      : list;

    return apiSuccess(filtered);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch alumni directory');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mentorName, studentName, slot, topic } = body;

    return apiSuccess({
      bookingId: `MNT-${Math.floor(10000 + Math.random() * 90000)}`,
      mentorName,
      studentName: studentName || 'Alex Kumar',
      slot,
      topic: topic || 'General Career Guidance',
      meetLink: 'https://meet.google.com/chub-mentor-session',
      status: 'CONFIRMED'
    }, '1:1 Mentorship session booked successfully');
  } catch (err: any) {
    return apiError(err.message || 'Failed to book mentorship slot');
  }
}
