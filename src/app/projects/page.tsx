'use client';

/**
 * Projects Detail Page — /projects
 *
 * Full project gallery with category filter tabs (All, UI/UX, Web Development, 3D / Creative),
 * detailed cards featuring gradient banners, hover overlays, and technology badges.
 */

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, Box } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── Types & Data ───────────────────────────────────────────────────────────

interface Project {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  accent: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  liveUrl: string;
  sourceUrl: string;
  features: string[];
  category: string;
}

const projects: Project[] = [
  {
    title: 'Nebula Dashboard',
    description: 'A real-time analytics dashboard with 3D data visualization and interactive charts built with React and Three.js',
    longDescription: 'An enterprise-grade analytics dashboard that transforms complex data sets into intuitive 3D visualizations. Features real-time WebSocket data streaming, interactive Three.js charts, and customizable widget layouts with drag-and-drop.',
    tags: ['React', 'Three.js', 'D3.js'],
    accent: 'cyan',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Real-time data streaming', '3D chart visualizations', 'Customizable widget layout', 'Dark/light theme support'],
    category: '3D / Creative',
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with headless CMS, payment integration, and optimized checkout flows',
    longDescription: 'A complete e-commerce platform built with Next.js, featuring a headless CMS for content management, Stripe payment integration, and an optimized multi-step checkout flow that increased conversion rates by 23%.',
    tags: ['Next.js', 'Stripe', 'Prisma'],
    accent: 'purple',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Headless CMS integration', 'Stripe payment processing', 'Multi-step checkout', 'Inventory management'],
    category: 'Web Development',
  },
  {
    title: 'AI Content Studio',
    description: 'AI-powered content creation platform with real-time collaboration and intelligent suggestions',
    longDescription: 'A collaborative content creation platform powered by OpenAI, featuring real-time co-editing via WebSockets, AI-driven writing suggestions, and automated content optimization for SEO and readability.',
    tags: ['TypeScript', 'OpenAI', 'WebSocket'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['AI writing assistant', 'Real-time collaboration', 'SEO optimization', 'Content analytics'],
    category: 'Web Development',
  },
  {
    title: 'Design System Kit',
    description: 'Comprehensive design system with 200+ components, theming engine, and accessibility compliance',
    longDescription: 'A production-grade design system featuring 200+ React components, a powerful theming engine with CSS variables, full WCAG 2.1 AA accessibility compliance, and comprehensive Storybook documentation.',
    tags: ['Figma', 'React', 'Storybook'],
    accent: 'amber',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['200+ components', 'Theming engine', 'WCAG 2.1 AA compliant', 'Storybook docs'],
    category: 'UI/UX',
  },
  {
    title: 'Social Analytics',
    description: 'Social media analytics tool with sentiment analysis, trend detection, and automated reporting',
    longDescription: 'A social media analytics platform that uses NLP for sentiment analysis, detects emerging trends across platforms, and generates automated weekly reports with actionable insights for marketing teams.',
    tags: ['Python', 'React', 'NLP'],
    accent: 'rose',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Sentiment analysis', 'Trend detection', 'Automated reporting', 'Multi-platform support'],
    category: 'Web Development',
  },
  {
    title: 'Immersive Portfolio',
    description: '3D interactive portfolio with scroll-based animations and WebGL particle effects',
    longDescription: 'This very portfolio! Built with Next.js, Three.js, and GSAP to create an immersive browsing experience with a cinematic particle field hero, scroll-triggered animations, and glassmorphism UI.',
    tags: ['Three.js', 'GSAP', 'WebGL'],
    accent: 'cyan',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['WebGL particle system', 'GSAP scroll animations', 'Glassmorphism UI', 'Responsive design'],
    category: '3D / Creative',
  },
  {
    title: 'Healthcare App Redesign',
    description: 'Complete UX overhaul of a patient management system, improving task completion rates by 40%',
    longDescription: 'Redesigned a legacy healthcare application from the ground up, conducting extensive user research with doctors and nurses, creating intuitive workflows, and implementing a modern component-based UI that reduced task completion time by 40%.',
    tags: ['Figma', 'React', 'User Research'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['User research & testing', 'Workflow optimization', 'Accessible components', 'Design system creation'],
    category: 'UI/UX',
  },
  {
    title: 'Task Management Suite',
    description: 'Collaborative project management tool with Kanban boards, Gantt charts, and team analytics',
    longDescription: 'A full-featured project management platform supporting Kanban boards, Gantt chart timelines, team workload analytics, and real-time collaboration. Built with a focus on performance, handling 10,000+ tasks without lag.',
    tags: ['Next.js', 'PostgreSQL', 'WebSocket'],
    accent: 'purple',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Kanban & Gantt views', 'Real-time collaboration', 'Team analytics', 'Performance optimized'],
    category: 'Web Development',
  },
  {
    title: '3D Product Configurator',
    description: 'Interactive 3D product customizer with real-time material preview and AR try-on',
    longDescription: 'A WebGL-based product configurator allowing customers to customize products in 3D with real-time material, color, and texture previews. Features an AR try-on mode for mobile devices using WebXR.',
    tags: ['Three.js', 'WebXR', 'React'],
    accent: 'amber',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Real-time 3D preview', 'Material customization', 'AR try-on mode', 'Performance optimized'],
    category: '3D / Creative',
  },
];

/** Unique categories derived from project data */
const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

// ─── Style Maps ─────────────────────────────────────────────────────────────

const gradientMap: Record<Project['accent'], string> = {
  cyan: 'from-cyan-500/20 to-cyan-600/5',
  purple: 'from-purple-500/20 to-purple-600/5',
  emerald: 'from-emerald-500/20 to-emerald-600/5',
  amber: 'from-amber-500/20 to-amber-600/5',
  rose: 'from-rose-500/20 to-rose-600/5',
};

const glowMap: Record<Project['accent'], string> = {
  cyan: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]',
  purple: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]',
  emerald: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
  amber: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]',
  rose: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]',
};

