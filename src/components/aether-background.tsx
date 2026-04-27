'use client';

/**
 * AetherBackground — Global Aether Flow Three.js Background
 *
 * An atmospheric Isekai-themed background with:
 *   • 5,000+ glowing "mana" particles (Aether) with lazy swirl movement
 *   • Particles drift upward with sine-wave horizontal oscillation
 *   • Mouse interaction: particles gently part ways and glow brighter near cursor
 *   • **Aether Ripple**: click/tap ignites a physics-based ripple —
 *     particles near the impact point burst outward in a concentric wave,
 *     shift to hot Cyan/Gold energy colors, then smoothly restore via GSAP
 *   • THREE.AdditiveBlending for ethereal glow effect
 *   • Wrapped in an AetherBackground class with dispose() for memory safety
 *   • Fixed canvas behind all content (z-index: -1)
 */

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Number of aether particles */
const PARTICLE_COUNT = 5000;

/** Spatial spread of the particle cloud */
const PARTICLE_SPREAD_X = 30;
const PARTICLE_SPREAD_Y = 25;
const PARTICLE_SPREAD_Z = 15;

/** Base size of each particle */
const PARTICLE_SIZE = 0.08;

/** How fast particles drift upward */
const DRIFT_SPEED = 0.006;

/** Amplitude of the sine-wave horizontal oscillation */
const SWAY_AMPLITUDE = 0.3;

/** Frequency of the sine-wave oscillation (cycles per second) */
const SWAY_FREQUENCY = 0.4;

/** Mouse interaction radius (in world units) */
const MOUSE_INFLUENCE_RADIUS = 4.0;

/** How strongly particles are repelled by the cursor */
const MOUSE_REPEL_STRENGTH = 0.08;

/** How much brighter particles glow near the cursor */
const MOUSE_GLOW_BOOST = 2.5;

/** Camera Z distance */
const CAMERA_Z = 12;

/** Camera parallax strength */
const PARALLAX_STRENGTH = 0.3;

/** Camera lerp for smooth movement */
const CAMERA_LERP = 0.04;

// ─── Aether Ripple Constants ────────────────────────────────────────────────

/** Radius of the click impact zone (world units) */
const RIPPLE_RADIUS = 5.0;

/** Strength of the repulsive force applied on click */
const RIPPLE_FORCE = 0.6;

/** How fast velocity decays each frame (friction) */
const VELOCITY_DAMPING = 0.96;

/** Duration (seconds) for GSAP to restore particles after release */
const RESTORE_DURATION = 1.5;

/** Color palette: cyan, amethyst, soft blue (idle twilight) */
const AETHER_COLORS = [
  new THREE.Color(0x00d4ff), // Electric Cyan
  new THREE.Color(0x7b61ff), // Amethyst
  new THREE.Color(0x4488ff), // Soft Blue
  new THREE.Color(0x00ffcc), // Teal mana
  new THREE.Color(0xcc66ff), // Purple mana
];

/** Hot energy colors for the ripple ignition */
const RIPPLE_COLORS = [
  new THREE.Color(0x00ffff), // Pure Cyan (intense)
  new THREE.Color(0xffd700), // Gold
  new THREE.Color(0x00e5ff), // Bright Cyan
  new THREE.Color(0xffaa00), // Amber Gold
  new THREE.Color(0x88ffff), // Light Cyan
];

// ---------------------------------------------------------------------------
// AetherBackground Class
// ---------------------------------------------------------------------------

class AetherBackground {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private animationFrameId: number | null = null;
  private clock: THREE.Clock;
  private mouse: THREE.Vector2;
  private mouseWorld: THREE.Vector3;
  private container: HTMLDivElement;

  // Particle system
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;

  // Per-particle data
  private positions: Float32Array;
  private colors: Float32Array;
  private basePositions: Float32Array;
  private baseColors: Float32Array;     // Original idle colors (for restoration)
  private phases: Float32Array;
  private speeds: Float32Array;
  private sizes: Float32Array;
  private velocities: Float32Array;     // Per-particle velocity (for ripple physics)
  private activations: Float32Array;    // Per-particle activation level 0..1 (for color lerp)

  // Mouse tracking (NDC)
  private mouseNDC: { x: number; y: number } = { x: 0, y: 0 };

