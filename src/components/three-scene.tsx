'use client';

/**
 * ThreeScene — Cinematic Particle Field Background
 *
 * Renders a full-screen Three.js canvas with:
 *   • ~2000 floating cyan particles that gently drift
 *   • A slowly rotating wireframe icosahedron at the centre
 *   • Mouse-driven parallax on the camera
 *   • Proper resize handling and full cleanup on unmount
 *
 * Uses **raw Three.js** only — no @react-three/fiber or @react-three/drei.
 */

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Number of particles in the field */
const PARTICLE_COUNT = 2000;

/** Spatial spread of the particle cloud along each axis */
const PARTICLE_SPREAD = 12;

/** Base size of each particle (PointsMaterial `size`) */
const PARTICLE_SIZE = 0.04;

/** Cyan colour used for particles & icosahedron wireframe */
const CYAN = 0x00d4ff;

/** Icosahedron geometry radius */
const ICO_RADIUS = 3;

/** Icosahedron geometry subdivision detail */
const ICO_DETAIL = 1;

/** How strongly the mouse position offsets the camera (parallax strength) */
const PARALLAX_STRENGTH = 0.4;

/** Damping factor for smooth camera interpolation (0–1, lower = smoother) */
const CAMERA_LERP = 0.05;

/** Default camera Z distance */
const CAMERA_Z = 8;

// ---------------------------------------------------------------------------
// Helper: build the particle field
// ---------------------------------------------------------------------------

interface ParticleField {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  /** Per-particle velocity stored as a Float32Array for animation */
  velocities: Float32Array;
}

/**
 * Creates a Points object representing the floating particle field.
 * Each particle is assigned a random position inside a cube and a slow
 * random velocity so it can drift over time.
 */
function createParticleField(): ParticleField {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Random position within the spread cube, centred at origin
    positions[i3] = (Math.random() - 0.5) * PARTICLE_SPREAD;
    positions[i3 + 1] = (Math.random() - 0.5) * PARTICLE_SPREAD;
    positions[i3 + 2] = (Math.random() - 0.5) * PARTICLE_SPREAD;

    // Gentle random velocity for drifting
    velocities[i3] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.003;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: CYAN,
    size: PARTICLE_SIZE,
    sizeAttenuation: true, // particles shrink with distance
    transparent: true,
    opacity: 0.8,
    depthWrite: false, // avoid z-fighting with icosahedron
  });

  const points = new THREE.Points(geometry, material);

  return { points, geometry, material, velocities };
}

// ---------------------------------------------------------------------------
// Helper: build the wireframe icosahedron
// ---------------------------------------------------------------------------

interface WireframeIco {
  mesh: THREE.LineSegments;
  geometry: THREE.IcosahedronGeometry;
  material: THREE.LineBasicMaterial;
}

/**
 * Creates a wireframe icosahedron using EdgesGeometry + LineSegments
 * so it renders as clean edges rather than filled faces.
 */
function createWireframeIco(): WireframeIco {
  const geometry = new THREE.IcosahedronGeometry(ICO_RADIUS, ICO_DETAIL);
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color: CYAN,
    transparent: true,
    opacity: 0.35,
  });
  const mesh = new THREE.LineSegments(edgesGeometry, material);

  return { mesh, geometry, material };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ThreeScene renders a cinematic Three.js particle field background.
 *
 * It fills its parent container (position absolute, inset-0) and renders
 * behind other content (z-0). No props are accepted.
 */
