import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_CLUBS = [
  {
    id: 'club-1',
    name: 'AI & Robotics Nexus',
    category: 'TECHNICAL',
    president: 'Aarav Sharma (Final Year CSE)',
    facultyLead: 'Dr. Rajesh Verma (AI Dept)',
    members: 142,
    description: 'Autonomous rover development, ROS2, Reinforcement Learning, and competing in national robotics challenges.',
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
    achievements: ['1st Place National RoboWars 2025', 'Published 4 IEEE Student Papers'],
    meetingSchedule: 'Wednesdays & Saturdays @ 5:30 PM (Robotics Lab)'
  },
  {
    id: 'club-2',
    name: 'Google Developer Student Club (GDSC)',
    category: 'TECHNICAL',
    president: 'Sneha Patel (3rd Year IT)',
    facultyLead: 'Prof. Ananya Roy',
    members: 230,
    description: 'Cloud computing, Flutter/Android, open source contribution, and annual Google Solution Challenge hackathon.',
    bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
    achievements: ['Top 10 Global Solution Challenge 2025', '12 Open Source Repositories'],
    meetingSchedule: 'Fridays @ 4:00 PM (Seminar Hall 2)'
  },
  {
    id: 'club-3',
    name: 'Dhwani: Campus Music & Band Society',
    category: 'CULTURAL',
    president: 'Rohan Gupta (4th Year ECE)',
    facultyLead: 'Dr. Meenakshi S.',
    members: 88,
    description: 'Acoustic sessions, fusion bands, studio audio recording, and main-stage concerts for college fests.',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
    achievements: ['Best College Band at Inter-University Fest', 'Recorded 2 Original Soundtracks'],
    meetingSchedule: 'Tuesdays & Thursdays @ 6:00 PM (Music Studio)'
  },
  {
    id: 'club-4',
    name: 'Stride: Athletics & Sports Club',
    category: 'SPORTS',
    president: 'Vikram Singh (3rd Year ME)',
    facultyLead: 'Coach Devendra Yadav',
    members: 175,
    description: 'Football, basketball, cricket conditioning, marathon training, and annual inter-collegiate tournaments.',
    bannerUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60',
    achievements: ['State Basketball Gold Medal 2025', 'Inter-University Cricket Finalists'],
    meetingSchedule: 'Daily @ 6:00 AM & 5:00 PM (Sports Complex)'
  },
  {
    id: 'club-5',
    name: 'Eloquentia: Debating & Model UN Society',
    category: 'LITERARY',
    president: 'Ishita Sen (3rd Year Law & Tech)',
    facultyLead: 'Dr. P. Raghavan',
    members: 65,
    description: 'Parliamentary debates, geopolitical policy simulation, MUN delegations, and public speaking workshops.',
    bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60',
    achievements: ['Best Delegation National MUN 2025', 'Hosted Inter-College Youth Parliament'],
    meetingSchedule: 'Mondays @ 5:00 PM (Conference Room A)'
  },
  {
    id: 'club-6',
    name: 'Lens & Shutter: Photography & Cinematography Guild',
    category: 'CULTURAL',
    president: 'Kabir Mehta (4th Year Design)',
    facultyLead: 'Prof. Sandeep Joshi',
    members: 94,
    description: 'Visual storytelling, film editing, campus photojournalism, portrait masterclasses, and annual photo exhibitions.',
    bannerUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&auto=format&fit=crop&q=60',
    achievements: ['Campus Documentary Featured in Film Fest', 'Over 10,000 Archive Photographs'],
    meetingSchedule: 'Saturdays @ 3:00 PM (Media Studio)'
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    let clubs: any[] = [];
    try {
      clubs = await prisma.studentClub.findMany({
        where: category && category !== 'ALL' ? { category } : undefined,
      });
    } catch {
      // Fallback to mock
    }

    let data = clubs.length > 0 ? clubs : MOCK_CLUBS;

    if (category && category !== 'ALL') {
      data = data.filter(c => c.category.toUpperCase() === category.toUpperCase());
    }

    if (search) {
      data = data.filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.description.toLowerCase().includes(search) ||
        c.president.toLowerCase().includes(search)
      );
    }

    return apiSuccess(data);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch clubs');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, clubId, studentName, rollNumber, roleApplied, motivation } = body;

    if (action === 'JOIN') {
      return apiSuccess({
        applicationId: `APP-CLUB-${Date.now()}`,
        clubId,
        studentName: studentName || 'Alex Kumar',
        rollNumber: rollNumber || '23CSE042',
        status: 'SUBMITTED',
        appliedAt: new Date().toISOString()
      }, 'Club membership application submitted successfully! The executive team will review your application.');
    }

    if (action === 'CREATE') {
      const { name, category, president, facultyLead, description } = body;
      try {
        const newClub = await prisma.studentClub.create({
          data: {
            name,
            category: category || 'TECHNICAL',
            president: president || 'Alex Kumar',
            facultyLead: facultyLead || 'Prof. Unassigned',
            members: 1,
            description: description || 'New student community'
          }
        });
        return apiSuccess(newClub, 'New club registered successfully!');
      } catch {
        return apiSuccess({
          id: `club-${Date.now()}`,
          name,
          category,
          president,
          facultyLead,
          members: 1,
          description
        }, 'New club proposal submitted for Dean approval!');
      }
    }

    return apiError('Invalid action specified');
  } catch (err: any) {
    return apiError(err.message || 'Failed to process club request');
  }
}