  // ─── Aether Ripple state ──────────────────────────────────────────────
  private raycaster: THREE.Raycaster;
  private ripplePlane: THREE.Plane;       // Invisible plane at z=0 for raycasting
  private isMouseDown: boolean = false;
  private impactPoint: THREE.Vector3;
  private restoreTimeline: gsap.core.Timeline | null = null;
  /** Global restore progress: 0 = fully activated, 1 = fully restored to idle */
  private restoreProgress: number = 1.0;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseWorld = new THREE.Vector3(0, 0, 0);
    this.impactPoint = new THREE.Vector3(0, 0, 0);

    // ---- Renderer ----
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // ---- Scene ----
    this.scene = new THREE.Scene();

    // ---- Camera ----
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.z = CAMERA_Z;

    // ---- Raycaster setup ----
    this.raycaster = new THREE.Raycaster();
    this.ripplePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z=0 plane

    // ---- Particle system ----
    this.positions = new Float32Array(PARTICLE_COUNT * 3);
    this.colors = new Float32Array(PARTICLE_COUNT * 3);
    this.basePositions = new Float32Array(PARTICLE_COUNT * 3);
    this.baseColors = new Float32Array(PARTICLE_COUNT * 3);
    this.phases = new Float32Array(PARTICLE_COUNT);
    this.speeds = new Float32Array(PARTICLE_COUNT);
    this.sizes = new Float32Array(PARTICLE_COUNT);
    this.velocities = new Float32Array(PARTICLE_COUNT * 3); // vx, vy, vz
    this.activations = new Float32Array(PARTICLE_COUNT);

    this.initializeParticles();

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    this.material = new THREE.PointsMaterial({
      size: PARTICLE_SIZE,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);

    // ---- Start animation ----
    this.animate();
  }

