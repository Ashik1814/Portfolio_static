---
Task ID: 1
Agent: Main Agent
Task: Implement Global Aether Flow Three.js Background for Portfolio

Work Log:
- Read all existing files: three-scene.tsx, projects/page.tsx, skills/page.tsx, layout.tsx, page.tsx, globals.css, navbar.tsx, footer.tsx, about/page.tsx, contact/page.tsx
- Created new `src/components/aether-background.tsx` with AetherBackground class featuring:
  - 5000 particles using THREE.BufferGeometry with vertex colors
  - Lazy swirl movement: particles drift upward with sine-wave horizontal oscillation
  - Mouse interaction: particles repel from cursor and glow brighter near it
  - THREE.AdditiveBlending for ethereal glow effect
  - Color palette: Electric Cyan, Amethyst, Soft Blue, Teal mana, Purple mana
  - AetherBackground class with dispose() method for memory safety
  - React wrapper component AetherCanvas with fixed positioning (z-index: -1)
- Deleted old `src/components/three-scene.tsx` (replaced by aether-background.tsx)
- Updated `src/app/layout.tsx`:
  - Added AetherCanvas import and placed it globally before page content
  - Removed bg-[#050510] from body class
  - Added z-0 relative wrapper for content
- Updated `src/app/page.tsx`:
  - Removed ThreeScene import and hero background div
  - Hero section now works with global aether canvas
- Updated `src/app/globals.css`:
  - Changed .glass utility from blur(24px) to blur(15px) per spec
  - Applied twilight gradient (Midnight Blue → Amethyst) to body with background-attachment: fixed
  - Removed bg-background from body in @layer base, kept text-foreground
- Updated all detail pages to remove bg-[#050510] from main elements:
  - about/page.tsx, skills/page.tsx, projects/page.tsx, contact/page.tsx
- Ran lint: passed with no errors
- Tested all routes: /, /about, /skills, /projects, /contact all return 200
- Verified dev server compiles without errors

Stage Summary:
- AetherBackground class created with 5000+ particles, lazy swirl, mouse repulsion/glow, additive blending
- Twilight gradient (Midnight Blue → soft Amethyst) applied as CSS background behind canvas
- Canvas is fixed to viewport at z-index: -1, transparent (alpha: true) so gradient shows through
- All UI cards use glassmorphism (backdrop-blur + bg-white/5) so particles appear behind frosted glass
- Global canvas persists across page navigations (layout-level component)
- Proper cleanup via dispose() method prevents memory leaks
