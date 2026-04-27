'use client';

/**
 * Education Detail Page — /education
 *
 * Full education timeline with detailed entries including:
 *   - Degrees, certifications, and online courses
 *   - Visual timeline with icons and glassmorphism cards
 *   - Academic achievements and highlights
 *   - Profile image header
 */

import Image from 'next/image';
import {
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  Trophy,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// ─── Type Definitions ────────────────────────────────────────────────────────

interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  description: string;
  longDescription: string;
  highlights: string[];
  icon: React.ElementType;
  type: 'degree' | 'certification' | 'course';
}

// ─── Education Data ──────────────────────────────────────────────────────────

const educationEntries: EducationEntry[] = [
  {
    degree: 'M.Sc. Human-Computer Interaction',
    institution: 'Stanford University',
    year: '2020 – 2022',
    description: 'Focused on interaction design, usability research, and human-centered AI.',
    longDescription:
      'Pursued advanced studies in Human-Computer Interaction, specializing in interaction design patterns, usability research methodologies, and human-centered AI systems. Conducted groundbreaking thesis research on adaptive UI patterns for accessibility, earning distinction from the faculty review board.',
    highlights: [
      'Thesis on Adaptive UI Patterns for Accessibility',
      'Research Assistant — HCI Lab',
      'GPA: 3.9 / 4.0',
      'Published 2 papers in ACM CHI',
    ],
    icon: GraduationCap,
    type: 'degree',
  },
  {
    degree: 'B.Sc. Computer Science',
    institution: 'MIT',
    year: '2016 – 2020',
    description: 'Core coursework in algorithms, systems design, and software engineering.',
    longDescription:
      'Completed a rigorous Computer Science curriculum with a strong foundation in algorithms, data structures, systems design, and software engineering. Elected a Minor in Visual Arts, blending technical expertise with creative design thinking that shapes my approach to UI/UX today.',
    highlights: [
      'Minor in Visual Arts',
      'Dean\'s List — All semesters',
      'Capstone: Real-time collaborative design tool',
      'Teaching Assistant — Intro to CS',
    ],
    icon: GraduationCap,
    type: 'degree',
  },
  {
    degree: 'UX Design Professional Certificate',
    institution: 'Google',
    year: '2021',
    description: 'Comprehensive program covering UX research, wireframing, prototyping, and usability testing.',
    longDescription:
      'Completed Google\'s industry-recognized UX Design Professional Certificate program, gaining hands-on experience in UX research methodologies, wireframing, high-fidelity prototyping in Figma, and usability testing. Developed 3 case-study projects from research through final prototype.',
    highlights: [
      '3 end-to-end UX case studies',
      'Cross-platform responsive design',
      'User research & usability testing',
      'Figma prototyping mastery',
    ],
    icon: Award,
    type: 'certification',
  },
  {
    degree: 'Advanced React & Next.js Patterns',
    institution: 'Frontend Masters',
    year: '2023',
    description: 'Deep dive into advanced React patterns, server components, and Next.js architecture.',
    longDescription:
      'An intensive advanced course covering React Server Components, streaming SSR, advanced hooks patterns, compound components, render props, and Next.js App Router architecture. Applied these patterns in production-grade projects with a focus on performance optimization.',
    highlights: [
      'React Server Components',
      'Next.js App Router patterns',
      'Performance optimization',
      'Advanced hooks & compound components',
    ],
    icon: BookOpen,
    type: 'course',
  },
  {
    degree: 'Three.js & WebGL Masterclass',
    institution: 'Bruno Simon — Three.js Journey',
    year: '2023',
    description: 'Comprehensive 3D web development course covering shaders, physics, and creative coding.',
    longDescription:
      'Completed the renowned Three.js Journey course, mastering WebGL fundamentals, custom GLSL shaders, post-processing effects, physics engines, and creative coding techniques. Built multiple interactive 3D web experiences including a portfolio with particle systems and shader-based effects.',
    highlights: [
      'Custom GLSL shaders',
      'Post-processing & bloom effects',
      'Physics-based interactions',
      'Creative coding & generative art',
    ],
    icon: BookOpen,
    type: 'course',
  },
];

/** Stats displayed in the education page */
const academicStats = [
  { value: '2', label: 'Degrees', icon: GraduationCap },
  { value: '3', label: 'Certifications', icon: Award },
  { value: '5+', label: 'Online Courses', icon: BookOpen },
  { value: '2', label: 'Publications', icon: Trophy },
];

// ─── Type badge color map ────────────────────────────────────────────────────

const typeBadge: Record<EducationEntry['type'], { label: string; className: string }> = {
  degree: {
    label: 'Degree',
    className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  certification: {
    label: 'Certification',
    className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  course: {
    label: 'Course',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
};

// ─── Page Component ──────────────────────────────────────────────────────────

export default function EducationPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          {/* Profile Image */}
          <div className="mb-6 inline-block relative">
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_30px_rgba(0,212,255,0.15)] mx-auto">
              <Image
                src="/profile.jpeg"
                alt="Alex Chen"
                width={128}
                height={128}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 rounded-full border border-cyan-400/10 scale-110" />
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Education &amp; Certifications
          </h1>
          <div className="mt-3 mx-auto h-1 w-24 rounded-full bg-cyan-500" />
          <p className="mt-6 text-lg text-white/50">
            My academic journey and continuous learning path
          </p>
        </div>

        {/* ── Academic Stats ──────────────────────────────────────────── */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {academicStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md"
              >
                <Icon className="mx-auto mb-2 h-6 w-6 text-cyan-400" />
                <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Education Timeline ──────────────────────────────────────── */}
        <div className="relative space-y-6">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />

          {educationEntries.map((entry, index) => {
            const Icon = entry.icon;
            const badge = typeBadge[entry.type];
            return (
              <div key={index} className="relative flex gap-5">
                {/* Timeline dot */}
                <div className="relative z-10 flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/20">
                  <Icon className="h-3.5 w-3.5 text-cyan-400" />
                </div>

                {/* Card */}
                <div className="flex-1 rounded-2xl border border-white/10 border-l-2 border-l-cyan-500 bg-white/5 p-5 backdrop-blur-md sm:p-6">
                  {/* Top row: type badge + year */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-cyan-400 font-medium">{entry.year}</span>
                  </div>

                  {/* Degree & institution */}
                  <h3 className="text-lg font-semibold text-white leading-snug">
                    {entry.degree}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">{entry.institution}</p>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-white/40">
                    {entry.longDescription}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {entry.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-2">
                        <Lightbulb className="h-3 w-3 flex-shrink-0 text-cyan-400" />
                        <span className="text-xs text-white/50">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="mt-14 text-center">
          <p className="mb-4 text-white/50">Want to discuss my background?</p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-cyan-400"
          >
            Get In Touch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