  /** Initialize particle positions, colors, and per-particle attributes */
  private initializeParticles(): void {
    const halfX = PARTICLE_SPREAD_X / 2;
    const halfY = PARTICLE_SPREAD_Y / 2;
    const halfZ = PARTICLE_SPREAD_Z / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Random position in the volume
      const x = (Math.random() - 0.5) * PARTICLE_SPREAD_X;
      const y = (Math.random() - 0.5) * PARTICLE_SPREAD_Y;
      const z = (Math.random() - 0.5) * PARTICLE_SPREAD_Z;

      this.positions[i3] = x;
      this.positions[i3 + 1] = y;
      this.positions[i3 + 2] = z;

      // Store base positions for oscillation reference
      this.basePositions[i3] = x;
      this.basePositions[i3 + 1] = y;
      this.basePositions[i3 + 2] = z;

      // Random color from the aether palette
      const color = AETHER_COLORS[Math.floor(Math.random() * AETHER_COLORS.length)];
      this.colors[i3] = color.r;
      this.colors[i3 + 1] = color.g;
      this.colors[i3 + 2] = color.b;

      // Store base color for restoration after ripple
      this.baseColors[i3] = color.r;
      this.baseColors[i3 + 1] = color.g;
      this.baseColors[i3 + 2] = color.b;

      // Random phase offset for sine-wave oscillation
      this.phases[i] = Math.random() * Math.PI * 2;

      // Per-particle speed variation (0.5x to 1.5x)
      this.speeds[i] = 0.5 + Math.random() * 1.0;

      // Per-particle size variation
      this.sizes[i] = 0.5 + Math.random() * 1.0;

      // Initialize velocity to zero
      this.velocities[i3] = 0;
      this.velocities[i3 + 1] = 0;
      this.velocities[i3 + 2] = 0;

      // Initialize activation to zero (idle)
      this.activations[i] = 0;
    }
  }

  /** Update mouse position (called from the React component) */
  setMouse(ndcX: number, ndcY: number): void {
    this.mouseNDC.x = ndcX;
    this.mouseNDC.y = ndcY;

    // Convert NDC to approximate world position for particle interaction
    this.mouseWorld.set(
      ndcX * (PARTICLE_SPREAD_X / 2) * 0.5,
      ndcY * (PARTICLE_SPREAD_Y / 2) * 0.5,
      0,
    );
  }

  // ─── Aether Ripple: Ignite (mousedown / touchstart) ───────────────────

  /**
   * Trigger the Aether Ripple at the given screen coordinates.
   * Raycasts into the scene to find the 3D impact point, then
   * applies color shift + repulsive force to nearby particles.
   */
  igniteRipple(clientX: number, clientY: number): void {
    this.isMouseDown = true;

    // Kill any ongoing restore timeline
    if (this.restoreTimeline) {
      this.restoreTimeline.kill();
      this.restoreTimeline = null;
    }
    this.restoreProgress = 0;

    // Convert screen coords to NDC
    const ndcX = (clientX / window.innerWidth) * 2 - 1;
    const ndcY = -(clientY / window.innerHeight) * 2 + 1;

    // Set raycaster from camera
    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);

    // Raycast against the z=0 plane
    const intersectPoint = new THREE.Vector3();
    const ray = this.raycaster.ray;
    const hit = ray.intersectPlane(this.ripplePlane, intersectPoint);

    if (!hit) return;

    this.impactPoint.copy(intersectPoint);

    // ─── Apply physics to nearby particles ─────────────────────────────
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const px = this.positions[i3];
      const py = this.positions[i3 + 1];
      const pz = this.positions[i3 + 2];

      // Distance from impact point (2D on the z=0 plane)
      const dx = px - intersectPoint.x;
      const dy = py - intersectPoint.y;
      const dist2D = Math.sqrt(dx * dx + dy * dy);

      if (dist2D < RIPPLE_RADIUS) {
        // Activation: inversely proportional to distance (stronger at center)
        const influence = 1.0 - dist2D / RIPPLE_RADIUS;
        const activationStrength = influence * influence; // Quadratic falloff

        this.activations[i] = Math.min(1.0, this.activations[i] + activationStrength);

        // ─── Color Shift: Twilight → Hot Cyan/Gold ──────────────────────
        const rippleColor = RIPPLE_COLORS[i % RIPPLE_COLORS.length];
        this.colors[i3] = this.lerp(this.baseColors[i3], rippleColor.r, this.activations[i]);
        this.colors[i3 + 1] = this.lerp(this.baseColors[i3 + 1], rippleColor.g, this.activations[i]);
        this.colors[i3 + 2] = this.lerp(this.baseColors[i3 + 2], rippleColor.b, this.activations[i]);

        // ─── Repulsive Force: concentric outward burst ──────────────────
        const angle = Math.atan2(dy, dx);

        // Force magnitude: stronger near center, with quadratic falloff
        const forceMag = activationStrength * RIPPLE_FORCE;

        // Add a slight z-velocity for 3D depth in the ripple
        const zPush = (Math.random() - 0.5) * forceMag * 0.3;

        this.velocities[i3] += Math.cos(angle) * forceMag;
        this.velocities[i3 + 1] += Math.sin(angle) * forceMag;
        this.velocities[i3 + 2] += zPush;
      }
    }

    // Mark color buffer for GPU upload
    const colorAttr = this.geometry.getAttribute('color') as THREE.BufferAttribute;
    colorAttr.needsUpdate = true;
  }

  // ─── Aether Ripple: Release (mouseup / touchend) ─────────────────────

  /**
   * Release the ripple — use GSAP to smoothly restore all activated
   * particles back to their idle state over RESTORE_DURATION seconds.
   */
  releaseRipple(): void {
    this.isMouseDown = false;

    // If no particles are activated, nothing to restore
    let hasActivated = false;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (this.activations[i] > 0.01) {
        hasActivated = true;
        break;
      }
    }
    if (!hasActivated) return;

    // Kill previous timeline if running
    if (this.restoreTimeline) {
      this.restoreTimeline.kill();
    }

    // Capture current activation snapshot for GSAP tweening
    const snapshotActivations = new Float32Array(this.activations);

    this.restoreTimeline = gsap.timeline();

    // Tween restoreProgress from 0 to 1 — this drives the color restoration
    this.restoreTimeline.to(this, {
      restoreProgress: 1.0,
      duration: RESTORE_DURATION,
      ease: 'power2.out',
      onUpdate: () => {
        // Lerp each activated particle's color back to base
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          if (snapshotActivations[i] < 0.01) continue;
          const i3 = i * 3;

          // How much of the original activation remains
          const remainingActivation = snapshotActivations[i] * (1.0 - this.restoreProgress);
          this.activations[i] = remainingActivation;

          // Restore color: lerp from current hot color back to base
          const rippleColor = RIPPLE_COLORS[i % RIPPLE_COLORS.length];
          this.colors[i3] = this.lerp(this.baseColors[i3], rippleColor.r, remainingActivation);
          this.colors[i3 + 1] = this.lerp(this.baseColors[i3 + 1], rippleColor.g, remainingActivation);
          this.colors[i3 + 2] = this.lerp(this.baseColors[i3 + 2], rippleColor.b, remainingActivation);
        }
        const colorAttr = this.geometry.getAttribute('color') as THREE.BufferAttribute;
        colorAttr.needsUpdate = true;
      },
      onComplete: () => {
        // Ensure full restoration
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          this.activations[i] = 0;
          const i3 = i * 3;
          this.colors[i3] = this.baseColors[i3];
          this.colors[i3 + 1] = this.baseColors[i3 + 1];
          this.colors[i3 + 2] = this.baseColors[i3 + 2];
        }
        const colorAttr = this.geometry.getAttribute('color') as THREE.BufferAttribute;
        colorAttr.needsUpdate = true;
        this.restoreProgress = 1.0;
      },
    });

    // Also decelerate velocities via GSAP (additional smooth deceleration)
    // We create a proxy object to tween the damping factor
    const velProxy = { damping: VELOCITY_DAMPING };
    this.restoreTimeline.to(velProxy, {
      damping: 0.85, // Extra friction during restore
      duration: RESTORE_DURATION * 0.6,
      ease: 'power1.out',
    }, 0);
  }

  /** Linear interpolation helper */
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  /** Main animation loop */
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();

    // -- Update particles: lazy swirl + mouse interaction + ripple physics --
    const posAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = this.geometry.getAttribute('color') as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const colorArray = colorAttr.array as Float32Array;

    const halfY = PARTICLE_SPREAD_Y / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const speed = this.speeds[i];
      const phase = this.phases[i];

      // ---- Lazy swirl: drift upward + sine-wave horizontal oscillation ----
      this.basePositions[i3 + 1] += DRIFT_SPEED * speed;

      // Wrap around vertically
      if (this.basePositions[i3 + 1] > halfY) {
        this.basePositions[i3 + 1] = -halfY;
        this.basePositions[i3] = (Math.random() - 0.5) * PARTICLE_SPREAD_X;
      }

      // Sine-wave horizontal oscillation (lazy swirl)
      const swayX = Math.sin(elapsed * SWAY_FREQUENCY * speed + phase) * SWAY_AMPLITUDE;
      const swayZ = Math.cos(elapsed * SWAY_FREQUENCY * speed * 0.7 + phase) * SWAY_AMPLITUDE * 0.5;

      // Compute final position from base + sway
      let finalX = this.basePositions[i3] + swayX;
      let finalY = this.basePositions[i3 + 1];
      let finalZ = this.basePositions[i3 + 2] + swayZ;

      // ---- Mouse interaction: repel & glow ----
      const dx = finalX - this.mouseWorld.x;
      const dy = finalY - this.mouseWorld.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let glowFactor = 1.0;

      if (dist < MOUSE_INFLUENCE_RADIUS) {
        const influence = 1.0 - dist / MOUSE_INFLUENCE_RADIUS;
        const repelForce = influence * influence * MOUSE_REPEL_STRENGTH;
        const angle = Math.atan2(dy, dx);
        finalX += Math.cos(angle) * repelForce * 10;
        finalY += Math.sin(angle) * repelForce * 10;
        glowFactor = 1.0 + influence * MOUSE_GLOW_BOOST;
      }

      // ─── Aether Ripple: velocity physics ──────────────────────────────
      const vx = this.velocities[i3];
      const vy = this.velocities[i3 + 1];
      const vz = this.velocities[i3 + 2];

      // Apply velocity to position
      finalX += vx;
      finalY += vy;
      finalZ += vz;

      // Apply velocity damping (friction)
      this.velocities[i3] *= VELOCITY_DAMPING;
      this.velocities[i3 + 1] *= VELOCITY_DAMPING;
      this.velocities[i3 + 2] *= VELOCITY_DAMPING;

      // Also dampen the base position slightly so particles don't drift forever
      this.basePositions[i3] += vx * 0.15;
      this.basePositions[i3 + 1] += vy * 0.15;
      this.basePositions[i3 + 2] += vz * 0.15;

      // Kill tiny velocities to avoid floating-point drift
      if (Math.abs(this.velocities[i3]) < 0.0001) this.velocities[i3] = 0;
      if (Math.abs(this.velocities[i3 + 1]) < 0.0001) this.velocities[i3 + 1] = 0;
      if (Math.abs(this.velocities[i3 + 2]) < 0.0001) this.velocities[i3 + 2] = 0;

      posArray[i3] = finalX;
      posArray[i3 + 1] = finalY;
      posArray[i3 + 2] = finalZ;

      // Update color brightness based on glow factor (only for non-activated particles)
      const activation = this.activations[i];
      if (activation < 0.01) {
        // Idle: apply normal glow factor from mouse proximity
        const baseR = this.baseColors[i3];
        const baseG = this.baseColors[i3 + 1];
        const baseB = this.baseColors[i3 + 2];
        colorArray[i3] = Math.min(baseR * glowFactor, 1.0);
        colorArray[i3 + 1] = Math.min(baseG * glowFactor, 1.0);
        colorArray[i3 + 2] = Math.min(baseB * glowFactor, 1.0);
      } else {
        // Activated: add extra glow boost based on activation
        const extraGlow = 1.0 + activation * 3.0;
        colorArray[i3] = Math.min(this.colors[i3] * extraGlow, 1.0);
        colorArray[i3 + 1] = Math.min(this.colors[i3 + 1] * extraGlow, 1.0);
        colorArray[i3 + 2] = Math.min(this.colors[i3 + 2] * extraGlow, 1.0);
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    // -- Camera parallax: smoothly follow mouse --
    const targetX = this.mouseNDC.x * PARALLAX_STRENGTH;
    const targetY = this.mouseNDC.y * PARALLAX_STRENGTH;
    this.camera.position.x += (targetX - this.camera.position.x) * CAMERA_LERP;
    this.camera.position.y += (targetY - this.camera.position.y) * CAMERA_LERP;
    this.camera.lookAt(this.scene.position);

    // -- Render --
    this.renderer.render(this.scene, this.camera);
  };

  /** Handle window resize */
  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /** Clean up all resources to prevent memory leaks */
  dispose(): void {
    // Stop animation loop
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Kill GSAP timeline
    if (this.restoreTimeline) {
      this.restoreTimeline.kill();
      this.restoreTimeline = null;
    }

    // Dispose geometry and material
    this.geometry.dispose();
    this.material.dispose();

    // Dispose renderer and remove canvas from DOM
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

// ---------------------------------------------------------------------------
// React Component Wrapper
// ---------------------------------------------------------------------------

/**
 * AetherCanvas — React component that mounts the AetherBackground.
 *
 * Renders a fixed, full-viewport canvas behind all page content.
 * Supports mouse and touch events for the Aether Ripple interaction.
 * The AetherBackground class handles all Three.js logic and
 * provides a dispose() method for cleanup on unmount.
 */
export default function AetherCanvas(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const aetherRef = useRef<AetherBackground | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!aetherRef.current) return;
    const ndcX = (event.clientX / window.innerWidth) * 2 - 1;
    const ndcY = -(event.clientY / window.innerHeight) * 2 + 1;
    aetherRef.current.setMouse(ndcX, ndcY);
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (!aetherRef.current) return;
    aetherRef.current.igniteRipple(event.clientX, event.clientY);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!aetherRef.current) return;
    aetherRef.current.releaseRipple();
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!aetherRef.current) return;
    const touch = event.touches[0];
    if (touch) {
      aetherRef.current.igniteRipple(touch.clientX, touch.clientY);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!aetherRef.current) return;
    aetherRef.current.releaseRipple();
  }, []);

  const handleResize = useCallback(() => {
    if (!aetherRef.current) return;
    aetherRef.current.resize(window.innerWidth, window.innerHeight);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize the AetherBackground
    const aether = new AetherBackground(container);
    aetherRef.current = aether;

    // Register event listeners — mouse
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Register event listeners — touch
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Register event listeners — resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      // Clean up Three.js resources
      aether.dispose();
      aetherRef.current = null;
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchEnd, handleResize]);

  return (
    <div
      ref={containerRef}
      id="aether-canvas"
      className="fixed inset-0 z-[-1]"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    />
  );
}
