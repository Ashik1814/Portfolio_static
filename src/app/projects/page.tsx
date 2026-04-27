'use client';

/**
 * Projects Detail Page — /projects
 *
 * Full project gallery with category filter tabs and card design matching
 * the provided reference: image header, title, description (line-clamp-2),
 * colored tech badges, and gradient/outline action buttons with animated border.
 */

import { useState, use } from 'react';
import { ExternalLink, Eye, ArrowRight } from 'lucide-react';
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
    category: 'Web Development',
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with seamless checkout, inventory management, and integrated payments.',
    longDescription: 'A complete e-commerce platform built with Next.js, featuring a headless CMS for content management, Stripe payment integration, and an optimized multi-step checkout flow that significantly increased conversion rates.',
    tags: ['React', 'Node.js', 'MongoDB'],
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
    category: 'Web Development',
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
    category: 'UI/UX',
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
  },
  {
    title: 'EdTech Learning Portal',
    description: 'Interactive e-learning platform with adaptive quizzes, progress dashboards, and gamified achievements',
    longDescription: 'Created an engaging e-learning portal with adaptive quiz algorithms that adjust difficulty in real-time, comprehensive progress dashboards, and a gamification system with badges and streaks to boost retention.',
    tags: ['Figma', 'React', 'Storybook'],
    accent: 'purple',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Adaptive quizzes', 'Progress dashboards', 'Gamification system', 'WCAG 2.1 compliant'],
    category: 'UI/UX',
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
  },
  {
    title: 'SaaS Admin Dashboard',
    description: 'Enterprise admin panel with role-based access, data visualization widgets, and bulk action workflows',
    longDescription: 'Designed a comprehensive SaaS admin dashboard supporting complex role-based permissions, interactive data visualization widgets with drill-down capabilities, and efficient bulk action workflows for managing thousands of records.',
    tags: ['Figma', 'React', 'Storybook'],
    accent: 'amber',
    liveUrl: '#',
    sourceUrl: '#',
    features: ['Role-based access', 'Drill-down charts', 'Bulk actions', 'Dark/light themes'],
    category: 'UI/UX',
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
  rose: 'from-rose-900/80 via-rose-800/60 to-pink-900/80',
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

export default function ProjectsPage({ params, searchParams }: { params: Promise<Record<string, string | string[]>>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  use(params);
  use(searchParams);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.title}
              className={`group/card relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/20 ${glowMap[project.accent]}`}
            >
              {/* Project Image / Visual Header */}
              <div
                className={`relative h-48 bg-gradient-to-br ${imageGradientMap[project.accent]} overflow-hidden`}
              >
                {/* Grid pattern overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                {/* Radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

                {/* Category badge */}
                <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {project.category}
                </span>

                {/* Hover overlay for image area */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover/card:bg-black/20">
                  <span className="text-white/0 transition-all duration-300 group-hover/card:text-white/90 text-sm font-medium backdrop-blur-sm rounded-lg px-4 py-2">
                    Preview
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-3">
                {/* Title */}
                <h3 className="text-lg font-bold text-white">
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
                  <AnimatedBorderButton
                    href={project.sourceUrl}
                    variant="outline"
                    size="sm"
                    borderRadius={6}
                    animationDuration={5}
                    wrapperClassName="flex-1"
                    fullWidth
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </AnimatedBorderButton>
                </div>
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
          <AnimatedBorderButton href="/contact" variant="primary" size="lg">
            Let&apos;s Talk
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedBorderButton>
        </div>
      </div>
    </main>
  );
}
