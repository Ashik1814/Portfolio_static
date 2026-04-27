'use client';

/**
 * Education Detail Page — /education
 *
 * Design matches the provided reference with:
 *   - Gradient text header with icon
 *   - Animated timeline with water drops and rotating conic-gradient borders
 *   - Education entries with GPA badges, location, and achievement tags
 *   - Certifications grid with rotating border cards
 *   - Relevant coursework grid with colored icons
 */

import { use } from 'react';
import {
  GraduationCap,
  Calendar,
  Award,
  TrendingUp,
  MapPin,
  Shield,
  Zap,
  CodeXml,
  Palette,
  Bot,
  Cpu,
  Monitor,
  GitBranch,
  Database,
  Globe,
  Wrench,
  Wifi,
  Brain,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import AnimatedBorderButton from '@/components/ui/animated-border-button';

// ─── Type Definitions ────────────────────────────────────────────────────────

interface EducationEntry {
  title: string;
  institution: string;
  location: string;
  period: string;
  gpa: string;
  gpaColor: string;
  gpaBg: string;
  dotBorderColor: string;
  dotBg: string;
  dotShadow: string;
  iconColor: string;
  icon: React.ElementType;
  description: string;
  achievements: string[];
}

interface Certification {
  title: string;
  provider: string;
  year: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

interface CourseworkItem {
  name: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

// ─── Education Data (Actual) ─────────────────────────────────────────────────

const educationEntries: EducationEntry[] = [
  {
    title: 'Bachelor of Science in Computer Science and Engineering',
    institution: 'United International University',
    location: 'Dhaka',
    period: 'January 2021 - December 2025',
    gpa: 'GPA: 2.7/4',
    gpaColor: 'rgb(0, 229, 255)',
    gpaBg: 'rgba(0, 229, 255, 0.082)',
    dotBorderColor: 'rgba(0, 229, 255, 0.25)',
    dotBg: 'rgba(0, 229, 255, 0.082)',
    dotShadow: 'rgba(0, 229, 255, 0.145) 0px 0px 12px',
    iconColor: 'rgb(0, 229, 255)',
    icon: Shield,
    description:
      'Completed a comprehensive curriculum focused on software development lifecycles, database management, and system architecture. Developed a strong foundation in problem-solving and algorithmic thinking. Notable coursework included Web Development, Data Structures, Networking, Software Engineering and Operating Systems.',
    achievements: ['Web Development', 'UI/UX Design', 'Software Engineering', 'Data Structure'],
  },
  {
    title: 'Higher Secondary Certificate (HSC)',
    institution: 'Cantonment Public School and College',
    location: 'Rangpur',
    period: '2017 - 2019',
    gpa: 'GPA: 5.00 / 5.00',
    gpaColor: 'rgb(45, 212, 191)',
    gpaBg: 'rgba(45, 212, 191, 0.082)',
    dotBorderColor: 'rgba(45, 212, 191, 0.25)',
    dotBg: 'rgba(45, 212, 191, 0.082)',
    dotShadow: 'rgba(45, 212, 191, 0.145) 0px 0px 12px',
    iconColor: 'rgb(45, 212, 191)',
    icon: GraduationCap,
    description:
      'Developed advanced proficiency in Information & Communication Technology (ICT) and core sciences. This period built the analytical and mathematical framework necessary for pursuing an engineering degree.',
    achievements: ['Achieved a Perfect GPA (5.00/5.00) with a major in Science.'],
  },
  {
    title: 'Secondary School Certificate (SSC)',
    institution: 'Bara Baul High School',
    location: 'Dinajpur',
    period: '2015 - 2017',
    gpa: 'GPA: 5.00 / 5.00',
    gpaColor: 'rgb(167, 139, 250)',
    gpaBg: 'rgba(167, 139, 250, 0.082)',
    dotBorderColor: 'rgba(167, 139, 250, 0.25)',
    dotBg: 'rgba(167, 139, 250, 0.082)',
    dotShadow: 'rgba(167, 139, 250, 0.145) 0px 0px 12px',
    iconColor: 'rgb(167, 139, 250)',
    icon: Zap,
    description:
      'Earning A+ grades across all subjects, including Mathematics and Higher Mathematics. Demonstrated long-term academic excellence and a disciplined approach to learning, finishing among the top tier of students in the Dinajpur Board.',
    achievements: ['General scholarship.'],
  },
];

const certifications: Certification[] = [
  {
    title: 'Advanced React Development',
    provider: 'Meta',
    year: '2023',
    icon: CodeXml,
    iconColor: 'rgb(167, 139, 250)',
    iconBg: 'rgba(167, 139, 250, 0.094)',
  },
  {
    title: 'UI/UX Design Specialization',
    provider: 'Google',
    year: '2022',
    icon: Palette,
    iconColor: 'rgb(0, 229, 255)',
    iconBg: 'rgba(0, 229, 255, 0.094)',
  },
  {
    title: 'n8n Automation Expert',
    provider: 'n8n',
    year: '2024',
    icon: Bot,
    iconColor: 'rgb(45, 212, 191)',
    iconBg: 'rgba(45, 212, 191, 0.094)',
  },
  {
    title: 'TypeScript Advanced',
    provider: 'Microsoft',
    year: '2023',
    icon: Cpu,
    iconColor: 'rgb(100, 181, 246)',
    iconBg: 'rgba(100, 181, 246, 0.094)',
  },
  {
    title: 'Web Performance Optimization',
    provider: 'Google',
    year: '2023',
    icon: Zap,
    iconColor: 'rgb(251, 191, 36)',
    iconBg: 'rgba(251, 191, 36, 0.094)',
  },
  {
    title: 'Responsive Web Design',
    provider: 'freeCodeCamp',
    year: '2021',
    icon: Monitor,
    iconColor: 'rgb(249, 115, 22)',
    iconBg: 'rgba(249, 115, 22, 0.094)',
  },
];

const courseworkItems: CourseworkItem[] = [
  { name: 'Data Structures & Algorithms', icon: GitBranch, iconColor: 'rgb(0, 229, 255)', iconBg: 'rgba(0, 229, 255, 0.082)' },
  { name: 'Object-Oriented Programming', icon: CodeXml, iconColor: 'rgb(100, 181, 246)', iconBg: 'rgba(100, 181, 246, 0.082)' },
  { name: 'Database Management Systems', icon: Database, iconColor: 'rgb(45, 212, 191)', iconBg: 'rgba(45, 212, 191, 0.082)' },
  { name: 'Web Development', icon: Globe, iconColor: 'rgb(56, 189, 248)', iconBg: 'rgba(56, 189, 248, 0.082)' },
  { name: 'Software Engineering', icon: Wrench, iconColor: 'rgb(167, 139, 250)', iconBg: 'rgba(167, 139, 250, 0.082)' },
  { name: 'Operating Systems', icon: Monitor, iconColor: 'rgb(244, 114, 182)', iconBg: 'rgba(244, 114, 182, 0.082)' },
  { name: 'Computer Networks', icon: Wifi, iconColor: 'rgb(251, 146, 60)', iconBg: 'rgba(251, 146, 60, 0.082)' },
  { name: 'Machine Learning Basics', icon: Brain, iconColor: 'rgb(192, 132, 252)', iconBg: 'rgba(192, 132, 252, 0.082)' },
  { name: 'Mobile App Development', icon: BookOpen, iconColor: 'rgb(148, 163, 184)', iconBg: 'rgba(148, 163, 184, 0.082)' },
  { name: 'Cloud Computing', icon: BookOpen, iconColor: 'rgb(148, 163, 184)', iconBg: 'rgba(148, 163, 184, 0.082)' },
  { name: 'Cybersecurity Fundamentals', icon: Shield, iconColor: 'rgb(248, 113, 113)', iconBg: 'rgba(248, 113, 113, 0.082)' },
  { name: 'Human-Computer Interaction', icon: BookOpen, iconColor: 'rgb(148, 163, 184)', iconBg: 'rgba(148, 163, 184, 0.082)' },
];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function EducationPage({ params, searchParams }: { params: Promise<Record<string, string | string[]>>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  use(params);
  use(searchParams);
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ═══════════════════════════════════════════════════════════════════
            HEADER — Icon + Gradient Text Title + Subtitle
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-full bg-[#64b5f6]/15 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-7 h-7 text-[#64b5f6]" />
          </div>
          <h2 className="text-h1 mb-6">
            <span className="gradient-text-cyan">Education</span>
          </h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto text-body">
            My academic journey and continual learning path in computer science and technology
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            EDUCATION TIMELINE — Animated water drops + rotating border cards
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="relative max-w-4xl mx-auto mb-20">
          {/* Vertical gradient line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#00e5ff]/60 via-[#64b5f6]/40 to-[#a78bfa]/30" />

          {/* Water drops container */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-3 -translate-x-[5px]" style={{ overflow: 'hidden' }}>
            {/* Drop 1 — Cyan */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-2.5 h-3"
              style={{
                background: 'radial-gradient(at 40% 30%, rgb(0, 229, 255), rgb(100, 181, 246) 70%)',
                animation: 'water-drop-fall 6s linear 0s infinite, water-drop-stretch 1.5s ease-in-out 0s infinite',
                borderRadius: '50% / 60% 60% 40% 40%',
                boxShadow: 'rgba(0, 229, 255, 0.5) 0px 0px 8px, rgba(0, 229, 255, 0.2) 0px 0px 16px',
              }}
            />
            {/* Drop 2 — Blue/Purple */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2.5"
              style={{
                background: 'radial-gradient(at 40% 30%, rgb(100, 181, 246), rgb(167, 139, 250) 70%)',
                animation: 'water-drop-fall 6s linear 2s infinite, water-drop-stretch 1.5s ease-in-out 2s infinite',
                borderRadius: '50% / 60% 60% 40% 40%',
                boxShadow: 'rgba(100, 181, 246, 0.4) 0px 0px 6px, rgba(100, 181, 246, 0.15) 0px 0px 12px',
              }}
            />
            {/* Drop 3 — Purple/Teal */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-1.5 h-2"
              style={{
                background: 'radial-gradient(at 40% 30%, rgb(167, 139, 250), rgb(45, 212, 191) 70%)',
                animation: 'water-drop-fall 6s linear 4s infinite, water-drop-stretch 1.5s ease-in-out 4s infinite',
                borderRadius: '50% / 60% 60% 40% 40%',
                boxShadow: 'rgba(167, 139, 250, 0.4) 0px 0px 5px, rgba(167, 139, 250, 0.15) 0px 0px 10px',
              }}
            />
          </div>

          {/* Timeline entries */}
          <div className="space-y-8">
            {educationEntries.map((entry) => {
              const Icon = entry.icon;
              return (
                <div key={entry.title} className="relative flex gap-4 sm:gap-6">
                  {/* Timeline dot */}
                  <div className="absolute left-6 sm:left-8 -translate-x-1/2 z-10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                      style={{
                        borderColor: entry.dotBorderColor,
                        backgroundColor: entry.dotBg,
                        boxShadow: entry.dotShadow,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: entry.iconColor }} />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 ml-14 sm:ml-[4.5rem] rounded-2xl border border-white/[0.03] backdrop-blur-xl p-6"
                  >
                        {/* Title + Date + GPA */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                          <h3 className="text-base sm:text-h3 font-bold text-white flex-1">
                            {entry.title}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Date badge */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.05] text-[#94a3b8]">
                              <Calendar className="w-3 h-3" />
                              {entry.period}
                            </span>
                            {/* GPA badge */}
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold"
                              style={{ backgroundColor: entry.gpaBg, color: entry.gpaColor }}
                            >
                              <TrendingUp className="w-3 h-3" />
                              {entry.gpa}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] mb-2">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{entry.institution} • {entry.location}</span>
                        </div>

                        {/* Description */}
                        <p className="text-[#94a3b8] text-sm leading-relaxed mb-2 line-clamp-2">
                          {entry.description}
                        </p>

                        {/* Achievement tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {entry.achievements.map((achievement) => (
                            <span
                              key={achievement}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-[#94a3b8]"
                            >
                              <Award className="w-3 h-3 text-[#fbbf24] shrink-0" />
                              {achievement}
                            </span>
                          ))}
                        </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CERTIFICATIONS — Grid with rotating border cards
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="text-center mb-8">
          <h3 className="text-h3">
            <span className="gradient-text-purple-blue">Certifications</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {certifications.map((cert) => {
            const CertIcon = cert.icon;
            return (
              <div
                key={cert.title}
                className="rounded-2xl border border-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.08]"
              >
                <div className="p-6">
                  <h4 className="text-base font-bold text-white mb-0.5">{cert.title}</h4>
                  <p className="text-sm text-[#94a3b8]">{cert.provider} • {cert.year}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            RELEVANT COURSEWORK — Grid items with colored icons
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="text-center mb-8">
          <h3 className="text-h3">
            <span className="gradient-text-pink-blue">Relevant Coursework</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courseworkItems.map((course) => {
            const CourseIcon = course.icon;
            return (
              <div
                key={course.name}
                className="group flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/[0.02] hover:border-white/[0.06] transition-all duration-200 cursor-default"
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: course.iconBg }}
                >
                  <CourseIcon className="w-4 h-4" style={{ color: course.iconColor }} />
                </div>
                <span className="text-sm font-medium text-[#94a3b8] group-hover:text-white transition-colors duration-200">
                  {course.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-white/50">Want to discuss my background?</p>
          <AnimatedBorderButton href="/contact" variant="primary" size="lg">
            Get In Touch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedBorderButton>
        </div>
      </div>
    </main>
  );
}
