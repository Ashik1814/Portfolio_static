'use client';

/**
 * Home Page — Portfolio Summary Landing
 *
 * A landing page with:
 *   - 3D hero with name/title and CTAs (aether background is now global)
 *   - Summary preview cards for About, Skills, Projects, Education, and Contact
 *   - Each card links to its dedicated detail page via Next.js routing
 *   - All buttons feature the animated traveling border glow effect
 */

import { useEffect, useRef, use } from 'react';
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
  Github,
  Linkedin,
  Youtube,
  Facebook,
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

  const cardsRef = useRef<HTMLDivElement>(null);

  // Entrance animation for summary cards
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const items = cards.querySelectorAll('.summary-card');
    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      }
    );
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Full viewport (aether particles flow behind via global canvas)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Content overlay — pt-20 ensures profile image clears the fixed navbar */}
        <div className="relative z-10 flex flex-col items-center px-4 pt-20 text-center">
          {/* Profile Image */}
          <div className="mb-10 relative flex items-center justify-center">
            <div className="h-64 w-64 rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_60px_rgba(0,212,255,0.25)]">
              <Image
                src="/profile.jpeg"
                alt="Alex Chen — UI/UX Designer & Front-End Developer"
                width={256}
                height={256}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/10 scale-110" />
          </div>

          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-cyan-400 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            UI/UX Designer &amp; Front-End Developer
          </span>

          <h1 className="mb-8 text-h1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Crafting Digital
            <br />
            Experiences
          </h1>

          <p className="mb-12 max-w-2xl text-body text-white/60">
            I design and build beautiful, performant web experiences that delight
            users and drive results. Specializing in interactive interfaces and
            immersive 3D web.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <AnimatedBorderButton href="/projects" variant="primary" size="lg">
              View My Work
            </AnimatedBorderButton>
            <AnimatedBorderButton href="/contact" variant="outline" size="lg">
              Get In Touch
            </AnimatedBorderButton>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SUMMARY CARDS — Brief previews linking to detail pages
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div ref={cardsRef} className="mx-auto max-w-7xl space-y-8">

          {/* About Summary */}
          <div className="summary-card rounded-2xl border border-white/[0.06] p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/30 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl overflow-hidden border border-cyan-400/20">
                  <Image
                    src="/profile.jpeg"
                    alt="Alex Chen"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-h2 text-white">About Me</h2>
                  <p className="mt-4 max-w-xl text-body text-white/60">
                    Senior UI/UX Designer &amp; Front-End Developer with 5+ years of experience
                    crafting digital products. Passionate about design systems, component
                    architecture, and immersive web experiences.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {['5+ Years', '50+ Projects', '30+ Clients'].map((stat) => (
                      <span
                        key={stat}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-cyan-400"
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

          {/* Skills Summary */}
          <div className="summary-card rounded-2xl border border-white/[0.06] p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/30 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h2 className="mb-6 text-h2 text-white">Skills &amp; Expertise</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {topSkills.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] p-4 text-center backdrop-blur-sm"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-white">{skill.name}</span>
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

          {/* Projects Summary — Full project cards matching /projects page */}
          <div className="summary-card">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-h2 text-white">Featured Projects</h2>
                <AnimatedBorderButton href="/projects" variant="outline" size="md">
                  View All
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </AnimatedBorderButton>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <article
                    key={project.title}
                    className={`group/card relative overflow-hidden rounded-2xl border border-white/[0.06] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/30 ${glowMap[project.accent]}`}
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
                    <div className="p-6 space-y-4">
                      <h3 className="text-h3 text-white">{project.title}</h3>
                      <p className="text-[0.875rem] text-[#94a3b8] leading-relaxed line-clamp-2">{project.description}</p>

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

          {/* Education Summary */}
          <div className="summary-card rounded-2xl border border-white/[0.06] p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/30 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-h2 text-white">Education</h2>
                  <p className="mt-4 max-w-xl text-body text-white/60">
                    B.Sc. CSE from United International University. Continuously learning through
                    certifications and advanced courses in React, TypeScript, and UI/UX design.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {['B.Sc. CSE', '6 Certifications', '12+ Courses', 'GPA 5.00/5.00 (HSC)'].map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-cyan-400"
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

          {/* Connect Section — Rotating border card with socials */}
          <div className="summary-card">
            <div className="text-center mb-8">
              <h2 className="text-h2 text-white mb-4">
                Let&apos;s <span className="gradient-text-pink-blue">Connect</span>
              </h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl border border-white/[0.06] backdrop-blur-md transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_0_30px_-5px_rgba(0,229,255,0.15)] overflow-hidden">
                <div className="p-8 sm:p-10 text-center">
                  <div className="relative z-10">
                    <h3 className="text-h3 text-white mb-4">
                      Let&apos;s work together
                    </h3>
                    <p className="text-body text-[#94a3b8] mb-8 max-w-md mx-auto">
                      I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                      {[
                        { Icon: Github, href: 'https://github.com/Ashik1814', label: 'GitHub' },
                        { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                        { Icon: Youtube, href: 'https://youtube.com/@arckbreaker1814?si=iSdffxmKQl47TeMk', label: 'YouTube' },
                        { Icon: Facebook, href: 'https://www.facebook.com/share/18FuK1HEes/', label: 'Facebook' },
                      ].map(({ Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="w-12 h-12 rounded-xl border border-[#1e3a5f]/50 flex items-center justify-center text-[#64748b] hover:text-[#00e5ff] hover:border-[#00e5ff]/30 hover:bg-[#00e5ff]/5 transition-all duration-200"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <AnimatedBorderButton href="/contact" variant="primary" size="lg">
                      Get In Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </AnimatedBorderButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
