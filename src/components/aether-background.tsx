'use client';

/**
 * AetherBackground — Gravity Manipulation Particle System
 *
 * A multi-state physics-based Three.js particle background:
 *
 *   **Idle State:** Particles drift upward slowly in a soft 'Aether' flow
 *   with sine-wave horizontal oscillation (lazy swirl).
 *
 *   **Gathering State (Mousedown/Touchstart):**
 *   A strong "Attraction Force" at the cursor pulls nearby particles inward.
 *   Converging particles grow in size and brightness, creating a glowing
 *   energy core at the click point.
 *
 *   **Dropping State (Mouseup/Touchend):**
 *   Attraction vanishes instantly. Captured particles receive a downward
 *   gravity force and fall like "magical rain" with slight acceleration.
 *   Once they exit the viewport bottom, they gracefully fade back into
 *   the Idle State at their original positions.
 *
 * Technical:
 *   • 5000 particles via single BufferGeometry + PointsMaterial draw call
 *   • Custom attributes: velocity, acceleration, originalPosition
 *   • Vector3 math for smooth organic attraction
 *   • AdditiveBlending for ethereal glow
 *   • GPU-friendly: only position + color buffers updated per frame
 */

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Number of aether particles — single draw call */
const PARTICLE_COUNT = 2500;

/** Spatial spread of the particle cloud */
const PARTICLE_SPREAD_X = 30;
const PARTICLE_SPREAD_Y = 25;
const PARTICLE_SPREAD_Z = 15;

/** Base size of each particle (idle) */
const PARTICLE_SIZE_IDLE = 0.08;

/** Max size of a particle when fully gathered */
const PARTICLE_SIZE_GATHERED = 0.22;

/** How fast particles drift upward in idle state */
const DRIFT_SPEED = 0.006;

/** Amplitude of the sine-wave horizontal oscillation */
const SWAY_AMPLITUDE = 0.3;

/** Frequency of the sine-wave oscillation (cycles per second) */
const SWAY_FREQUENCY = 0.4;

/** Mouse hover influence radius (world units) — subtle repel */
const MOUSE_INFLUENCE_RADIUS = 4.0;

/** How strongly particles are repelled by the cursor (idle hover) */
const MOUSE_REPEL_STRENGTH = 0.08;

/** How much brighter particles glow near the cursor (idle hover) */
const MOUSE_GLOW_BOOST = 2.5;

/** Camera Z distance */
const CAMERA_Z = 12;

/** Camera parallax strength */
const PARALLAX_STRENGTH = 0.3;

/** Camera lerp for smooth movement */
const CAMERA_LERP = 0.04;

// ─── Gathering State Constants ──────────────────────────────────────────────

/** Radius of the attraction force (world units) */
const ATTRACTION_RADIUS = 4.0;

/** How strongly particles are pulled toward the cursor */
const ATTRACTION_STRENGTH = 0.12;

/** Maximum speed a particle can reach while gathering (prevents overshoot) */
const ATTRACTION_MAX_SPEED = 0.35;

/** Damping applied to velocity each frame during gathering (settling) */
const GATHERING_DAMPING = 0.92;

/** Size interpolation speed when growing during gathering */
const SIZE_GROW_SPEED = 0.08;

// ─── Dropping State Constants ───────────────────────────────────────────────

/** Downward acceleration (simulated gravity) */
const GRAVITY_CONSTANT = 0.015;

/** Initial downward velocity when dropping begins */
const DROP_INITIAL_VELOCITY = 0.08;

/** Horizontal drift randomness during fall */
const DROP_HORIZONTAL_DRIFT = 0.003;

/** Velocity damping during drop (air resistance) */
const DROP_DAMPING = 0.998;

/** Size shrink speed during drop */
const SIZE_SHRINK_SPEED = 0.04;

/** How far below the viewport bottom a particle must go before resetting */
const RESET_BELOW_Y = -7;

/** Fade-out speed for particles falling below the viewport */
const FADE_SPEED = 0.08;

