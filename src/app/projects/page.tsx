'use client';

/**
 * Projects Detail Page — /projects
 *
 * Full project gallery with category filter tabs and card design matching
 * the provided reference: image header, title, description (line-clamp-2),
 * colored tech badges, and gradient/outline action buttons with animated border.
 */

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Eye, ArrowRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import AnimatedBorderButton from '@/components/ui/animated-border-button';

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
  /** Project thumbnail — place images in /public/projects/ */
  image: string;
}

/** Default placeholder image — change per project as needed */
const DEFAULT_PROJECT_IMAGE = '/projects/saas-marketing-website.png';

const projects: Project[] = [
  {
    title: 'SaaS Marketing Website',
    description: 'A modern SaaS marketing website with clean layout, responsive design, and conversion-optimized sections built in Figma',
    longDescription: 'A conversion-focused SaaS marketing website designed in Figma with a clean, modern layout. Features responsive breakpoints, micro-interactions, and strategically placed CTAs to maximize sign-ups.',
    tags: ['Figma'],
    accent: 'cyan',
    liveUrl: 'https://www.figma.com/proto/nlwcSpHeYKiwCQUzfo9Wcj/SaaS-Marketing-Website?node-id=0-1&t=DLeOgzGDXqUjZUNZ-1',
    sourceUrl: '#',
    features: ['Conversion-optimized layout', 'Responsive design system', 'Micro-interactions', 'Component library'],
    category: 'UI/UX',
    image: '/projects/saas-marketing-website.png',
  },
  {
    title: 'Alchemist.io — Portfolio',
    description: 'A cinematic portfolio website with 3D particle physics, glassmorphism UI, and gravity-manipulation interaction built with Next.js and Three.js',
    longDescription: 'A God-tier portfolio website featuring a Three.js particle physics background with gravity manipulation, glassmorphism UI components, infinite tech-stack marquee, animated border buttons, and a fully responsive dark-mode design. Built with Next.js 16, TypeScript, Tailwind CSS, GSAP, and Three.js.',
    tags: ['Next.js', 'Three.js', 'TypeScript'],
    accent: 'purple',
    liveUrl: 'https://alchemist-io.vercel.app/',
    sourceUrl: '#',
    features: ['Three.js particle physics', 'Glassmorphism UI', 'GSAP scroll animations', 'Gravity manipulation'],
    category: 'Web Development',
    image: '/projects/alchemist-io.png',
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
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'Design System Kit',
    description: 'Comprehensive design system with 200+ components, theming engine, and accessibility compliance',
    longDescription: 'A production-grade design system featuring 200+ React components, a powerful theming engine with CSS variables, full WCAG 2.1 AA accessibility compliance, and comprehensive Storybook documentation.',
    tags: ['Figma'],
    accent: 'amber',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['200+ components', 'Theming engine', 'WCAG 2.1 AA compliant', 'Storybook docs'],
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
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
    image: DEFAULT_PROJECT_IMAGE,
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
    category: 'Web Development',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'Healthcare App Redesign',
    description: 'Complete UX overhaul of a patient management system, significantly improving task completion rates',
    longDescription: 'Redesigned a legacy healthcare application from the ground up, conducting extensive user research with doctors and nurses, creating intuitive workflows, and implementing a modern component-based UI that significantly reduced task completion time.',
    tags: ['Figma', 'React', 'User Research'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['User research & testing', 'Workflow optimization', 'Accessible components', 'Design system creation'],
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
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
    image: DEFAULT_PROJECT_IMAGE,
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
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'Fintech Mobile App',
    description: 'Mobile banking app redesign with intuitive navigation, biometric auth, and real-time transaction tracking',
    longDescription: 'Redesigned a mobile banking application focused on simplifying complex financial workflows. Implemented biometric authentication, real-time spending insights, and a streamlined fund transfer flow that reduced user drop-off by 40%.',
    tags: ['Figma', 'React', 'User Research'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Biometric authentication', 'Spending insights', 'Streamlined transfers', 'Accessibility audit'],
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'Travel Booking Platform',
    description: 'End-to-end travel booking experience with smart recommendations and interactive itinerary builder',
    longDescription: 'Designed a travel booking platform featuring an AI-powered recommendation engine, drag-and-drop itinerary builder, and immersive destination previews. Conducted extensive A/B testing to optimize the booking funnel.',
    tags: ['Figma', 'Next.js', 'Prisma'],
    accent: 'cyan',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Smart recommendations', 'Drag-and-drop planner', 'Immersive previews', 'A/B tested funnel'],
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'EdTech Learning Portal',
    description: 'Interactive e-learning platform with adaptive quizzes, progress dashboards, and gamified achievements',
    longDescription: 'Created an engaging e-learning portal with adaptive quiz algorithms that adjust difficulty in real-time, comprehensive progress dashboards, and a gamification system with badges and streaks to boost retention.',
    tags: ['Figma'],
    accent: 'purple',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Adaptive quizzes', 'Progress dashboards', 'Gamification system', 'WCAG 2.1 compliant'],
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'Food Delivery Redesign',
    description: 'Modern food delivery app with real-time order tracking, personalized menus, and one-tap reordering',
    longDescription: 'Reimagined the food delivery experience with a focus on speed and personalization. Introduced real-time GPS tracking, AI-curated menu suggestions based on dietary preferences, and a one-tap reorder feature that increased repeat orders by 35%.',
    tags: ['Figma', 'React', 'User Research'],
    accent: 'rose',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Real-time tracking', 'Personalized menus', 'One-tap reorder', 'Voice search'],
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'SaaS Admin Dashboard',
    description: 'Enterprise admin panel with role-based access, data visualization widgets, and bulk action workflows',
    longDescription: 'Designed a comprehensive SaaS admin dashboard supporting complex role-based permissions, interactive data visualization widgets with drill-down capabilities, and efficient bulk action workflows for managing thousands of records.',
    tags: ['Figma'],
    accent: 'amber',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Role-based access', 'Drill-down charts', 'Bulk actions', 'Dark/light themes'],
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'Fitness Tracker App',
    description: 'Health and fitness companion with workout plans, nutrition logging, and social community features',
    longDescription: 'Designed a holistic fitness app combining personalized workout plans, barcode-scanned nutrition logging, and a social community with challenges and leaderboards. Focused on habit-forming UX with streaks and milestone celebrations.',
    tags: ['Figma', 'React', 'User Research'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Custom workout plans', 'Nutrition logging', 'Social challenges', 'Habit tracking'],
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
];

/** Unique categories derived from project data */
const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

// ─── Style Maps ─────────────────────────────────────────────────────────────

/** Gradient backgrounds for project image placeholders */
const imageGradientMap: Record<Project['accent'], string> = {
  cyan: 'from-cyan-900/80 via-cyan-800/60 to-teal-900/80',
  purple: 'from-purple-900/80 via-purple-800/60 to-indigo-900/80',
  emerald: 'from-emerald-900/80 via-emerald-800/60 to-green-900/80',
  amber: 'from-amber-900/80 via-amber-800/60 to-orange-900/80',
  rose: 'from-rose-900/80 via-rose-800/60 to-red-900/80',
};

/** Glow effect on hover */
const glowMap: Record<Project['accent'], string> = {
  cyan: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]',
  purple: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]',
  emerald: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
  amber: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]',
  rose: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]',
};

