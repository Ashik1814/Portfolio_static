'use client';

import { ExternalLink, Github, ArrowUpRight, Box } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Represents a single project entry displayed in the Projects section.
 *
 * @property title       - The display name of the project.
 * @property description - A short summary of what the project does (max 2 lines).
 * @property tags        - Technology / tool badges shown beneath the description.
 * @property accent      - Tailwind colour token used for the gradient banner and glow.
 * @property liveUrl     - Placeholder URL for the live demo action button.
 * @property sourceUrl   - Placeholder URL for the source-code action button.
 */
interface Project {
  title: string;
  description: string;
  tags: string[];
  accent: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  liveUrl: string;
  sourceUrl: string;
}

/**
 * Static project data – six featured portfolio pieces.
 * Each entry maps to a visually distinct card with its own colour accent.
 */
const projects: Project[] = [
  {
    title: 'Nebula Dashboard',
    description:
      'A real-time analytics dashboard with 3D data visualization and interactive charts built with React and Three.js',
    tags: ['React', 'Three.js', 'D3.js'],
    accent: 'cyan',
    liveUrl: '#',
    sourceUrl: '#',
  },
  {
    title: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce solution with headless CMS, payment integration, and optimized checkout flows',
    tags: ['Next.js', 'Stripe', 'Prisma'],
    accent: 'purple',
    liveUrl: '#',
    sourceUrl: '#',
  },
  {
    title: 'AI Content Studio',
    description:
      'AI-powered content creation platform with real-time collaboration and intelligent suggestions',
    tags: ['TypeScript', 'OpenAI', 'WebSocket'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
  },
  {
    title: 'Design System Kit',
    description:
      'Comprehensive design system with 200+ components, theming engine, and accessibility compliance',
    tags: ['Figma', 'React', 'Storybook'],
    accent: 'amber',
    liveUrl: '#',
    sourceUrl: '#',
  },
  {
    title: 'Social Analytics',
    description:
      'Social media analytics tool with sentiment analysis, trend detection, and automated reporting',
    tags: ['Python', 'React', 'NLP'],
    accent: 'rose',
    liveUrl: '#',
    sourceUrl: '#',
  },
  {
    title: 'Immersive Portfolio',
    description:
      '3D interactive portfolio with scroll-based animations and WebGL particle effects',
    tags: ['Three.js', 'GSAP', 'WebGL'],
    accent: 'cyan',
    liveUrl: '#',
    sourceUrl: '#',
  },
];

/**
 * Maps an accent colour token to the gradient classes used for the card banner.
 * The gradient runs from a more opaque shade to a near-transparent one, creating
 * a subtle wash of colour that still lets the grid pattern underneath show through.
 */
const gradientMap: Record<Project['accent'], string> = {
  cyan: 'from-cyan-500/20 to-cyan-600/5',
  purple: 'from-purple-500/20 to-purple-600/5',
  emerald: 'from-emerald-500/20 to-emerald-600/5',
  amber: 'from-amber-500/20 to-amber-600/5',
  rose: 'from-rose-500/20 to-rose-600/5',
};

/**
 * Maps an accent colour token to a glow shadow applied on card hover.
 * Each shadow uses the 500-level shade at low opacity for a soft luminous effect.
 */
const glowMap: Record<Project['accent'], string> = {
  cyan: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]',
  purple: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]',
  emerald: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
  amber: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]',
  rose: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]',
};

/**
 * Projects section component.
 *
 * Renders a full-viewport portfolio showcase with six project cards arranged in a
 * responsive grid. Each card features:
 *  - A colour-accented gradient banner with a subtle CSS grid pattern overlay.
 *  - A floating mockup icon inside the banner for visual depth.
 *  - Project title, description (clamped to 2 lines), and technology badges.
 *  - A hover overlay that reveals "Live Demo" and "Source Code" action buttons.
 *
 * Cards use glassmorphism styling (`bg-white/5`, `backdrop-blur-lg`) and animate
 * on hover with a gentle scale-up, border highlight, and colour-matched glow.
 */
export default function Projects() {
  return (
    <section
      id="projects"
      className="min-h-screen w-full px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* ────────────────────────── Section heading ────────────────────────── */}
      <div className="mx-auto mb-16 max-w-6xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Featured Projects
        </h2>
        {/* Cyan underline accent */}
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600" />
        <p className="mt-6 text-lg text-white/50">
          A curated selection of work that showcases my skills and passion for
          building exceptional digital experiences.
        </p>
      </div>

      {/* ────────────────────────── Project grid ────────────────────────── */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg transition-transform duration-500 hover:scale-[1.02] hover:border-cyan-500/20 ${glowMap[project.accent]}`}
          >
            {/* ── Gradient banner with grid pattern ── */}
            <div
              className={`relative h-48 bg-gradient-to-br ${gradientMap[project.accent]} overflow-hidden`}
            >
              {/* Subtle grid pattern overlay – creates a "blueprint" feel */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Floating mockup icon – provides visual interest in the banner */}
              <Box className="absolute right-6 bottom-6 h-24 w-24 text-white opacity-30 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>

            {/* ── Card body ── */}
            <div className="p-6">
              {/* Project title */}
              <h3 className="text-xl font-bold text-white">
                {project.title}
              </h3>

              {/* Description – clamped to 2 lines for consistent card height */}
              <p className="mt-2 line-clamp-2 text-sm text-white/60">
                {project.description}
              </p>

              {/* Technology tags */}
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

            {/* ── Hover overlay with action buttons ── */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              {/* Live Demo button */}
              <a
                href={project.liveUrl}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-cyan-400"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>

              {/* Source Code button */}
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

      {/* ────────────────────────── View-all CTA ────────────────────────── */}
      <div className="mx-auto mt-14 max-w-6xl text-center">
        <a
          href="#"
          className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
        >
          View all projects
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
