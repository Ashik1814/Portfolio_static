'use client';

/**
 * Home Page — Portfolio Summary Landing
 *
 * A landing page with:
 *   - 3D hero with name/title and CTAs (aether background is now global)
 *   - Summary preview cards for About, Skills, Projects, and Contact
 *   - Each card links to its dedicated detail page via Next.js routing
 *
 * Navbar and Footer are rendered in the root layout.
 * AetherCanvas (Three.js) is also rendered globally in the root layout.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
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
import Link from 'next/link';

// ─── Summary preview data ──────────────────────────────────────────────────

const topSkills = [
  { name: 'Figma', icon: Palette },
  { name: 'TypeScript', icon: Code2 },
  { name: 'React/Next.js', icon: Layers },
  { name: 'Three.js', icon: Box },
];

const featuredProjects = [
  { title: 'Nebula Dashboard', tag: 'React · Three.js · D3.js' },
  { title: 'E-Commerce Platform', tag: 'Next.js · Stripe · Prisma' },
  { title: 'AI Content Studio', tag: 'TypeScript · OpenAI · WebSocket' },
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
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          {/* Profile Image */}
          <div className="mb-8 relative">
            <div className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_30px_rgba(0,212,255,0.2)]">
              <Image
                src="/profile.jpeg"
                alt="Alex Chen — UI/UX Designer & Front-End Developer"
                width={160}
                height={160}
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
            <Link href="/projects">
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400 cursor-pointer px-8 py-6 text-base font-semibold sm:text-lg">
                View My Work
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border border-white/20 bg-white/5 text-white hover:bg-white/10 cursor-pointer px-8 py-6 text-base font-semibold sm:text-lg"
              >
                Get In Touch
              </Button>
            </Link>
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
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-cyan-500/30 hover:bg-white/10"
              >
                Read More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
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
              <Link
                href="/skills"
                className="group mt-2 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-cyan-500/30 hover:bg-white/10 md:mt-0"
              >
                All Skills
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Projects Summary */}
          <div className="summary-card rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h2 className="mb-4 text-2xl font-bold text-white">Featured Projects</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                    </div>
                  ))}
                </div>
              </div>
              <Link
                href="/projects"
                className="group mt-2 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-cyan-500/30 hover:bg-white/10 md:mt-0"
              >
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
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
                      <MapPin className="h-4 w-4 text-cyan-400" /> San Francisco, CA
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-cyan-400" /> M.Sc. HCI, Stanford
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-cyan-400"
              >
                <Send className="h-4 w-4" />
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