/** Colored tech badges — maps each tag to a color scheme */
const tagColorMap: Record<string, { bg: string; text: string }> = {
  'React': { bg: 'bg-cyan-500/20', text: 'text-cyan-300' },
  'Three.js': { bg: 'bg-cyan-500/20', text: 'text-cyan-300' },
  'D3.js': { bg: 'bg-orange-500/20', text: 'text-orange-300' },
  'Next.js': { bg: 'bg-slate-500/20', text: 'text-slate-300' },
  'Node.js': { bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
  'MongoDB': { bg: 'bg-teal-500/20', text: 'text-teal-300' },
  'TypeScript': { bg: 'bg-blue-500/20', text: 'text-blue-300' },
  'OpenAI': { bg: 'bg-green-500/20', text: 'text-green-300' },
  'WebSocket': { bg: 'bg-teal-500/20', text: 'text-teal-300' },
  'Figma': { bg: 'bg-rose-500/20', text: 'text-rose-300' },
  'Storybook': { bg: 'bg-orange-500/20', text: 'text-orange-300' },
  'Python': { bg: 'bg-yellow-500/20', text: 'text-yellow-300' },
  'NLP': { bg: 'bg-green-500/20', text: 'text-green-300' },
  'GSAP': { bg: 'bg-green-500/20', text: 'text-green-300' },
  'WebGL': { bg: 'bg-cyan-500/20', text: 'text-cyan-300' },
  'WebXR': { bg: 'bg-purple-500/20', text: 'text-purple-300' },
  'PostgreSQL': { bg: 'bg-blue-500/20', text: 'text-blue-300' },
  'User Research': { bg: 'bg-amber-500/20', text: 'text-amber-300' },
  'Prisma': { bg: 'bg-teal-500/20', text: 'text-teal-300' },
  'Stripe': { bg: 'bg-purple-500/20', text: 'text-purple-300' },
};

/** Default tag style for unmapped technologies */
const defaultTagColor = { bg: 'bg-white/10', text: 'text-white/70' };

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-16 text-center">
          <h1 className="text-h1 text-white">
            Featured Projects
          </h1>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600" />
          <p className="mt-6 text-body text-white/50">
            A curated selection of work that showcases my skills and passion for
            building exceptional digital experiences.
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

        {/* ── Project Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.title}
              className={`group/card relative overflow-hidden rounded-2xl border border-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/20 ${glowMap[project.accent]}`}
            >
              {/* Project Image */}
              <div
                className={`relative h-48 overflow-hidden`}
              >
                 <Image
                   src={project.image}
                   alt={project.title}
                   fill
                   className="object-cover object-top transition-transform duration-500 group-hover/card:scale-105"
                   sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                   loading="lazy"
                 />


                {/* Dark gradient overlay for readability */}
                <div className={`absolute inset-0 bg-gradient-to-br ${imageGradientMap[project.accent]} opacity-30`} />

                {/* Category badge */}
                <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <h3 className="text-h3 text-white">
                  {project.title}
                </h3>

                {/* Description — line-clamp-2 */}
                <p className="text-sm text-[#94a3b8] leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Tags — colored badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.tags.map((tag) => {
                    const colors = tagColorMap[tag] || defaultTagColor;
                    return (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {/* Live Demo — gradient button with animated border */}
                  <AnimatedBorderButton
                    href={project.liveUrl}
                    variant="primary"
                    size="sm"
                    borderRadius={6}
                    animationDuration={4}
                    wrapperClassName="flex-1"
                    fullWidth
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live Demo
                  </AnimatedBorderButton>

                  {/* View — outline button with animated border */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="group relative overflow-hidden inline-flex flex-1 transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    style={{ borderRadius: '6px' }}
                  >
                    <div className="-inset-px pointer-events-none absolute rounded-[inherit] border-2 border-inset" style={{ maskClip: 'padding-box, border-box', maskComposite: 'intersect', maskImage: 'linear-gradient(transparent, transparent), linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0))' }}>
                      <div className="absolute aspect-square glow-border-dot" style={{ width: '20px', background: 'linear-gradient(to right, transparent, rgb(167, 139, 250), rgb(0, 229, 255))', offsetPath: 'rect(0px auto auto 0px round 6px)', animation: '5s linear 0s infinite normal none running border-glow-travel', transition: 'filter 0.3s, width 0.3s' }}></div>
                    </div>
                    <span className="relative z-[1] inline-flex items-center justify-center gap-1.5 px-6 py-2 text-sm h-12 bg-[#00e5ff]/5 border border-[#00e5ff]/30 text-[#00e5ff] font-medium group-hover:bg-[#00e5ff]/15 group-hover:border-[#00e5ff]/60 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-200 group-hover:scale-[1.04] group-active:scale-[0.97] w-full cursor-pointer">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Empty state when no projects match filter ── */}
        {filteredProjects.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-lg text-white/40">No projects found in this category.</p>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-white/50 text-body">Interested in working together?</p>
          <AnimatedBorderButton href="/contact" variant="primary" size="lg">
            Let&apos;s Talk
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedBorderButton>
        </div>

        {/* Project Image Modal */}
        <Dialog.Root open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 p-4 animate-in fade-in zoom-in-95 duration-200">
              <Dialog.Title className="sr-only">{selectedProject?.title}</Dialog.Title>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0f]">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/70 hover:text-white transition-colors"
                >
                  <Eye className="h-5 w-5" />
                </button>
                {selectedProject && (
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    width={1200}
                    height={800}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </main>
  );
}