// ─── Restoration Constants ──────────────────────────────────────────────────

/** How quickly a particle lerps back to its original position after reset */
const RESTORE_LERP_SPEED = 0.25;

/** How quickly the particle fades back in after reset */
const FADE_IN_SPEED = 0.15;

// ─── Color Palette ──────────────────────────────────────────────────────────

/** Idle palette: cyan, amethyst, soft blue, teal, purple */
const AETHER_COLORS = [
  new THREE.Color(0x00d4ff), // Electric Cyan
  new THREE.Color(0x7b61ff), // Amethyst
  new THREE.Color(0x4488ff), // Soft Blue
  new THREE.Color(0x00ffcc), // Teal mana
  new THREE.Color(0xcc66ff), // Purple mana
];

/** Gathering palette: intense energy colors near the core */
const GATHERING_COLORS = [
  new THREE.Color(0x00ffff), // Pure Cyan (intense)
  new THREE.Color(0xffffff), // White-hot core
  new THREE.Color(0x00e5ff), // Bright Cyan
  new THREE.Color(0x88ffff), // Light Cyan
  new THREE.Color(0xaaffff), // Pale Cyan
];

// ---------------------------------------------------------------------------
// Particle State Enum
// ---------------------------------------------------------------------------

enum ParticleState {
  IDLE = 0,
  GATHERING = 1,
  DROPPING = 2,
  RESETTING = 3,
}

// ---------------------------------------------------------------------------
// AetherBackground Class
// ---------------------------------------------------------------------------

class AetherBackground {
  // ─── Three.js Core ──────────────────────────────────────────────────────
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private animationFrameId: number | null = null;
  private clock: THREE.Clock;
  private container: HTMLDivElement;

  // ─── Particle System ────────────────────────────────────────────────────
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;

  // ─── Per-Particle Data (Float32Arrays for GPU upload) ───────────────────
  private positions: Float32Array;
  private colors: Float32Array;
  private originalPositions: Float32Array;  // Where particles respawn
  private baseColors: Float32Array;         // Original idle colors
  private velocities: Float32Array;         // vx, vy, vz per particle
  private accelerations: Float32Array;      // ax, ay, az per particle
  private phases: Float32Array;             // Sine-wave phase offset
  private speeds: Float32Array;             // Per-particle speed multiplier
  private sizes: Float32Array;              // Per-particle current size
  private alphas: Float32Array;             // Per-particle opacity
  private states: Uint8Array;               // ParticleState per particle
  private gatheringInfluence: Float32Array; // 0..1 how much particle is gathered

  // ─── Interaction State ──────────────────────────────────────────────────
  private mouseNDC: { x: number; y: number } = { x: 0, y: 0 };
  private mouseWorld: THREE.Vector3;
  private isGathering: boolean = false;
  private attractionPoint: THREE.Vector3;
  private raycaster: THREE.Raycaster;
  private interactionPlane: THREE.Plane;

  // ─── Temp Vectors (reused each frame to avoid GC) ──────────────────────
  private _tempVec3: THREE.Vector3;
  private _attractionDir: THREE.Vector3;
  private isPaused: boolean = false;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.mouseWorld = new THREE.Vector3(0, 0, 0);
    this.attractionPoint = new THREE.Vector3(0, 0, 0);
    this._tempVec3 = new THREE.Vector3();
    this._attractionDir = new THREE.Vector3();

    // ---- Renderer ----
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Performance: disable for 5k particles
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

    // ---- Raycaster (for mouse → world coordinate mapping) ----
    this.raycaster = new THREE.Raycaster();
    this.interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // ---- Allocate per-particle buffers ----
    this.positions = new Float32Array(PARTICLE_COUNT * 3);
    this.colors = new Float32Array(PARTICLE_COUNT * 3);
    this.originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    this.baseColors = new Float32Array(PARTICLE_COUNT * 3);
    this.velocities = new Float32Array(PARTICLE_COUNT * 3);
    this.accelerations = new Float32Array(PARTICLE_COUNT * 3);
    this.phases = new Float32Array(PARTICLE_COUNT);
    this.speeds = new Float32Array(PARTICLE_COUNT);
    this.sizes = new Float32Array(PARTICLE_COUNT);
    this.alphas = new Float32Array(PARTICLE_COUNT);
    this.states = new Uint8Array(PARTICLE_COUNT);
    this.gatheringInfluence = new Float32Array(PARTICLE_COUNT);

