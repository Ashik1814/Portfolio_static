'use client';

/**
 * Home Page — Premium Portfolio Landing
 *
 * A cinematic landing page with:
 *   - Floating profile image with animated rotating conic-gradient ring
 *   - GSAP staggered text reveal for hero heading
 *   - Animated shimmer badge and gradient headline
 *   - Scroll-down indicator
 *   - Summary preview cards with gradient accent borders & animated counters
 *   - Full project cards matching the /projects page design
 */

import { useEffect, useRef, useState, useCallback, use } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

import AnimatedBorderButton from '@/components/ui/animated-border-button';
import {
  Sparkles,
  Palette,
  Code2,
  Layers,
  Box,
  Mail,
  ArrowRight,
  ExternalLink,
  Eye,
  Send,
  GraduationCap,
  MapPin,
  ChevronDown,
  Briefcase,
  Zap,
  Users,
  Award,
} from 'lucide-react';

// ─── Summary preview data ──────────────────────────────────────────────────

const topSkills = [
  { name: 'Figma', icon: Palette },
  { name: 'TypeScript', icon: Code2 },
  { name: 'React/Next.js', icon: Layers },
  { name: 'Three.js', icon: Box },
];

type ProjectAccent = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';

interface FeaturedProject {
  title: string;
  description: string;
  tags: string[];
  accent: ProjectAccent;
  liveUrl: string;
  sourceUrl: string;
  category: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    title: 'Nebula Dashboard',
    description: 'A real-time analytics dashboard with 3D data visualization and interactive charts built with React and Three.js',
    tags: ['React', 'Three.js', 'D3.js'],
    accent: 'cyan',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'Web Development',
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with seamless checkout, inventory management, and integrated payments.',
    tags: ['React', 'Node.js', 'MongoDB'],
    accent: 'purple',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'Web Development',
  },
  {
    title: 'AI Content Studio',
    description: 'AI-powered content creation platform with real-time collaboration and intelligent suggestions',
    tags: ['TypeScript', 'OpenAI', 'WebSocket'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'Web Development',
  },
  {
    title: 'Healthcare App Redesign',
    description: 'Complete UX overhaul of a patient management system, significantly improving task completion rates',
    tags: ['Figma', 'React', 'User Research'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'UI/UX',
  },
  {
    title: 'Fintech Mobile App',
    description: 'Mobile banking app redesign with intuitive navigation, biometric auth, and real-time transaction tracking',
    tags: ['Figma', 'React', 'User Research'],
    accent: 'rose',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'UI/UX',
  },
  {
    title: 'EdTech Learning Portal',
    description: 'Interactive e-learning platform with adaptive quizzes, progress dashboards, and gamified achievements',
    tags: ['Figma', 'React', 'Storybook'],
    accent: 'purple',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'UI/UX',
  },
];

/** Gradient backgrounds for project image placeholders */
const imageGradientMap: Record<ProjectAccent, string> = {
  cyan: 'from-cyan-900/80 via-cyan-800/60 to-teal-900/80',
  purple: 'from-purple-900/80 via-purple-800/60 to-indigo-900/80',
  emerald: 'from-emerald-900/80 via-emerald-800/60 to-green-900/80',
  amber: 'from-amber-900/80 via-amber-800/60 to-orange-900/80',
  rose: 'from-rose-900/80 via-rose-800/60 to-pink-900/80',
};

/** Glow effect on hover */
const glowMap: Record<ProjectAccent, string> = {
  cyan: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]',
  purple: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]',
  emerald: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
  amber: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]',
  rose: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]',
};

/** Colored tech badges */
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
  'User Research': { bg: 'bg-amber-500/20', text: 'text-amber-300' },
  'Prisma': { bg: 'bg-teal-500/20', text: 'text-teal-300' },
};

const defaultTagColor = { bg: 'bg-white/10', text: 'text-white/70' };

/** Stats for the animated counter section */
const heroStats = [
  { value: 5, suffix: '+', label: 'Years Experience', icon: Briefcase },
  { value: 50, suffix: '+', label: 'Projects Delivered', icon: Zap },
  { value: 30, suffix: '+', label: 'Happy Clients', icon: Users },
  { value: 12, suffix: '', label: 'Awards Won', icon: Award },
];

// ─── Animated Counter Hook ──────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration: number = 2000, startOnMount: boolean = true) {
  const [count, setCount] = useState(startOnMount ? 0 : target);

  useEffect(() => {
    if (!startOnMount) return;
    let startTime: number | null = null;
    let rafId: number;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, startOnMount]);

  return count;
}

// ─── Stat Counter Component ─────────────────────────────────────────────────

