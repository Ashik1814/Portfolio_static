'use client';

/**
 * About Detail Page — /about
 *
 * Sections:
 *   - Profile image with animated border ring
 *   - "About Me" heading with gradient text
 *   - Bio description
 *   - Service cards (UI/UX Design, Frontend Development)
 *   - "My Approach" philosophy card
 *   - Technologies I Work With — pill badges
 *   - Core Values — 4 cards
 *   - My Journey — alternating timeline
 */


import Image from 'next/image';
import {
  Paintbrush,
  CodeXml,
  Sparkles,
  User,
  Lightbulb,
  Target,
  Handshake,
  ArrowRight,
} from 'lucide-react';
import AnimatedBorderButton from '@/components/ui/animated-border-button';

// ─── Data ──────────────────────────────────────────────────────────────────

const services = [
  {
    icon: Paintbrush,
    title: 'UI/UX Design',
    description:
      'Crafting intuitive and visually stunning user interfaces with a focus on user experience and accessibility. I believe great design is both functional and beautiful.',
    stat: '30+',
    statLabel: 'Design Projects',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    statColor: 'text-purple-400',
  },
  {
    icon: CodeXml,
    title: 'Frontend Development',
    description:
      'Building responsive, performant web applications using modern technologies like React, TypeScript, and Tailwind CSS. Clean code is my priority.',
    stat: '15+',
    statLabel: 'Projects Built',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    statColor: 'text-cyan-400',
  },
];

const technologies = [
  'React',
  'TypeScript',
  'Figma',
  'Tailwind CSS',
  'Next.js',
  'Node.js',
];

const currentlyLearning = [];

const coreValues = [
  {
    icon: User,
    title: 'User-Centered',
    description: 'Every decision starts with the user in mind.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Always exploring new technologies and approaches.',
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'Focused on achieving measurable results.',
  },
  {
    icon: Handshake,
    title: 'Collaboration',
    description: 'Working closely with teams and stakeholders.',
  },
];

