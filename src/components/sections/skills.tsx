'use client';

import { useState } from 'react';
import { Palette, Code2, Server, Box, Github, Terminal, Layers } from 'lucide-react';

// ─── Type Definitions ───────────────────────────────────────────────────────

/** Represents a single skill entry displayed as a card */
interface Skill {
  /** Display name of the skill */
  name: string;
  /** Lucide icon component to render */
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Short description shown below the skill name */
  description: string;
  /** Extended description revealed on hover */
  extendedDescription: string;
  /** Proficiency percentage (0–100) driving the progress bar */
  proficiency: number;
}

// ─── Skills Data ─────────────────────────────────────────────────────────────

const skills: Skill[] = [
  {
    name: 'Figma',
    icon: Palette,
    description: 'Design systems, prototyping, and user research',
    extendedDescription:
      'Expert in building scalable design systems, high-fidelity prototyping, component libraries, and conducting user research to validate design decisions.',
    proficiency: 95,
  },
  {
    name: 'TypeScript',
    icon: Code2,
    description: 'Type-safe applications with modern TypeScript patterns',
    extendedDescription:
      'Proficient in advanced TypeScript patterns including generics, discriminated unions, conditional types, and strict type-safe architectures for large codebases.',
    proficiency: 90,
  },
  {
    name: 'React/Next.js',
    icon: Layers,
    description: 'Full-stack React applications with Next.js',
    extendedDescription:
      'Deep experience with Next.js App Router, SSR/SSG, API routes, middleware, and building performant full-stack React applications at scale.',
    proficiency: 92,
  },
  {
    name: 'Node.js',
    icon: Server,
    description: 'Backend APIs, real-time services, and serverless functions',
    extendedDescription:
      'Skilled in building RESTful & GraphQL APIs, WebSocket real-time services, microservices architecture, and deploying serverless functions on edge runtimes.',
    proficiency: 85,
  },
  {
    name: 'Three.js',
    icon: Box,
    description: 'Interactive 3D web experiences and WebGL',
    extendedDescription:
      'Capable of creating immersive 3D web experiences using Three.js, custom shaders, post-processing effects, and performance-optimized WebGL scenes.',
    proficiency: 80,
  },
  {
    name: 'Tailwind CSS',
    icon: Terminal,
    description: 'Utility-first CSS with custom design systems',
    extendedDescription:
      'Expert in utility-first CSS methodology, building custom Tailwind plugins, design tokens, responsive layouts, and maintaining consistent design systems at scale.',
    proficiency: 95,
  },
  {
    name: 'Git & CI/CD',
    icon: Github,
    description: 'Version control and automated deployment pipelines',
    extendedDescription:
      'Experienced with Git workflows, branching strategies, code review processes, and setting up CI/CD pipelines with GitHub Actions, GitLab CI, and automated testing.',
    proficiency: 88,
  },
  {
    name: 'UI/UX Design',
    icon: Layers,
    description: 'User-centered design thinking and accessibility',
    extendedDescription:
      'Passionate about user-centered design, accessibility standards (WCAG), interaction design, information architecture, and creating inclusive digital experiences.',
    proficiency: 93,
  },
];

// ─── SkillCard Component ────────────────────────────────────────────────────

/** Props for an individual skill card */
interface SkillCardProps {
  /** The skill data to display */
  skill: Skill;
  /** Index used for staggered animation delay */
  index: number;
}

/**
 * SkillCard renders a single skill entry with glassmorphism styling,
 * a progress bar, and a hover-revealed extended description tooltip.
 */
function SkillCard({ skill, index }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = skill.icon;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Main Card ── */}
      <div
        className={`
          relative overflow-hidden rounded-xl border p-6
          transition-all duration-300 ease-out
          bg-white/5 backdrop-blur-lg
          border-white/10
          hover:scale-105 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10
        `}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Icon circle */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
          <Icon className="h-6 w-6" />
        </div>

        {/* Skill name */}
        <h3 className="mb-2 text-lg font-semibold text-white">{skill.name}</h3>

        {/* Short description */}
        <p className="mb-4 text-sm text-white/60">{skill.description}</p>

        {/* Proficiency label */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-white/40">Proficiency</span>
          <span className="text-xs font-medium text-cyan-400">{skill.proficiency}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>
      </div>

      {/* ── Hover Tooltip / Expanded Description ── */}
      <div
        className={`
          pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2
          rounded-lg border border-white/10 bg-black/90 p-3 text-xs text-white/70
          shadow-xl shadow-cyan-500/5 backdrop-blur-md
          transition-all duration-200 ease-out
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        `}
      >
        {skill.extendedDescription}
        {/* Tooltip arrow */}
        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-white/10 bg-black/90" />
      </div>
    </div>
  );
}

// ─── SkillsSection Component ────────────────────────────────────────────────

/**
 * Skills section for the portfolio page.
 * Displays a grid of interactive skill cards with glassmorphism effects,
 * progress bars, and hover tooltips for extended descriptions.
 */
export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ── Section Heading ── */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Skills &amp; Expertise
          </h2>
          {/* Cyan underline accent */}
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600" />
          <p className="mt-4 text-lg text-white/50">
            Technologies and tools I work with daily
          </p>
        </div>

        {/* ── Skills Grid ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <SkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
