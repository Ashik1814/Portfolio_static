'use client';

/**
 * AetherBackground — Global Aether Flow Three.js Background
 *
 * An atmospheric Isekai-themed background with:
 *   • 5,000+ glowing "mana" particles (Aether) with lazy swirl movement
 *   • Particles drift upward with sine-wave horizontal oscillation
 *   • Mouse interaction: particles gently part ways and glow brighter near cursor
 *   • THREE.AdditiveBlending for ethereal glow effect
 *   • Wrapped in an AetherBackground class with dispose() for memory safety
 *   • Fixed canvas behind all content (z-index: -1)
 *
 * The CSS twilight gradient (Midnight Blue → soft Amethyst) sits behind
 * this canvas, creating the atmospheric horizon effect.
 */

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

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

/** Color palette: cyan, amethyst, soft blue */
const AETHER_COLORS = [
  new THREE.Color(0x00d4ff), // Electric Cyan
  new THREE.Color(0x7b61ff), // Amethyst
  new THREE.Color(0x4488ff), // Soft Blue
  new THREE.Color(0x00ffcc), // Teal mana
  new THREE.Color(0xcc66ff), // Purple mana
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
  private basePositions: Float32Array; // Store original positions for oscillation
  private phases: Float32Array; // Random phase offset for each particle
  private speeds: Float32Array; // Per-particle speed variation
  private sizes: Float32Array; // Per-particle size variation

  // Mouse tracking (NDC)
  private mouseNDC: { x: number; y: number } = { x: 0, y: 0 };

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseWorld = new THREE.Vector3(0, 0, 0);

    // ---- Renderer ----
    this.renderer = new THREE.WebGLRenderer({
      alpha: true, // transparent so CSS gradient shows through
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

    // ---- Particle system ----
    this.positions = new Float32Array(PARTICLE_COUNT * 3);
    this.colors = new Float32Array(PARTICLE_COUNT * 3);
    this.basePositions = new Float32Array(PARTICLE_COUNT * 3);
    this.phases = new Float32Array(PARTICLE_COUNT);
    this.speeds = new Float32Array(PARTICLE_COUNT);
    this.sizes = new Float32Array(PARTICLE_COUNT);

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

      // Random phase offset for sine-wave oscillation
      this.phases[i] = Math.random() * Math.PI * 2;

      // Per-particle speed variation (0.5x to 1.5x)
      this.speeds[i] = 0.5 + Math.random() * 1.0;

      // Per-particle size variation
      this.sizes[i] = 0.5 + Math.random() * 1.0;
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

  /** Main animation loop */
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();

    // -- Update particles: lazy swirl + mouse interaction --
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
      // Drift upward
      this.basePositions[i3 + 1] += DRIFT_SPEED * speed;

      // Wrap around vertically (when particle goes above the spread, reset to bottom)
      if (this.basePositions[i3 + 1] > halfY) {
        this.basePositions[i3 + 1] = -halfY;
        // Randomize horizontal position on respawn for organic feel
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
        // Particles "part ways" — push away from cursor
        const influence = 1.0 - dist / MOUSE_INFLUENCE_RADIUS;
        const repelForce = influence * influence * MOUSE_REPEL_STRENGTH;
        const angle = Math.atan2(dy, dx);
        finalX += Math.cos(angle) * repelForce * 10;
        finalY += Math.sin(angle) * repelForce * 10;

        // Glow brighter near cursor
        glowFactor = 1.0 + influence * MOUSE_GLOW_BOOST;
      }

      posArray[i3] = finalX;
      posArray[i3 + 1] = finalY;
      posArray[i3 + 2] = finalZ;

      // Update color brightness based on glow factor
      const baseColor = AETHER_COLORS[i % AETHER_COLORS.length];
      colorArray[i3] = Math.min(baseColor.r * glowFactor, 1.0);
      colorArray[i3 + 1] = Math.min(baseColor.g * glowFactor, 1.0);
      colorArray[i3 + 2] = Math.min(baseColor.b * glowFactor, 1.0);
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

    // Register event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Clean up Three.js resources
      aether.dispose();
      aetherRef.current = null;
    };
  }, [handleMouseMove, handleResize]);

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