const journeyEntries = [
  {
    year: '2021',
    title: 'Started CSE Journey',
    description:
      "Began my bachelor's in Computer Science Engineering, discovering my passion for web development and design.",
    side: 'left' as const,
  },
  {
    year: '2023',
    title: 'First Freelance Project',
    description:
      'Completed my first freelance project: a responsive website for a local business, sparking my entrepreneurial spirit.',
    side: 'right' as const,
  },
  {
    year: '2024',
    title: 'Deep Dive into UI/UX',
    description:
      'Pursued advanced training in design principles, Figma, and user research methodologies. Won college hackathon with innovative design.',
    side: 'left' as const,
  },
  {
    year: '2025',
    title: 'Graduated & Specialized',
    description:
      'Completed Bachelor in Computer Science & Engineering and began specializing in frontend development and automation workflows.',
    side: 'right' as const,
  },
  {
    year: '2026',
    title: 'Full-Stack Growth',
    description:
      'Expanded into backend integration, API development, and building end-to-end solutions for clients worldwide.',
    side: 'left' as const,
  },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function AboutPage() {

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Profile Image + Heading ──────────────────────────────────── */}
        <div className="text-center mb-16">
          {/* Profile Image with animated border ring */}
          <div className="relative inline-block mx-auto mb-10">
            {/* Glow backdrop */}
            <div className="absolute -inset-8 bg-gradient-to-r from-[#00e5ff]/15 via-[#64b5f6]/15 to-[#a78bfa]/15 rounded-full blur-2xl" />

            {/* Spinning conic-gradient border */}
            <div
              className="relative overflow-hidden p-[2px] rounded-full"
            >
              <div
                className="absolute inset-[-200%] animate-[spin_6s_linear_infinite]"
                style={{
                  background:
                    'conic-gradient(transparent 0%, #00e5ff 5%, #a78bfa 10%, #2dd4bf 14%, transparent 18%)',
                  willChange: 'transform',
                }}
              />
              <div
                className="absolute inset-[-200%] animate-[spin_9s_linear_infinite_reverse]"
                style={{
                  background:
                    'conic-gradient(from 180deg, transparent 0%, #64b5f6 3%, #2dd4bf 6%, transparent 9%)',
                  willChange: 'transform',
                }}
              />
              <div className="relative z-[1] flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full bg-[#08050f]">
                 <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0a0f1e] to-[#0d1525] flex items-center justify-center overflow-hidden p-1">
                   <img
                     src="/profile.jpeg"
                     alt="Ashikur Rahman Ashik"
                     width={320}
                     height={320}
                     className="w-full h-full rounded-full object-cover"
                     loading="lazy"
                   />
                 </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text-cyan">About Me</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base leading-relaxed">
            I&apos;m a passionate CSE graduate who loves turning ideas into
            reality through design and code. With a unique blend of creative
            design thinking and technical expertise, I create digital
            experiences that users love and businesses value.
          </p>
        </div>

        {/* ── Service Cards ────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="rounded-2xl border border-white/[0.03] backdrop-blur-xl p-6 space-y-4 hover:border-cyan-400/10 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.iconBg}`}
                >
                  <Icon className={`w-6 h-6 ${service.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {service.description}
                </p>
                <div className="pt-2">
                  <span className={`text-2xl font-bold ${service.statColor}`}>
                    {service.stat}
                  </span>
                  <span className="text-sm text-white/40 ml-2">
                    {service.statLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── My Approach ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.03] backdrop-blur-xl mb-16">
          <div className="p-8 sm:p-10 text-center max-w-3xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#00e5ff]/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-[#00e5ff]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">My Approach</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              I believe that great digital products are born at the intersection
              of beautiful design, clean code, and smart automation. My approach
              is user-centered, data-driven, and driven by a passion for
              continuous learning and improvement.
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              Whether I&apos;m designing an interface or writing code, I always
              ask: &apos;How can this create the most value for users while
              maintaining technical excellence?&apos; This philosophy guides
              every project I take on.
            </p>
          </div>
        </div>

        {/* ── Technologies I Work With ─────────────────────────────────── */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white/60">
            Technologies I Work With
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-full text-sm font-medium border border-white/[0.03] bg-white/[0.02] backdrop-blur-xl text-white/50 hover:text-[#00e5ff] hover:border-[#00e5ff]/20 transition-all duration-200"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* ── Core Values ──────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white">Core Values</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {coreValues.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="rounded-2xl border border-white/[0.03] backdrop-blur-xl text-center hover:border-cyan-400/10 transition-all duration-300"
              >
                <div className="p-5 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#64b5f6]/15 flex items-center justify-center mx-auto">
                    <Icon className="w-5 h-5 text-[#64b5f6]" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {value.title}
                  </h4>
                  <p className="text-xs text-white/50">{value.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── My Journey Timeline ──────────────────────────────────────── */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-white">My Journey</h3>
        </div>
        <div className="max-w-2xl mx-auto relative">
          {/* Vertical gradient line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00e5ff] via-[#64b5f6] to-[#a78bfa]" />

          {journeyEntries.map((entry) => (
            <div
              key={entry.year}
              className={`relative flex items-start mb-8 last:mb-0 ${
                entry.side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              {/* Timeline dot with spinning border */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 z-10 flex items-center justify-center rounded-full bg-[#08050f] border border-[#00e5ff]/30">
                <span className="text-xs font-bold text-[#00e5ff]">
                  {entry.year}
                </span>
              </div>

              {/* Card */}
              <div
                className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${
                  entry.side === 'left'
                    ? 'md:pr-8 md:text-right'
                    : 'md:pl-8 md:ml-auto'
                }`}
              >
                <div className="rounded-2xl border border-white/[0.03] backdrop-blur-xl">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="md:hidden text-xs font-bold text-[#00e5ff]">
                        {entry.year}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      {entry.title}
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-white/50 text-body">
            Want to work together?
          </p>
          <AnimatedBorderButton href="/contact" variant="primary" size="lg">
            Get In Touch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedBorderButton>
        </div>
      </div>
    </main>
  );
}