    this.initializeParticles();

    // ---- Build geometry with custom attributes ----
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    this.material = new THREE.PointsMaterial({
      size: PARTICLE_SIZE_IDLE,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);

    // ---- Start animation loop ----
    this.animate();
  }

  // ─── Initialization ─────────────────────────────────────────────────────

  /** Initialize all particle positions, colors, and per-particle attributes */
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

      // Store original positions for respawn reference
      this.originalPositions[i3] = x;
      this.originalPositions[i3 + 1] = y;
      this.originalPositions[i3 + 2] = z;

      // Random color from the aether palette
      const color = AETHER_COLORS[Math.floor(Math.random() * AETHER_COLORS.length)];
      this.colors[i3] = color.r;
      this.colors[i3 + 1] = color.g;
      this.colors[i3 + 2] = color.b;

      // Store base color for restoration
      this.baseColors[i3] = color.r;
      this.baseColors[i3 + 1] = color.g;
      this.baseColors[i3 + 2] = color.b;

      // Random phase offset for sine-wave oscillation
      this.phases[i] = Math.random() * Math.PI * 2;

      // Per-particle speed variation (0.5× to 1.5×)
      this.speeds[i] = 0.5 + Math.random() * 1.0;

      // Start at idle size
      this.sizes[i] = PARTICLE_SIZE_IDLE;

      // Start fully visible
      this.alphas[i] = 1.0;

      // All particles start in idle state
      this.states[i] = ParticleState.IDLE;

      // No initial velocity or acceleration
      this.velocities[i3] = 0;
      this.velocities[i3 + 1] = 0;
      this.velocities[i3 + 2] = 0;
      this.accelerations[i3] = 0;
      this.accelerations[i3 + 1] = 0;
      this.accelerations[i3 + 2] = 0;

