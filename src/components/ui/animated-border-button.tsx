'use client';

import Link from 'next/link';
import GlowBorder from '@/components/ui/glow-border';
import { ReactNode } from 'react';

/**
 * AnimatedBorderButton — Reusable button with the traveling gradient dot border effect.
 *
 * Features:
 *   - Animated border dot that travels along the button edge (offset-path/offset-distance)
 *   - Hover effects: scale up, glow shadow, dot brightness boost
 *   - Three variants: primary (filled gradient), outline (transparent + border), filter (pill toggle)
 *   - Renders as Next.js <Link> for internal routes, <a> for external/hash links, or <button>
 *
 * Usage:
 *   <AnimatedBorderButton href="/projects" variant="primary" size="lg">
 *     View My Work
 *   </AnimatedBorderButton>
 *
 *   <AnimatedBorderButton variant="filter" isActive={active} onClick={() => setFilter('All')}>
 *     All
 *   </AnimatedBorderButton>
 */

interface AnimatedBorderButtonProps {
  children: ReactNode;
  /** Visual style of the button */
  variant?: 'primary' | 'outline' | 'filter';
  /** If provided, renders as a link. Internal routes use Next.js Link, external/hash use <a>. */
  href?: string;
  /** Click handler (for button/filter elements) */
  onClick?: () => void;
  /** Button type attribute (default: 'button') */
  type?: 'button' | 'submit' | 'reset';
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes for the content span */
  className?: string;
  /** Additional CSS classes for the outer wrapper (useful for layout like flex-1) */
  wrapperClassName?: string;
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Border radius in px. Default varies by variant (8 for primary/outline, 9999 for filter). */
  borderRadius?: number;
  /** Animation duration in seconds. Default: 3 for primary/outline, 4 for filter. */
  animationDuration?: number;
  /** Whether the filter button is currently active (only for variant='filter') */
  isActive?: boolean;
  /** Make the button full width */
  fullWidth?: boolean;
}

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs min-h-8',
  md: 'px-5 py-2.5 text-sm min-h-10',
  lg: 'px-8 py-3.5 text-base sm:text-lg min-h-12',
};

export default function AnimatedBorderButton({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  wrapperClassName = '',
  size = 'md',
  borderRadius,
  animationDuration,
  isActive = false,
  fullWidth = false,
}: AnimatedBorderButtonProps) {
  // Default border radius based on variant
  const radius = borderRadius ?? (variant === 'filter' ? 9999 : 8);
  // Default animation duration based on variant
  const duration = animationDuration ?? (variant === 'filter' ? 4 : 3);

  // Variant-specific content styling
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#00e5ff] to-[#64b5f6] text-[#06080f] font-semibold shadow-md shadow-[#00e5ff]/15 group-hover:shadow-[0_0_25px_rgba(0,229,255,0.35)] group-hover:from-[#00c2e5] group-hover:to-[#5ba3e0]';
      case 'outline':
        return 'bg-[#00e5ff]/5 border border-[#00e5ff]/30 text-[#00e5ff] font-medium group-hover:bg-[#00e5ff]/15 group-hover:border-[#00e5ff]/60 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]';
      case 'filter':
        return isActive
          ? 'bg-[#00e5ff] text-[#06080f] font-semibold shadow-md shadow-[#00e5ff]/15'
          : 'bg-white/5 border border-white/10 text-white/60 font-medium group-hover:border-[#00e5ff]/30 group-hover:text-white group-hover:bg-white/10';
      default:
        return '';
    }
  };

  const content = (
    <span
      className={[
        'relative z-[1] inline-flex items-center justify-center gap-1.5',
        sizeMap[size],
        getVariantClasses(),
        'transition-all duration-200',
        'group-hover:scale-[1.04]',
        'group-active:scale-[0.97]',
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );

  const wrapperStyle = { borderRadius: radius };
  const wrapperClass = [
    'group relative overflow-hidden inline-flex',
    fullWidth ? 'w-full' : '',
    'transition-shadow duration-300',
    'hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]',
    wrapperClassName,
  ].join(' ');

  // Determine if href is external or hash
  const isExternalLink = href && (href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:'));

  // Render as external <a> link
  if (href && isExternalLink && !disabled) {
    return (
      <a
        href={href}
        className={wrapperClass}
        style={wrapperStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GlowBorder borderRadius={radius} duration={duration} />
        {content}
      </a>
    );
  }

  // Render as Next.js Link for internal routes
  if (href && !disabled) {
    return (
      <Link href={href} className={wrapperClass} style={wrapperStyle}>
        <GlowBorder borderRadius={radius} duration={duration} />
        {content}
      </Link>
    );
  }

  // Render as <button>
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={wrapperClass}
      style={wrapperStyle}
    >
      <GlowBorder borderRadius={radius} duration={duration} />
      {content}
    </button>
  );
}
