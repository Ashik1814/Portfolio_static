'use client';

/**
 * Skills Detail Page — /skills
 *
 * Full interactive grid of all 8 skills with detailed descriptions,
 * category filters, and hover tooltips for extended information.
 * All buttons use the animated border dot effect.
 */

import { useState, use } from 'react';
import {
  Palette,
  Code2,
  Server,
  Box,
  Github,
  Terminal,
  Layers,
  ArrowRight,
} from 'lucide-react';
import AnimatedBorderButton from '@/components/ui/animated-border-button';

// ─── Type Definitions ───────────────────────────────────────────────────────

interface Skill {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  extendedDescription: string;
  category: string;
}

// ─── Skills Data ────────────────────────────────────────────────────────────

const skills: Skill[] = [
  {
    name: 'Figma',
    icon: Palette,
    description: 'Design systems, prototyping, and user research',
    extendedDescription:
      'Expert in building scalable design systems, high-fidelity prototyping, component libraries, and conducting user research to validate design decisions. Proficient in Figma auto-layout, variables, and advanced prototyping features.',
    category: 'Design',
  },
  {
    name: 'TypeScript',
    icon: Code2,
    description: 'Type-safe applications with modern TypeScript patterns',
    extendedDescription:
      'Proficient in advanced TypeScript patterns including generics, discriminated unions, conditional types, and strict type-safe architectures for large codebases. Experience with utility types and type-level programming.',
    category: 'Languages',
  },
  {
    name: 'React/Next.js',
    icon: Layers,
    description: 'Full-stack React applications with Next.js',
    extendedDescription:
      'Deep experience with Next.js App Router, SSR/SSG, API routes, middleware, and building performant full-stack React applications at scale. Expert in React Server Components and streaming.',
    category: 'Frameworks',
  },
  {
    name: 'Node.js',
    icon: Server,
    description: 'Backend APIs, real-time services, and serverless functions',
    extendedDescription:
      'Skilled in building RESTful & GraphQL APIs, WebSocket real-time services, microservices architecture, and deploying serverless functions on edge runtimes. Experience with Express, Fastify, and tRPC.',
    category: 'Backend',
  },
  {
    name: 'Three.js',
    icon: Box,
    description: 'Interactive 3D web experiences and WebGL',
    extendedDescription:
      'Capable of creating immersive 3D web experiences using Three.js, custom shaders, post-processing effects, and performance-optimized WebGL scenes. Experience with R3F, Drei, and physics engines.',
    category: 'Frameworks',
  },
  {
    name: 'Tailwind CSS',
    icon: Terminal,
    description: 'Utility-first CSS with custom design systems',
    extendedDescription:
      'Expert in utility-first CSS methodology, building custom Tailwind plugins, design tokens, responsive layouts, and maintaining consistent design systems at scale. Proficient with Tailwind v4 and CSS custom properties.',
    category: 'Styling',
  },
  {
    name: 'Git & CI/CD',
    icon: Github,
    description: 'Version control and automated deployment pipelines',
    extendedDescription:
      'Experienced with Git workflows, branching strategies, code review processes, and setting up CI/CD pipelines with GitHub Actions, GitLab CI, and automated testing. Expert in monorepo management with Turborepo.',
    category: 'DevOps',
  },
  {
    name: 'UI/UX Design',
    icon: Layers,
    description: 'User-centered design thinking and accessibility',
    extendedDescription:
      'Passionate about user-centered design, accessibility standards (WCAG 2.1 AA), interaction design, information architecture, and creating inclusive digital experiences. Conduct regular usability testing and heuristic evaluations.',
    category: 'Design',
  },
];

/** Unique categories for filtering */
const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];

// ─── SkillCard Component ────────────────────────────────────────────────────

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = skill.icon;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl border p-6
          transition-all duration-300 ease-out
          bg-white/5 backdrop-blur-lg
          border-white/10
          hover:scale-105 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10
        `}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Category badge */}
        <span className="mb-4 inline-block rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-400">
          {skill.category}
        </span>

        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
          <Icon className="h-6 w-6" />
        </div>

        {/* Skill name */}
        <h3 className="mb-3 text-h3 text-white">{skill.name}</h3>

        {/* Short description */}
        <p className="text-[0.875rem] text-white/60">{skill.description}</p>
      </div>

      {/* Hover Tooltip */}
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
        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-white/10 bg-black/90" />
      </div>
    </div>
  );
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function SkillsPage({ params, searchParams }: { params: Promise<Record<string, string | string[]>>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  use(params);
  use(searchParams);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredSkills =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-12 text-center">
          <h1 className="text-h1 text-white">
            Skills &amp; Expertise
          </h1>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600" />
          <p className="mt-6 text-body text-white/50">
            Technologies and tools I work with daily
          </p>
        </div>

        {/* ── Category Filter ─────────────────────────────────────────── */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <AnimatedBorderButton
              key={cat}
              variant="filter"
              size="sm"
              isActive={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </AnimatedBorderButton>
          ))}
        </div>

        {/* ── Skills Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill, index) => (
            <SkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-white/50 text-body">See these skills in action</p>
          <AnimatedBorderButton href="/projects" variant="primary" size="lg">
            View Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedBorderButton>
        </div>
      </div>
    </main>
  );
}
