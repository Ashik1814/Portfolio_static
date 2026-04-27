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

import { useEffect, useRef } from 'react';
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
  Send,
  GraduationCap,
  MapPin,
} from 'lucide-react';

// ─── Summary preview data ──────────────────────────────────────────────────

const topSkills = [
  { name: 'Figma', icon: Palette },
  { name: 'TypeScript', icon: Code2 },
  { name: 'React/Next.js', icon: Layers },
  { name: 'Three.js', icon: Box },
];

const featuredProjects = [
  { title: 'Nebula Dashboard', tag: 'React · Three.js · D3.js', category: 'Web Development' },
  { title: 'E-Commerce Platform', tag: 'Next.js · Stripe · Prisma', category: 'Web Development' },
  { title: 'AI Content Studio', tag: 'TypeScript · OpenAI · WebSocket', category: 'Web Development' },
  { title: 'Healthcare App Redesign', tag: 'Figma · React · User Research', category: 'UI/UX' },
  { title: 'Fintech Mobile App', tag: 'Figma · React · User Research', category: 'UI/UX' },
  { title: 'EdTech Learning Portal', tag: 'Figma · React · Storybook', category: 'UI/UX' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function Home() {
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
          <div className="mb-8 relative flex items-center justify-center">
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

          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-cyan-400 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            UI/UX Designer &amp; Front-End Developer
          </span>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Crafting Digital
            <br />
            <span className="text-cyan-400">Experiences</span>
          </h1>

          <p className="mb-10 max-w-2xl text-base text-white/60 sm:text-lg md:text-xl">
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
        <div ref={cardsRef} className="mx-auto max-w-6xl space-y-10">

          {/* About Summary */}
          <div className="summary-card rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-5">
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
                  <h2 className="text-2xl font-bold text-white">About Me</h2>
                  <p className="mt-2 max-w-xl text-white/60">
                    Senior UI/UX Designer &amp; Front-End Developer with 5+ years of experience
                    crafting digital products. Passionate about design systems, component
                    architecture, and immersive web experiences.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
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
          <div className="summary-card rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h2 className="mb-4 text-2xl font-bold text-white">Skills &amp; Expertise</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {topSkills.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
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

          {/* Projects Summary */}
          <div className="summary-card rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h2 className="mb-4 text-2xl font-bold text-white">Featured Projects</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredProjects.map((project) => (
                    <div
                      key={project.title}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-cyan-500/20 backdrop-blur-md"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-white">{project.title}</h3>
                      </div>
                      <p className="text-xs text-white/50">{project.tag}</p>
                      <span className="mt-2 inline-block rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">{project.category}</span>
                    </div>
                  ))}
                </div>
              </div>
              <AnimatedBorderButton href="/projects" variant="outline" size="md" wrapperClassName="mt-2 md:mt-0">
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </AnimatedBorderButton>
            </div>
          </div>

          {/* Education Summary */}
          <div className="summary-card rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Education</h2>
                  <p className="mt-2 max-w-xl text-white/60">
                    B.Sc. CSE from United International University. Continuously learning through
                    certifications and advanced courses in React, TypeScript, and UI/UX design.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
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

          {/* Contact Summary */}
          <div className="summary-card rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Mail className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Get In Touch</h2>
                  <p className="mt-2 max-w-xl text-white/60">
                    Have a project in mind or want to collaborate? I&apos;d love to hear from you.
                    Send me a message and I&apos;ll get back to you as soon as possible.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/50">
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
      </section>
    </>
  );
}