      // No gathering influence
      this.gatheringInfluence[i] = 0;
    }
  }

  // ─── Mouse Position Update ──────────────────────────────────────────────

  /** Update mouse position (called from the React component on mousemove) */
  setMouse(ndcX: number, ndcY: number): void {
    this.mouseNDC.x = ndcX;
    this.mouseNDC.y = ndcY;

    // Convert NDC to approximate world position for idle hover interaction
    this.mouseWorld.set(
      ndcX * (PARTICLE_SPREAD_X / 2) * 0.5,
      ndcY * (PARTICLE_SPREAD_Y / 2) * 0.5,
      0,
    );

    // If currently gathering, update the attraction point to follow cursor
    if (this.isGathering) {
      this.updateAttractionPointFromNDC(ndcX, ndcY);
    }
  }

  // ─── Gathering State: Begin (mousedown / touchstart) ─────────────────────

  /**
   * Begin the Gathering State — create a strong attraction force at the
   * cursor position. All particles within ATTRACTION_RADIUS accelerate
   * toward the cursor. Their size and brightness increase as they converge.
   */
  beginGathering(clientX: number, clientY: number): void {
    this.isGathering = true;

    // Convert screen coords to NDC
    const ndcX = (clientX / window.innerWidth) * 2 - 1;
    const ndcY = -(clientY / window.innerHeight) * 2 + 1;

    this.updateAttractionPointFromNDC(ndcX, ndcY);

    // Transition all IDLE particles within radius to GATHERING state
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (this.states[i] === ParticleState.IDLE) {
        const i3 = i * 3;
        const dx = this.positions[i3] - this.attractionPoint.x;
        const dy = this.positions[i3 + 1] - this.attractionPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ATTRACTION_RADIUS) {
          this.states[i] = ParticleState.GATHERING;
          // Reset acceleration for gathering
          this.accelerations[i3] = 0;
          this.accelerations[i3 + 1] = 0;
          this.accelerations[i3 + 2] = 0;
        }
      }
    }
  }

  // ─── Dropping State: Begin (mouseup / touchend) ──────────────────────────

  /**
   * Release the gathered particles — the attraction force vanishes instantly.
   * All GATHERING particles transition to DROPPING state with a downward
   * gravity force. They fall like "magical rain."
   */
  beginDropping(): void {
    this.isGathering = false;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (this.states[i] === ParticleState.GATHERING) {
        this.states[i] = ParticleState.DROPPING;

        const i3 = i * 3;

        // Set downward acceleration (gravity)
        this.accelerations[i3] = (Math.random() - 0.5) * DROP_HORIZONTAL_DRIFT;
        this.accelerations[i3 + 1] = -GRAVITY_CONSTANT;
        this.accelerations[i3 + 2] = 0;

        // Add initial downward velocity
        this.velocities[i3 + 1] = -DROP_INITIAL_VELOCITY;

        // Add slight random horizontal drift for natural "rain" feel
        this.velocities[i3] += (Math.random() - 0.5) * 0.02;
      }
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  /** Convert NDC coordinates to a world-space point on the z=0 plane */
  private updateAttractionPointFromNDC(ndcX: number, ndcY: number): void {
    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);

    const intersectPoint = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(this.interactionPlane, intersectPoint);

    if (hit) {
      this.attractionPoint.copy(intersectPoint);
    }
  }

  /** Linear interpolation helper */
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  /** Clamp helper */
  private clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }

  // ─── Main Animation Loop ────────────────────────────────────────────────

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();
    const halfY = PARTICLE_SPREAD_Y / 2;

    // Access buffers directly for performance
    const posAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = this.geometry.getAttribute('color') as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const colorArray = colorAttr.array as Float32Array;

    // ── If gathering, also pull in newly-in-range IDLE particles ──────────
    if (this.isGathering) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (this.states[i] === ParticleState.IDLE) {
          const i3 = i * 3;
          const dx = this.positions[i3] - this.attractionPoint.x;
          const dy = this.positions[i3 + 1] - this.attractionPoint.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < ATTRACTION_RADIUS) {
            this.states[i] = ParticleState.GATHERING;
            this.accelerations[i3] = 0;
            this.accelerations[i3 + 1] = 0;
            this.accelerations[i3 + 2] = 0;
          }
        }
      }
    }

    // ── Update each particle based on its state ───────────────────────────
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const speed = this.speeds[i];
      const phase = this.phases[i];
      const state = this.states[i] as ParticleState;

      switch (state) {
        // ──────────────────────────────────────────────────────────────────
        // IDLE STATE: Lazy swirl + drift upward + mouse hover repel
        // ──────────────────────────────────────────────────────────────────
        case ParticleState.IDLE: {
          // Drift the original position upward
          this.originalPositions[i3 + 1] += DRIFT_SPEED * speed;

          // Wrap around vertically
          if (this.originalPositions[i3 + 1] > halfY) {
            this.originalPositions[i3 + 1] = -halfY;
            this.originalPositions[i3] = (Math.random() - 0.5) * PARTICLE_SPREAD_X;
          }

          // Sine-wave horizontal oscillation (lazy swirl)
          const swayX = Math.sin(elapsed * SWAY_FREQUENCY * speed + phase) * SWAY_AMPLITUDE;
          const swayZ = Math.cos(elapsed * SWAY_FREQUENCY * speed * 0.7 + phase) * SWAY_AMPLITUDE * 0.5;

          let finalX = this.originalPositions[i3] + swayX;
          let finalY = this.originalPositions[i3 + 1];
          let finalZ = this.originalPositions[i3 + 2] + swayZ;

          // Mouse hover: gentle repel & glow (idle only)
          const dx = finalX - this.mouseWorld.x;
          const dy = finalY - this.mouseWorld.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let glowFactor = 1.0;

          if (dist < MOUSE_INFLUENCE_RADIUS && !this.isGathering) {
            const influence = 1.0 - dist / MOUSE_INFLUENCE_RADIUS;
            const repelForce = influence * influence * MOUSE_REPEL_STRENGTH;
            const angle = Math.atan2(dy, dx);
            finalX += Math.cos(angle) * repelForce * 10;
            finalY += Math.sin(angle) * repelForce * 10;
            glowFactor = 1.0 + influence * MOUSE_GLOW_BOOST;
          }

          posArray[i3] = finalX;
          posArray[i3 + 1] = finalY;
          posArray[i3 + 2] = finalZ;

          // Color: base color × glow factor
          const baseR = this.baseColors[i3];
          const baseG = this.baseColors[i3 + 1];
          const baseB = this.baseColors[i3 + 2];
          colorArray[i3] = Math.min(baseR * glowFactor, 1.0);
          colorArray[i3 + 1] = Math.min(baseG * glowFactor, 1.0);
          colorArray[i3 + 2] = Math.min(baseB * glowFactor, 1.0);

          // Size: idle
          this.sizes[i] = this.lerp(this.sizes[i], PARTICLE_SIZE_IDLE, 0.05);

          // Alpha: fully visible
          this.alphas[i] = this.lerp(this.alphas[i], 1.0, FADE_IN_SPEED);

          // Gathering influence decays
          this.gatheringInfluence[i] *= 0.95;
          break;
        }

        // ──────────────────────────────────────────────────────────────────
        // GATHERING STATE: Attraction toward cursor + size/brightness growth
        // ──────────────────────────────────────────────────────────────────
        case ParticleState.GATHERING: {
          // Compute direction from particle to attraction point
          this._attractionDir.set(
            this.attractionPoint.x - this.positions[i3],
            this.attractionPoint.y - this.positions[i3 + 1],
            this.attractionPoint.z - this.positions[i3 + 2],
          );

          const distToCore = this._attractionDir.length();

          // Normalize the direction vector
          if (distToCore > 0.01) {
            this._attractionDir.divideScalar(distToCore);
          } else {
            this._attractionDir.set(0, 0, 0);
          }

          // Attraction force: stronger when closer (quadratic falloff from edge)
          const influenceRadius = ATTRACTION_RADIUS;
          const normalizedDist = this.clamp(distToCore / influenceRadius, 0, 1);
          const attractionForce = ATTRACTION_STRENGTH * (1.0 - normalizedDist * normalizedDist);

          // Apply attraction as acceleration
          this.accelerations[i3] = this._attractionDir.x * attractionForce;
          this.accelerations[i3 + 1] = this._attractionDir.y * attractionForce;
          this.accelerations[i3 + 2] = this._attractionDir.z * attractionForce * 0.3;

          // Apply acceleration to velocity
          this.velocities[i3] += this.accelerations[i3];
          this.velocities[i3 + 1] += this.accelerations[i3 + 1];
          this.velocities[i3 + 2] += this.accelerations[i3 + 2];

          // Clamp velocity to max speed
          const velMag = Math.sqrt(
            this.velocities[i3] * this.velocities[i3] +
            this.velocities[i3 + 1] * this.velocities[i3 + 1] +
            this.velocities[i3 + 2] * this.velocities[i3 + 2],
          );

          if (velMag > ATTRACTION_MAX_SPEED) {
            const scale = ATTRACTION_MAX_SPEED / velMag;
            this.velocities[i3] *= scale;
            this.velocities[i3 + 1] *= scale;
            this.velocities[i3 + 2] *= scale;
          }

          // Apply velocity damping for settling
          this.velocities[i3] *= GATHERING_DAMPING;
          this.velocities[i3 + 1] *= GATHERING_DAMPING;
          this.velocities[i3 + 2] *= GATHERING_DAMPING;

          // Apply velocity to position
          posArray[i3] = this.positions[i3] + this.velocities[i3];
          posArray[i3 + 1] = this.positions[i3 + 1] + this.velocities[i3 + 1];
          posArray[i3 + 2] = this.positions[i3 + 2] + this.velocities[i3 + 2];

          // Update stored position
          this.positions[i3] = posArray[i3];
          this.positions[i3 + 1] = posArray[i3 + 1];
          this.positions[i3 + 2] = posArray[i3 + 2];

          // Gathering influence: stronger when closer to core
          const influence = this.clamp(1.0 - distToCore / ATTRACTION_RADIUS, 0, 1);
          this.gatheringInfluence[i] = this.lerp(
            this.gatheringInfluence[i],
            influence * influence,
            0.1,
          );

          // Size: grow toward gathered size based on influence
          const targetSize = this.lerp(PARTICLE_SIZE_IDLE, PARTICLE_SIZE_GATHERED, this.gatheringInfluence[i]);
          this.sizes[i] = this.lerp(this.sizes[i], targetSize, SIZE_GROW_SPEED);

          // Color: lerp toward gathering colors based on influence
          const gatheringColor = GATHERING_COLORS[i % GATHERING_COLORS.length];
          const gi = this.gatheringInfluence[i];
          colorArray[i3] = this.lerp(this.baseColors[i3], gatheringColor.r, gi);
          colorArray[i3 + 1] = this.lerp(this.baseColors[i3 + 1], gatheringColor.g, gi);
          colorArray[i3 + 2] = this.lerp(this.baseColors[i3 + 2], gatheringColor.b, gi);

          // Brightness boost near core
          const brightnessBoost = 1.0 + gi * 3.0;
          colorArray[i3] = Math.min(colorArray[i3] * brightnessBoost, 1.0);
          colorArray[i3 + 1] = Math.min(colorArray[i3 + 1] * brightnessBoost, 1.0);
          colorArray[i3 + 2] = Math.min(colorArray[i3 + 2] * brightnessBoost, 1.0);

          // Alpha: fully visible
          this.alphas[i] = this.lerp(this.alphas[i], 1.0, 0.1);
          break;
        }

        // ──────────────────────────────────────────────────────────────────
        // DROPPING STATE: Gravity pulls particles down like magical rain
        // ──────────────────────────────────────────────────────────────────
        case ParticleState.DROPPING: {
          // Apply gravity acceleration
          this.velocities[i3] += this.accelerations[i3];
          this.velocities[i3 + 1] += this.accelerations[i3 + 1];
          this.velocities[i3 + 2] += this.accelerations[i3 + 2];

          // Gradually increase gravity for acceleration feel
          this.accelerations[i3 + 1] -= GRAVITY_CONSTANT * 0.1;

          // Apply damping (air resistance)
          this.velocities[i3] *= DROP_DAMPING;
          this.velocities[i3 + 1] *= DROP_DAMPING;
          this.velocities[i3 + 2] *= DROP_DAMPING;

          // Apply velocity to position
          posArray[i3] = this.positions[i3] + this.velocities[i3];
          posArray[i3 + 1] = this.positions[i3 + 1] + this.velocities[i3 + 1];
          posArray[i3 + 2] = this.positions[i3 + 2] + this.velocities[i3 + 2];

          // Update stored position
          this.positions[i3] = posArray[i3];
          this.positions[i3 + 1] = posArray[i3 + 1];
          this.positions[i3 + 2] = posArray[i3 + 2];

          // Size: shrink during fall
          this.sizes[i] = this.lerp(this.sizes[i], PARTICLE_SIZE_IDLE * 0.6, SIZE_SHRINK_SPEED);

          // Color: restore toward base color during fall
          colorArray[i3] = this.lerp(colorArray[i3], this.baseColors[i3], 0.02);
          colorArray[i3 + 1] = this.lerp(colorArray[i3 + 1], this.baseColors[i3 + 1], 0.02);
          colorArray[i3 + 2] = this.lerp(colorArray[i3 + 2], this.baseColors[i3 + 2], 0.02);

          // Fade out as particle falls below viewport
          if (this.positions[i3 + 1] < -halfY) {
            this.alphas[i] -= FADE_SPEED;
          }

          // Transition to RESETTING when particle exits bottom
          if (this.positions[i3 + 1] < RESET_BELOW_Y || this.alphas[i] <= 0.05) {
            this.states[i] = ParticleState.RESETTING;

            // Reset to original position (above viewport for graceful entry)
            this.originalPositions[i3] = (Math.random() - 0.5) * PARTICLE_SPREAD_X;
            this.originalPositions[i3 + 1] = halfY + Math.random() * 2;
            this.originalPositions[i3 + 2] = (Math.random() - 0.5) * PARTICLE_SPREAD_Z;

            // Teleport to original position
            this.positions[i3] = this.originalPositions[i3];
            this.positions[i3 + 1] = this.originalPositions[i3 + 1];
            this.positions[i3 + 2] = this.originalPositions[i3 + 2];

            // Reset velocity
            this.velocities[i3] = 0;
            this.velocities[i3 + 1] = 0;
            this.velocities[i3 + 2] = 0;

            // Reset acceleration
            this.accelerations[i3] = 0;
            this.accelerations[i3 + 1] = 0;
            this.accelerations[i3 + 2] = 0;

            // Reset influence
            this.gatheringInfluence[i] = 0;

            // Start invisible — will fade in
            this.alphas[i] = 0;
          }
          break;
        }

        // ──────────────────────────────────────────────────────────────────
        // RESETTING STATE: Gracefully fade back into idle
        // ──────────────────────────────────────────────────────────────────
        case ParticleState.RESETTING: {
          // Fade in quickly
          this.alphas[i] += FADE_IN_SPEED;

          // Lerp position toward original (smooth arrival)
          this.positions[i3] = this.lerp(this.positions[i3], this.originalPositions[i3], RESTORE_LERP_SPEED);
          this.positions[i3 + 1] = this.lerp(this.positions[i3 + 1], this.originalPositions[i3 + 1], RESTORE_LERP_SPEED);
          this.positions[i3 + 2] = this.lerp(this.positions[i3 + 2], this.originalPositions[i3 + 2], RESTORE_LERP_SPEED);

          posArray[i3] = this.positions[i3];
          posArray[i3 + 1] = this.positions[i3 + 1];
          posArray[i3 + 2] = this.positions[i3 + 2];

          // Restore color
          colorArray[i3] = this.lerp(colorArray[i3], this.baseColors[i3], 0.2);
          colorArray[i3 + 1] = this.lerp(colorArray[i3 + 1], this.baseColors[i3 + 1], 0.2);
          colorArray[i3 + 2] = this.lerp(colorArray[i3 + 2], this.baseColors[i3 + 2], 0.2);

          // Restore size
          this.sizes[i] = this.lerp(this.sizes[i], PARTICLE_SIZE_IDLE, 0.2);

          // Transition to IDLE once mostly faded in
          if (this.alphas[i] >= 0.7) {
            this.alphas[i] = 1.0;
            this.states[i] = ParticleState.IDLE;
          }
          break;
        }
      }
    }

    // ── Update GPU buffers ─────────────────────────────────────────────────
    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    // ── Update material opacity based on global average (subtle) ───────────
    // For per-particle alpha we'd need a shader; instead we use size as proxy
    // and keep material opacity constant
    this.material.opacity = 0.85;

    // ── Camera parallax: smoothly follow mouse ────────────────────────────
    const targetX = this.mouseNDC.x * PARALLAX_STRENGTH;
    const targetY = this.mouseNDC.y * PARALLAX_STRENGTH;
    this.camera.position.x += (targetX - this.camera.position.x) * CAMERA_LERP;
    this.camera.position.y += (targetY - this.camera.position.y) * CAMERA_LERP;
    this.camera.lookAt(this.scene.position);

    // ── Render ─────────────────────────────────────────────────────────────
    this.renderer.render(this.scene, this.camera);
  };

  // ─── Resize Handler ─────────────────────────────────────────────────────

  /** Handle window resize */
  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // ─── Pause/Resume ─────────────────────────────────────────────────────

  pause(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isPaused = true;
  }

  resume(): void {
    if (this.animationFrameId === null && !this.isPaused) {
      this.animate();
    }
    this.isPaused = false;
  }

  // ─── Cleanup ─────────────────────────────────────────────────────────────

  /** Clean up all resources to prevent memory leaks */
  dispose(): void {
    this.pause();

    if (this.scene) {
      this.scene.clear();
    }
    if (this.points) {
      this.points.geometry?.dispose();
      this.points.material?.dispose();
    }
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();

    if (this.camera) {
      this.camera.dispose();
    }

    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

// ---------------------------------------------------------------------------
// React Component Wrapper
// ---------------------------------------------------------------------------

/**
 * AetherCanvas — React component that mounts the Gravity Manipulation
 * particle background.
 *
 * Renders a fixed, full-viewport canvas behind all page content.
 * Supports mouse and touch events for the Gathering/Dropping interaction.
 */
export default function AetherCanvas(): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const aetherRef = useRef<AetherBackground | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ─── Event Handlers ───────────────────────────────────────────────────

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!aetherRef.current) return;
    const ndcX = (event.clientX / window.innerWidth) * 2 - 1;
    const ndcY = -(event.clientY / window.innerHeight) * 2 + 1;
    aetherRef.current.setMouse(ndcX, ndcY);
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (!aetherRef.current) return;
    aetherRef.current.beginGathering(event.clientX, event.clientY);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!aetherRef.current) return;
    aetherRef.current.beginDropping();
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!aetherRef.current) return;
    const touch = event.touches[0];
    if (touch) {
      // Update mouse position first
      const ndcX = (touch.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(touch.clientY / window.innerHeight) * 2 + 1;
      aetherRef.current.setMouse(ndcX, ndcY);
      // Then begin gathering
      aetherRef.current.beginGathering(touch.clientX, touch.clientY);
    }
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!aetherRef.current) return;
    const touch = event.touches[0];
    if (touch) {
      const ndcX = (touch.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(touch.clientY / window.innerHeight) * 2 + 1;
      aetherRef.current.setMouse(ndcX, ndcY);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!aetherRef.current) return;
    aetherRef.current.beginDropping();
  }, []);

  const handleResize = useCallback(() => {
    if (!aetherRef.current) return;
    aetherRef.current.resize(window.innerWidth, window.innerHeight);
  }, []);

  // ─── Lifecycle ─────────────────────────────────────────────────────────

   useEffect(() => {
     const container = containerRef.current;
     if (!container) return;

     const aether = new AetherBackground(container);
     aetherRef.current = aether;

     // Viewport awareness: pause when off-screen
     observerRef.current = new IntersectionObserver(
       (entries) => {
         if (entries[0].isIntersecting) {
           aether.resume();
         } else {
           aether.pause();
         }
       },
       { threshold: 0.1, rootMargin: '50px' }
     );
     observerRef.current.observe(container);

     // Mouse events
     window.addEventListener('mousemove', handleMouseMove);
     window.addEventListener('mousedown', handleMouseDown);
     window.addEventListener('mouseup', handleMouseUp);

     // Touch events
     window.addEventListener('touchstart', handleTouchStart, { passive: true });
     window.addEventListener('touchmove', handleTouchMove, { passive: true });
     window.addEventListener('touchend', handleTouchEnd);

     // Resize
     window.addEventListener('resize', handleResize);

     return () => {
       if (observerRef.current) {
         observerRef.current.disconnect();
       }
       window.removeEventListener('mousemove', handleMouseMove);
       window.removeEventListener('mousedown', handleMouseDown);
       window.removeEventListener('mouseup', handleMouseUp);
       window.removeEventListener('touchstart', handleTouchStart);
       window.removeEventListener('touchmove', handleTouchMove);
       window.removeEventListener('touchend', handleTouchEnd);
       window.removeEventListener('resize', handleResize);

       aether.dispose();
       aetherRef.current = null;
     };
   }, [handleMouseMove, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd, handleResize]);

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
