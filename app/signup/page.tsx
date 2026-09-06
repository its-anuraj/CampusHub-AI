'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  Loader2,
  ArrowRight,
  Check,
  Sparkles,
  Clock,
  CheckCircle2,
  Mail,
  Building2,
  BadgeCheck,
  UserCheck,
  Phone,
  Camera,
  UploadCloud,
  X
} from 'lucide-react';
import { DEPARTMENTS } from '@/lib/departments';

const ROLES = [
  { role: 'STUDENT', label: 'Student', icon: GraduationCap, desc: 'Academics, attendance, courses & AI assistant' },
  { role: 'FACULTY', label: 'Faculty', icon: BookOpen, desc: 'Section coordinator desk, grading & attendance' },
  { role: 'PARENT', label: 'Parent', icon: Users, desc: 'Ward progress monitoring & fee tracking' },
  { role: 'ADMIN', label: 'Staff Admin', icon: Shield, desc: 'Placement, library, fees, events & clubs' },
];

export default function SignupPage() {
  const router = useRouter();
  
  // Form State
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'PARENT' | 'ADMIN'>('STUDENT');
  const [adminDepartmentRole, setAdminDepartmentRole] = useState('PLACEMENT_CELL');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState('CSE');
  const [rollNumber, setRollNumber] = useState('');
  const [year, setYear] = useState('1');
  const [semester, setSemester] = useState('1');
  const [section, setSection] = useState('A');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('Father');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentRollNumber, setStudentRollNumber] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedUser, setSubmittedUser] = useState<any | null>(null);

  // Helper to handle Indian 10-digit phone input
  const handlePhoneInput = (val: string, setter: (v: string) => void) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setter(digitsOnly);
  };

  // Handle Image File Upload (Max 2MB, JPEG/PNG/WebP)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Profile photo size must be less than 2MB.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatar(result);
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Email Sign-Up
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mandatory Profile Photo check
    if (!avatar) {
      setError('Profile photo is mandatory for all roles. Please upload a clear passport-size photo.');
      return;
    }

    // Indian 10-digit mobile number validation
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number (must be 10 digits starting with 6, 7, 8, or 9).');
      return;
    }

    if (role === 'STUDENT' && !indianPhoneRegex.test(guardianPhone)) {
      setError('Please enter a valid 10-digit Indian Guardian mobile phone number (starting with 6, 7, 8, or 9).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          avatar,
          phone,
          department,
          departmentRole: adminDepartmentRole,
          adminDepartmentRole,
          rollNumber: role === 'PARENT' ? studentRollNumber : rollNumber,
          studentName: role === 'PARENT' ? studentName : undefined,
          studentRollNumber: role === 'PARENT' ? studentRollNumber : undefined,
          relation: guardianRelation,
          year,
          semester,
          section,
          guardianName,
          guardianRelation,
          guardianPhone,
          address,
          city,
          state,
          pincode,
          employeeId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setSubmittedUser(data.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            C
          </div>
          <span className="font-semibold text-slate-900 text-sm tracking-tight">CampusHub OS</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">Create Account</span>
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">
          Already registered? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign In here</Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-blue-600" /> Official Institution Portal
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Register your official profile.
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Secure campus identity management for students, faculty, administrators, and parents.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">One-Time Verification</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Profiles are reviewed once by assigned coordinators before dashboard activation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Role-Isolated Workspace</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Tailored dashboards dedicated to your department, academic courses, and services.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Email Confirmation</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Instant status notification dispatched to your registered email upon approval.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Encrypted & Verified Institutional Network</span>
          </div>
        </div>

        {/* Right Column - Sign Up Form or Submitted Confirmation */}
        <div className="md:col-span-7">
          {submittedUser ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Registration Submitted Successfully!</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your registration request has been created and is currently awaiting one-time verification.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Applicant Name</span>
                  <span className="font-semibold text-slate-900">{submittedUser.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Registered Email</span>
                  <span className="font-mono font-semibold text-blue-600">{submittedUser.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Mobile Phone</span>
                  <span className="font-mono font-semibold text-slate-800">+91 {submittedUser.phone}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Role</span>
                  <span className="font-semibold text-slate-900">{submittedUser.role}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Approval Desk</span>
                  <span className="font-semibold text-amber-700">
                    {submittedUser.role === 'ADMIN'
                      ? 'College Director (Super Admin Desk)'
                      : submittedUser.role === 'FACULTY'
                      ? 'System Administrator'
                      : 'Class/Section Coordinator'}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-800">
                  <Mail className="w-4 h-4 text-blue-600" /> Email Notification on Approval
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  When your request is approved, you will receive an update at <strong>{submittedUser.email}</strong> stating:
                </p>
                <div className="p-2.5 bg-white/80 rounded-lg border border-blue-200/60 font-mono text-[11px] text-blue-950 font-medium">
                  &ldquo;Account creation request approved! You can now log in easily using your registered email and password.&rdquo;
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer text-center"
                >
                  <span>Go to Login Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Create your CampusHub Account</h2>
                <p className="text-xs text-slate-500 mt-1">Select your role and enter all mandatory registration details</p>
              </div>

              {/* Role Selection Cards */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Your Institution Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.role;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => setRole(r.role as any)}
                        className={`py-2.5 px-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 shadow-xs'
                            : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/60 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleEmailSignup} className="space-y-3.5 pt-1">
                {/* Mandatory Profile Photo Upload */}
                <div className="p-3.5 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-50 transition-all">
                  <div className="flex flex-col sm:flex-row items-center gap-3.5">
                    <div className="relative">
                      {avatarPreview ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-sky-500 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={avatarPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setAvatar('');
                              setAvatarPreview('');
                            }}
                            className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs cursor-pointer"
                            title="Remove Photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-sky-100 border-2 border-dashed border-sky-400 flex items-center justify-center text-sky-600 shadow-xs">
                          <Camera className="w-7 h-7" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <label className="block text-xs font-bold text-slate-900">
                          Upload Official Profile Photo <span className="text-red-500">* (Mandatory)</span>
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Clear passport-size photograph (JPEG, PNG, WebP up to 2MB). Required for Digital ID Card & Verification.
                      </p>
                      <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold cursor-pointer shadow-xs transition-all">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{avatarPreview ? 'Change Photo' : 'Select Photo File'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={handleImageChange}
                          className="hidden"
                          required={!avatar}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {role === 'PARENT' ? 'Parent Full Name' : 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mobile Number (10 Digits) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-semibold text-slate-400 select-none">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        value={phone}
                        onChange={e => handlePhoneInput(e.target.value, setPhone)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      minLength={6}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* PARENT SPECIFIC FIELDS */}
                {role === 'PARENT' && (
                  <div className="space-y-3.5 pt-2 border-t border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" /> Child / Student Link Details (Mandatory)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Student Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={e => setStudentName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Student Roll / Admission Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={studentRollNumber}
                            onChange={e => setStudentRollNumber(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Student Department <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            required
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                          >
                            {DEPARTMENTS.map(d => (
                              <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Relationship to Student <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={guardianRelation}
                            onChange={e => setGuardianRelation(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                          >
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Legal Guardian">Legal Guardian</option>
                            <option value="Sibling">Sibling</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Student Year <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                          >
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Student Semester <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={semester}
                            onChange={e => setSemester(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                              <option key={s} value={s}>Sem {s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Student Section <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={section}
                            onChange={e => setSection(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                          >
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
                            <option value="D">Section D</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Parent Residential Address & Location */}
                    <div className="pt-2 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" /> Parent Location & Address Details
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Residential Address / Street <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              City <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={city}
                              onChange={e => setCity(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              State <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={state}
                              onChange={e => setState(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={pincode}
                              onChange={e => setPincode(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STUDENT SPECIFIC FIELDS */}
                {role === 'STUDENT' && (
                  <div className="space-y-3.5 pt-2 border-t border-slate-100">
                    {/* Academic Information */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Academic Credentials
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Department <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            required
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                          >
                            {DEPARTMENTS.map(d => (
                              <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Roll / Admission Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={rollNumber}
                            onChange={e => setRollNumber(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Year <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                          >
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Semester <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={semester}
                            onChange={e => setSemester(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                              <option key={s} value={s}>Sem {s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Section <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={section}
                            onChange={e => setSection(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                          >
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
                            <option value="D">Section D</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Guardian / Parent Information */}
                    <div className="pt-2 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" /> Guardian / Parent Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Guardian Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={guardianName}
                            onChange={e => setGuardianName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Relationship <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={guardianRelation}
                            onChange={e => setGuardianRelation(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                          >
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Legal Guardian">Legal Guardian</option>
                            <option value="Sibling">Sibling</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Guardian Phone (10 Digits) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-2.5 text-[11px] font-semibold text-slate-400 select-none">+91</span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              pattern="[6-9][0-9]{9}"
                              value={guardianPhone}
                              onChange={e => handlePhoneInput(e.target.value, setGuardianPhone)}
                              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-2.5 py-1.5 text-xs text-slate-900 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Permanent Residential Address & Location */}
                    <div className="pt-2 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" /> Location & Address Details
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Residential Address / Street <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              City <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={city}
                              onChange={e => setCity(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              State <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={state}
                              onChange={e => setState(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={pincode}
                              onChange={e => setPincode(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* FACULTY SPECIFIC FIELDS */}
                {role === 'FACULTY' && (
                  <div className="space-y-3.5 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" /> Faculty Credentials (Mandatory)
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={department}
                          onChange={e => setDepartment(e.target.value)}
                          required
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                        >
                          {DEPARTMENTS.map(d => (
                            <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Employee ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={employeeId}
                          onChange={e => setEmployeeId(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono uppercase"
                        />
                      </div>
                    </div>

                    {/* Permanent Residential Address & Location */}
                    <div className="pt-2 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" /> Permanent Residential Address (Mandatory)
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Residential Address / Street <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              City <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={city}
                              onChange={e => setCity(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              State <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={state}
                              onChange={e => setState(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={pincode}
                              onChange={e => setPincode(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ADMIN / STAFF SPECIFIC FIELDS */}
                {role === 'ADMIN' && (
                  <div className="space-y-3.5 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-600" /> Department Administrator Credentials
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Department Role / Desk <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={adminDepartmentRole}
                          onChange={e => setAdminDepartmentRole(e.target.value)}
                          required
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium"
                        >
                          <option value="PLACEMENT_CELL">Training & Placement Cell (TPO)</option>
                          <option value="FEES_ACCOUNTS">Finance & Fees Department</option>
                          <option value="LIBRARY">Library & Digital Resources</option>
                          <option value="EVENT_MANAGER">Campus Events & Cultural Affairs</option>
                          <option value="CLUB_MANAGER">Student Clubs & Societies Manager</option>
                          <option value="ACADEMIC_ADMIN">Academic Affairs & Examinations</option>
                          <option value="HOSTEL_ADMIN">Hostel & Housing Warden</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Employee ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={employeeId}
                          onChange={e => setEmployeeId(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono uppercase"
                        />
                      </div>
                    </div>

                    {/* Location & Address */}
                    <div className="pt-2 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-600" /> Official Residential Address (Mandatory)
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Residential Address / Street <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              City <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={city}
                              onChange={e => setCity(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              State <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={state}
                              onChange={e => setState(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-1">
                              Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={pincode}
                              onChange={e => setPincode(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...</> : <><span>Submit Account Registration</span> <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 pt-4">
        <span>© 2026 CampusHub AI Technologies Inc.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
