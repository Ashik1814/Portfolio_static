/**
 * About Detail Page — /about
 *
 * Full detailed professional profile including:
 *   - Avatar and personal info
 *   - Extended bio with philosophy and approach
 *   - Detailed statistics
 *   - Work experience timeline
 *   - Personal interests
 */

import { use } from 'react';
import Image from 'next/image';
import { Briefcase, Heart, Coffee, Lightbulb, Users, Zap, Award, ArrowRight } from 'lucide-react';
import AnimatedBorderButton from '@/components/ui/animated-border-button';

/** Stats displayed in the about page */
const stats = [
  { value: '5+', label: 'Years Experience', icon: Briefcase },
  { value: '50+', label: 'Projects Completed', icon: Zap },
  { value: '30+', label: 'Happy Clients', icon: Users },
  { value: '12', label: 'Awards & Recognitions', icon: Award },
];

/** Work experience entries */
const experience = [
  {
    role: 'Senior UI/UX Designer & Front-End Developer',
    company: 'TechVision Labs',
    period: '2022 – Present',
    description:
      'Leading design systems and front-end architecture for enterprise SaaS products. Building component libraries used by 200+ developers and designing data-intensive dashboards.',
  },
  {
    role: 'UI/UX Designer',
    company: 'CreativeFlow Studio',
    period: '2020 – 2022',
    description:
      'Designed and prototyped user interfaces for mobile and web applications. Conducted user research, created wireframes, and delivered high-fidelity designs for 15+ client projects.',
  },
  {
    role: 'Front-End Developer',
    company: 'PixelCraft Agency',
    period: '2018 – 2020',
    description:
      'Developed responsive web applications with React and TypeScript. Implemented complex animations with GSAP and Three.js for immersive marketing websites.',
  },
];

/** Personal interests */
const interests = [
  { label: 'Creative Coding', icon: Lightbulb },
  { label: 'Open Source', icon: Heart },
  { label: 'Photography', icon: Coffee },
  { label: 'Music Production', icon: Zap },
];

export default function AboutPage({ params, searchParams }: { params: Promise<Record<string, string | string[]>>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  use(params);
  use(searchParams);
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-12 text-center">
          <h1 className="text-h1 text-white">
            About Me
          </h1>
          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-cyan-400" />
          <p className="mt-6 text-body text-white/50">
            Get to know the person behind the pixels
          </p>
        </div>

        {/* ── Profile Card ────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/10 p-8 backdrop-blur-xl md:p-10">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-48 w-48 rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_30px_rgba(0,212,255,0.15)]">
                <Image
                  src="/profile.jpeg"
                  alt="Alex Chen"
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-1 flex-col gap-6 text-center md:text-left">
              <h2 className="text-h2 text-white">Alex Chen</h2>
              <p className="text-body font-medium text-cyan-400">
                Senior UI/UX Designer &amp; Front-End Developer
              </p>

              <div className="space-y-4 text-body text-white/70">
                <p>
                  I&apos;m a passionate designer and developer with over 5 years
                  of experience creating digital products that balance
                  aesthetics with functionality. I thrive at the intersection of
                  design and engineering, turning complex problems into elegant,
                  user-friendly solutions.
                </p>
                <p>
                  My expertise spans design systems, component architecture, and
                  interactive web experiences. I believe that great products are
                  built on a foundation of thoughtful design, clean code, and
                  relentless iteration — and I bring that philosophy to every
                  project I touch.
                </p>
                <p>
                  When I&apos;m not pushing pixels or writing code, you can find me
                  exploring creative coding, contributing to open-source projects,
                  or capturing the world through photography. I&apos;m always eager
                  to learn new technologies and share knowledge with the community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ──────────────────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 p-6 text-center backdrop-blur-md"
              >
                <Icon className="mx-auto mb-2 h-6 w-6 text-cyan-400" />
                <p className="text-h3 text-cyan-400">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Experience Timeline ─────────────────────────────────────── */}
        <div className="mt-16">
          <h2 className="mb-8 text-h2 text-white">Work Experience</h2>
          <div className="relative space-y-6">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />

            {experience.map((entry, index) => (
              <div key={index} className="relative flex gap-5">
                {/* Timeline dot */}
                <div className="relative z-10 flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/20">
                  <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                </div>

                {/* Card */}
                <div className="flex-1 rounded-2xl border border-white/10 border-l-2 border-l-cyan-500 p-6">
                  <h3 className="text-h3 text-white">{entry.role}</h3>
                  <p className="mt-1 text-sm text-cyan-400">{entry.company}</p>
                  <p className="mt-1 text-xs text-white/40">{entry.period}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Interests ───────────────────────────────────────────────── */}
        <div className="mt-16">
          <h2 className="mb-8 text-h2 text-white">Interests &amp; Hobbies</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {interests.map((interest) => {
              const Icon = interest.icon;
              return (
                <div
                  key={interest.label}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 p-4 backdrop-blur-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-white">{interest.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-white/50 text-body">Want to work together?</p>
          <AnimatedBorderButton href="/contact" variant="primary" size="lg">
            Get In Touch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedBorderButton>
        </div>
      </div>
    </main>
  );
}
