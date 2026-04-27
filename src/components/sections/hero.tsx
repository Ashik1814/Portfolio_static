'use client';

/**
 * Hero Section Component
 *
 * The main landing/home section of the portfolio. Features a full-viewport
 * immersive layout with a Three.js background scene, a glassmorphism-styled
 * badge, large heading with accent color, descriptive subtext, two CTA buttons
 * with smooth scroll navigation, and a bouncing scroll indicator at the bottom.
 */

import ThreeScene from '@/components/three-scene';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles } from 'lucide-react';

/**
 * Smoothly scrolls to a given section by its DOM id.
 * Uses the native `scrollIntoView` API with smooth behavior.
 *
 * @param sectionId - The id of the target section element (without the # prefix)
 */
const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

/**
 * HeroSection – full-viewport hero with 3D background and content overlay.
 */
const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* ── Three.js background scene ── */}
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      {/* ── Content overlay ── */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Glassmorphism badge / pill */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-cyan-400 backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          UI/UX Designer &amp; Front-End Developer
        </span>

        {/* Main heading */}
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Crafting Digital
          <br />
          <span className="text-cyan-400">Experiences</span>
        </h1>

        {/* Descriptive subtext */}
        <p className="mb-10 max-w-2xl text-base text-white/60 sm:text-lg md:text-xl">
          I design and build beautiful, performant web experiences that delight
          users and drive results. Specializing in interactive interfaces and
          immersive 3D web.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Primary CTA – scrolls to projects section */}
          <Button
            onClick={() => scrollToSection('projects')}
            className="bg-cyan-500 text-black hover:bg-cyan-400 cursor-pointer px-8 py-6 text-base font-semibold sm:text-lg"
          >
            View My Work
          </Button>

          {/* Secondary CTA – scrolls to contact section */}
          <Button
            onClick={() => scrollToSection('contact')}
            variant="outline"
            className="border border-white/20 bg-white/5 text-white hover:bg-white/10 cursor-pointer px-8 py-6 text-base font-semibold sm:text-lg"
          >
            Get In Touch
          </Button>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <ArrowDown className="h-5 w-5 animate-bounce text-white/50" />
        <span className="text-xs text-white/40">Scroll to explore</span>
      </div>
    </section>
  );
};

export default HeroSection;
