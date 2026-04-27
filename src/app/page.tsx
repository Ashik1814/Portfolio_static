'use client';

/**
 * Home Page — God-Tier Portfolio
 *
 * A single-page scrolling portfolio with 5 sections:
 *   1. Home (Hero with 3D background)
 *   2. About (Glassmorphism bio card)
 *   3. Skills (Interactive grid)
 *   4. Projects (Hover-scale gallery)
 *   5. Education & Contact (Validated form + education timeline)
 *
 * Uses GSAP ScrollTrigger for smooth section reveal animations.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from '@/components/navbar';
import HeroSection from '@/components/sections/hero';
import About from '@/components/sections/about';
import SkillsSection from '@/components/sections/skills';
import Projects from '@/components/sections/projects';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/footer';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  /** Ref for the main content wrapper — used as the GSAP context root */
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    // ─── Section Reveal Animations ───────────────────────────────────────
    // Each section fades in and slides up when it enters the viewport.
    // The scrub: false means the animation plays once on trigger.

    const sections = main.querySelectorAll('section');

    sections.forEach((section) => {
      // Skip the hero section — it should be visible immediately
      if (section.id === 'home') return;

      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ─── Heading Accent Animation ───────────────────────────────────────
    // Animate the cyan underline accents when they come into view

    const accentBars = main.querySelectorAll('.bg-cyan-400, .bg-cyan-500, [class*="from-cyan-400"]');

    accentBars.forEach((bar) => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ─── Cleanup ─────────────────────────────────────────────────────────
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#050510]">
      {/* ── Navigation Bar ────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main ref={mainRef} className="flex-1">
        {/* Section 1: Hero with 3D Particle Field */}
        <HeroSection />

        {/* Section 2: About with Glassmorphism Bio Card */}
        <About />

        {/* Section 3: Skills Interactive Grid */}
        <SkillsSection />

        {/* Section 4: Projects Gallery */}
        <Projects />

        {/* Section 5: Education & Contact Form */}
        <ContactSection />
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