function StatCounter({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: React.ElementType }) {
  const count = useAnimatedCounter(value, 2200);
  return (
    <div className="group flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.05]">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-2xl font-bold text-cyan-400" style={{ animation: 'stat-pulse 3s ease-in-out infinite' }}>
        {count}{suffix}
      </span>
      <span className="text-xs text-white/40 font-medium">{label}</span>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Home({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string | string[]>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Next.js 16 requires unwrapping Promise-based props with React.use()
  use(params);
  use(searchParams);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Hero entrance animation with GSAP
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Profile image entrance
    tl.fromTo(
      hero.querySelector('.hero-profile'),
      { opacity: 0, scale: 0.6, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.0, delay: 0.2 }
    );

    // Badge entrance
    tl.fromTo(
      hero.querySelector('.hero-badge'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    );

    // Hero words stagger
    tl.fromTo(
      hero.querySelectorAll('.hero-word'),
      { opacity: 0, y: 40, rotateX: -30 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.12 },
      '-=0.3'
    );

    // Subtitle
    tl.fromTo(
      hero.querySelector('.hero-subtitle'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.2'
    );

    // CTA buttons
    tl.fromTo(
      hero.querySelectorAll('.hero-cta'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      '-=0.3'
    );

    // Stats row
    tl.fromTo(
      hero.querySelector('.hero-stats'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.2'
    );

    // Scroll indicator
    tl.fromTo(
      hero.querySelector('.scroll-indicator'),
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.1'
    );
  }, []);

  // Summary cards entrance animation
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const items = cards.querySelectorAll('.summary-card');
    gsap.fromTo(
      items,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5,
        scrollTrigger: {
          trigger: cards,
          start: 'top 85%',
        },
      }
    );
  }, []);

  const handleScrollDown = useCallback(() => {
    const cardsSection = cardsRef.current;
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Full viewport cinematic landing
          ═══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Radial ambient glow behind content */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="h-[400px] w-[800px] rounded-full bg-purple-500/[0.03] blur-[100px]" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center px-4 pt-20 text-center">
          {/* Profile Image with animated ring */}
          <div className="hero-profile mb-8 relative flex items-center justify-center" style={{ animation: 'profile-float 6s ease-in-out infinite' }}>
            {/* Rotating conic gradient ring */}
            <div className="absolute h-[280px] w-[280px] sm:h-[290px] sm:w-[290px] rounded-full" style={{ animation: 'profile-ring-spin 8s linear infinite' }}>
              <div className="absolute inset-0 rounded-full" style={{
                background: 'conic-gradient(from 0deg, transparent 0%, transparent 65%, rgba(0,229,255,0.5) 80%, rgba(167,139,250,0.4) 90%, transparent 100%)',
              }} />
            </div>
            {/* Inner glow ring */}
            <div className="absolute h-[272px] w-[272px] sm:h-[282px] sm:w-[282px] rounded-full border border-cyan-400/20 shadow-[0_0_40px_rgba(0,229,255,0.15)]" />
            {/* Image */}
            <div className="h-64 w-64 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_60px_rgba(0,212,255,0.25)]">
              <Image
                src="/profile.jpeg"
                alt="Alex Chen — UI/UX Designer & Front-End Developer"
                width={256}
                height={256}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            {/* Outer decorative ring */}
            <div className="absolute h-[300px] w-[300px] sm:h-[310px] sm:w-[310px] rounded-full border border-cyan-400/[0.07]" style={{ animation: 'drift 10s ease-in-out infinite' }} />
          </div>

          {/* Shimmer Badge */}
          <span className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-gradient-to-r from-cyan-400/[0.08] via-cyan-400/[0.15] to-purple-400/[0.08] px-5 py-2 text-sm text-cyan-400 backdrop-blur-sm" style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer-sweep 4s ease-in-out infinite',
          }}>
            <Sparkles className="h-4 w-4" />
            UI/UX Designer &amp; Front-End Developer
          </span>

          {/* Hero Heading — word-by-word reveal */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ perspective: '600px' }}>
            <span className="hero-word inline-block">Crafting</span>{' '}
            <span className="hero-word inline-block">Digital</span>
            <br />
            <span className="hero-word inline-block" style={{
              background: 'linear-gradient(135deg, #00e5ff, #64b5f6, #a78bfa, #00e5ff)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'hero-gradient-shift 6s ease-in-out infinite',
            }}>
              Experiences
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle mb-10 max-w-2xl text-base text-white/50 sm:text-lg md:text-xl leading-relaxed">
            I design and build beautiful, performant web experiences that delight
            users and drive results. Specializing in interactive interfaces and
            immersive 3D web.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="hero-cta">
              <AnimatedBorderButton href="/projects" variant="primary" size="lg">
                View My Work
              </AnimatedBorderButton>
            </div>
            <div className="hero-cta">
              <AnimatedBorderButton href="/contact" variant="outline" size="lg">
                Get In Touch
              </AnimatedBorderButton>
            </div>
          </div>

          {/* Animated Stats Row */}
          <div className="hero-stats mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {heroStats.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <button
          onClick={handleScrollDown}
          className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
          aria-label="Scroll down"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-5 w-5" style={{ animation: 'scroll-bounce 2s ease-in-out infinite' }} />
        </button>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION DIVIDER — Glowing gradient line
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-4xl px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SUMMARY CARDS — Premium previews linking to detail pages
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div ref={cardsRef} className="mx-auto max-w-6xl space-y-10">

          {/* About Summary — Premium card with gradient top border */}
          <div className="summary-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/20 hover:shadow-[0_0_40px_-10px_rgba(0,229,255,0.1)]">
            {/* Gradient top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl overflow-hidden border border-cyan-400/20 shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                    <Image
                      src="/profile.jpeg"
                      alt="Alex Chen"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">About Me</h2>
                    <p className="mt-2 max-w-xl text-white/50 leading-relaxed">
                      Senior UI/UX Designer &amp; Front-End Developer with 5+ years of experience
                      crafting digital products. Passionate about design systems, component
                      architecture, and immersive web experiences.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {['5+ Years', '50+ Projects', '30+ Clients'].map((stat) => (
                        <span
                          key={stat}
                          className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-cyan-400 transition-colors duration-200 group-hover:border-cyan-500/20"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <AnimatedBorderButton href="/about" variant="outline" size="md">
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </AnimatedBorderButton>
              </div>
            </div>
          </div>

          {/* Skills Summary — Premium card */}
          <div className="summary-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/20 hover:shadow-[0_0_40px_-10px_rgba(0,229,255,0.1)]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h2 className="mb-4 text-2xl font-bold text-white">Skills &amp; Expertise</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {topSkills.map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <div
                          key={skill.name}
                          className="group/skill flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.06] hover:scale-105"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition-all duration-300 group-hover/skill:bg-cyan-500/20 group-hover/skill:shadow-[0_0_15px_rgba(0,229,255,0.15)]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-medium text-white/80 group-hover/skill:text-white transition-colors">{skill.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <AnimatedBorderButton href="/skills" variant="outline" size="md" wrapperClassName="mt-2 md:mt-0">
                  All Skills
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </AnimatedBorderButton>
              </div>
            </div>
          </div>

          {/* Projects Summary — Full project cards matching /projects page */}
          <div className="summary-card group">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
                  <p className="mt-1 text-sm text-white/40">A curated selection from Web Development &amp; UI/UX</p>
                </div>
                <AnimatedBorderButton href="/projects" variant="outline" size="md">
                  View All
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </AnimatedBorderButton>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
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

                      {/* Hover overlay */}
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

                      {/* Description */}
                      <p className="text-sm text-[#94a3b8] leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech Tags */}
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
            </div>
          </div>

          {/* Education Summary — Premium card */}
          <div className="summary-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/20 hover:shadow-[0_0_40px_-10px_rgba(0,229,255,0.1)]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/10 transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Education</h2>
                    <p className="mt-2 max-w-xl text-white/50 leading-relaxed">
                      B.Sc. CSE from United International University. Continuously learning through
                      certifications and advanced courses in React, TypeScript, and UI/UX design.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {['B.Sc. CSE', '6 Certifications', '12+ Courses', 'GPA 5.00/5.00 (HSC)'].map((item) => (
                        <span
                          key={item}
                          className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-cyan-400 transition-colors duration-200 group-hover:border-cyan-500/20"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <AnimatedBorderButton href="/education" variant="outline" size="md">
                  View Details
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </AnimatedBorderButton>
              </div>
            </div>
          </div>

          {/* Contact Summary — Premium card with CTA emphasis */}
          <div className="summary-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/20 hover:shadow-[0_0_40px_-10px_rgba(0,229,255,0.1)]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/[0.03] blur-[60px] transition-opacity duration-500 group-hover:bg-cyan-500/[0.06]" />
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/10 transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]">
                    <Mail className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Get In Touch</h2>
                    <p className="mt-2 max-w-xl text-white/50 leading-relaxed">
                      Have a project in mind or want to collaborate? I&apos;d love to hear from you.
                      Send me a message and I&apos;ll get back to you as soon as possible.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/40">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-cyan-400" /> Dhaka, Bangladesh
                      </span>
                    </div>
                  </div>
                </div>
                <AnimatedBorderButton href="/contact" variant="primary" size="md">
                  <Send className="h-4 w-4" />
                  Contact Me
                </AnimatedBorderButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
