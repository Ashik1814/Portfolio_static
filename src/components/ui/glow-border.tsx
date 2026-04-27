/**
 * GlowBorder — Animated traveling border glow effect
 *
 * Renders an overlay with a small gradient square that travels along
 * the element's border using CSS `offset-path` and `offset-distance`.
 * Uses mask compositing to only reveal the glow along the border edge.
 *
 * Usage: Place inside any element with `relative overflow-hidden` and
 * matching `rounded-*` class. Pass `borderRadius` to match.
 */

interface GlowBorderProps {
  /** Border radius in px — should match the parent's rounded-* value.
   *  rounded-lg=8, rounded-xl=12, rounded-2xl=16, rounded-full=9999 */
  borderRadius?: number;
  /** Animation duration in seconds (default: 3) */
  duration?: number;
  /** Gradient colors for the traveling light (default: purple → cyan) */
  gradientFrom?: string;
  gradientTo?: string;
}

export default function GlowBorder({
  borderRadius = 20,
  duration = 3,
  gradientFrom = 'rgb(167, 139, 250)',
  gradientTo = 'rgb(0, 229, 255)',
}: GlowBorderProps) {
  return (
    <div
      className="-inset-px pointer-events-none absolute rounded-[inherit] border-2 border-inset"
      style={{
        maskClip: 'padding-box, border-box',
        maskComposite: 'intersect',
        maskImage:
          'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        WebkitMaskClip: 'padding-box, border-box',
        WebkitMaskComposite: 'intersect',
        WebkitMaskImage:
          'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
      }}
    >
      <div
        className="absolute aspect-square glow-border-dot"
        style={{
          width: '20px',
          background: `linear-gradient(to right, transparent, ${gradientFrom}, ${gradientTo})`,
          offsetPath: `rect(0px auto auto 0px round ${borderRadius}px)`,
          animation: `border-glow-travel ${duration}s linear infinite`,
          transition: 'filter 0.3s ease, width 0.3s ease',
        }}
      />
    </div>
  );
}