export default function ThreeScene(): JSX.Element {
  /** Ref for the container div so we can attach the renderer's DOM element */
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * We store mutable Three.js objects in a ref so they persist across
   * renders without causing re-renders themselves.
   */
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    particleField: ParticleField | null;
    icosahedron: WireframeIco | null;
    animationFrameId: number | null;
    /** Normalised mouse position (−1 → +1) for parallax */
    mouse: { x: number; y: number };
  }>({
    renderer: null,
    scene: null,
    camera: null,
    particleField: null,
    icosahedron: null,
    animationFrameId: null,
    mouse: { x: 0, y: 0 },
  });

  // -----------------------------------------------------------------------
  // Mouse move handler (registered once)
  // -----------------------------------------------------------------------

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    // Map pointer coords to normalised device coords (−1 → +1)
    stateRef.current.mouse.x = (event.clientX / innerWidth) * 2 - 1;
    stateRef.current.mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  }, []);

  // -----------------------------------------------------------------------
  // Window resize handler (registered once)
  // -----------------------------------------------------------------------

  const handleResize = useCallback(() => {
    const { renderer, camera } = stateRef.current;
    if (!renderer || !camera) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update camera aspect ratio & projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Resize the renderer's drawing buffer
    renderer.setSize(width, height);
  }, []);

  // -----------------------------------------------------------------------
  // Main effect: initialise scene, start animation loop, handle cleanup
  // -----------------------------------------------------------------------

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---- Renderer ----
    const renderer = new THREE.WebGLRenderer({
      alpha: true, // transparent background so page bg shows through
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // crisp on HiDPI
    container.appendChild(renderer.domElement);
    stateRef.current.renderer = renderer;

    // ---- Scene ----
    const scene = new THREE.Scene();
    stateRef.current.scene = scene;

    // ---- Camera ----
    const camera = new THREE.PerspectiveCamera(
      60, // FOV
      window.innerWidth / window.innerHeight, // aspect
      0.1, // near
      1000, // far
    );
    camera.position.z = CAMERA_Z;
    stateRef.current.camera = camera;

    // ---- Particle field ----
    const particleField = createParticleField();
    scene.add(particleField.points);
    stateRef.current.particleField = particleField;

    // ---- Wireframe icosahedron ----
    const icosahedron = createWireframeIco();
    scene.add(icosahedron.mesh);
    stateRef.current.icosahedron = icosahedron;

    // ---- Event listeners ----
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // ---- Animation loop ----
    const clock = new THREE.Clock();

    const animate = (): void => {
      stateRef.current.animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // -- Animate particles: drift & wrap around --
      const posAttr = particleField.geometry.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const velArray = particleField.velocities;
      const half = PARTICLE_SPREAD / 2;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // Apply velocity
        posArray[i3] += velArray[i3];
        posArray[i3 + 1] += velArray[i3 + 1];
        posArray[i3 + 2] += velArray[i3 + 2];

        // Wrap around if a particle leaves the spread cube
        if (posArray[i3] > half) posArray[i3] = -half;
        else if (posArray[i3] < -half) posArray[i3] = half;
        if (posArray[i3 + 1] > half) posArray[i3 + 1] = -half;
        else if (posArray[i3 + 1] < -half) posArray[i3 + 1] = half;
        if (posArray[i3 + 2] > half) posArray[i3 + 2] = -half;
        else if (posArray[i3 + 2] < -half) posArray[i3 + 2] = half;
      }
      posAttr.needsUpdate = true;

      // -- Animate icosahedron: slow rotation --
      icosahedron.mesh.rotation.x = elapsed * 0.15;
      icosahedron.mesh.rotation.y = elapsed * 0.2;

      // -- Camera parallax: smoothly follow mouse --
      const targetX = stateRef.current.mouse.x * PARALLAX_STRENGTH;
      const targetY = stateRef.current.mouse.y * PARALLAX_STRENGTH;
      camera.position.x += (targetX - camera.position.x) * CAMERA_LERP;
      camera.position.y += (targetY - camera.position.y) * CAMERA_LERP;
      camera.lookAt(scene.position); // always look at centre

      // -- Render --
      renderer.render(scene, camera);
    };

    animate();

    // ---- Cleanup on unmount ----
    return () => {
      // Stop the animation loop
      if (stateRef.current.animationFrameId !== null) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
        stateRef.current.animationFrameId = null;
      }

      // Remove event listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose particle field resources
      particleField.geometry.dispose();
      particleField.material.dispose();

      // Dispose icosahedron resources
      icosahedron.geometry.dispose();
      icosahedron.material.dispose();

      // Dispose renderer & remove canvas from DOM
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Nullify refs to allow GC
      stateRef.current.renderer = null;
      stateRef.current.scene = null;
      stateRef.current.camera = null;
      stateRef.current.particleField = null;
      stateRef.current.icosahedron = null;
    };
  }, [handleMouseMove, handleResize]); // stable callbacks — effect runs once

  // -----------------------------------------------------------------------
  // Render: a full-bleed container that holds the Three.js canvas
  // -----------------------------------------------------------------------

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      aria-hidden="true" // decorative — hidden from assistive tech
    />
  );
}