const accentTextMap: Record<Project['accent'], string> = {
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  rose: 'text-rose-400',
};

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#050510] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Featured Projects
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600" />
          <p className="mt-6 text-lg text-white/50">
            A curated selection of work that showcases my skills and passion for
            building exceptional digital experiences.
          </p>
        </div>

        {/* ── Category Filter ─────────────────────────────────────────── */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-black'
                  : 'border border-white/10 bg-white/5 text-white/60 hover:border-cyan-500/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Project Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <article
              key={project.title}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg transition-transform duration-500 hover:scale-[1.02] hover:border-cyan-500/20 ${glowMap[project.accent]}`}
            >
              {/* Gradient banner */}
              <div
                className={`relative h-48 bg-gradient-to-br ${gradientMap[project.accent]} overflow-hidden`}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                <Box className="absolute right-6 bottom-6 h-24 w-24 text-white opacity-30 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />

                {/* Category badge on banner */}
                <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              {/* Card body */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-white">{project.title}</h2>
                <p className="mt-2 text-sm text-white/60">{project.description}</p>

                {/* Detailed description */}
                <p className="mt-3 text-sm leading-relaxed text-white/40">
                  {project.longDescription}
                </p>

                {/* Features list */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {project.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <span className={`h-1 w-1 rounded-full ${accentTextMap[project.accent]} bg-current`} />
                      <span className="text-xs text-white/50">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="border-0 bg-white/10 text-xs text-white/70 hover:bg-white/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <a
                  href={project.liveUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-cyan-400"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
                <a
                  href={project.sourceUrl}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  <Github className="h-4 w-4" />
                  Source Code
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* ── Empty state when no projects match filter ── */}
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-white/40">No projects found in this category.</p>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="mt-14 text-center">
          <p className="mb-4 text-white/50">Interested in working together?</p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-cyan-400"
          >
            Let&apos;s Talk
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
