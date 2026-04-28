'use client';

/**
 * WorldClock — A visually stunning analog + digital world clock
 *
 * Features:
 *   - SVG analog clock face with glowing cyan hands & tick marks
 *   - Digital time display with seconds
 *   - Day/Night indicator with emoji
 *   - Date display with day name
 *   - Timezone selector dropdown (default: Asia/Dhaka UTC+6)
 *   - Smooth second hand animation via requestAnimationFrame
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

// ─── Timezone Data ─────────────────────────────────────────────────────────

interface TimezoneOption {
  label: string;
  value: string;   // IANA timezone string
  city: string;    // Display city name
  offset: string;  // UTC offset label
}

const timezones: TimezoneOption[] = [
  { label: 'UTC+6 (BST)',  value: 'Asia/Dhaka',       city: 'Dhaka',     offset: 'UTC+6' },
  { label: 'UTC+5:30 (IST)', value: 'Asia/Kolkata',   city: 'Kolkata',   offset: 'UTC+5:30' },
  { label: 'UTC+8 (CST)',  value: 'Asia/Shanghai',    city: 'Shanghai',  offset: 'UTC+8' },
  { label: 'UTC+9 (JST)',  value: 'Asia/Tokyo',       city: 'Tokyo',     offset: 'UTC+9' },
  { label: 'UTC+0 (GMT)',  value: 'Europe/London',    city: 'London',    offset: 'UTC+0' },
  { label: 'UTC+1 (CET)',  value: 'Europe/Berlin',    city: 'Berlin',    offset: 'UTC+1' },
  { label: 'UTC-5 (EST)',  value: 'America/New_York',  city: 'New York', offset: 'UTC-5' },
  { label: 'UTC-8 (PST)',  value: 'America/Los_Angeles', city: 'Los Angeles', offset: 'UTC-8' },
  { label: 'UTC+10 (AEST)', value: 'Australia/Sydney', city: 'Sydney',   offset: 'UTC+10' },
  { label: 'UTC+3 (MSK)',  value: 'Europe/Moscow',    city: 'Moscow',    offset: 'UTC+3' },
  { label: 'UTC+7 (ICT)',  value: 'Asia/Bangkok',     city: 'Bangkok',   offset: 'UTC+7' },
  { label: 'UTC-6 (CST)',  value: 'America/Chicago',  city: 'Chicago',   offset: 'UTC-6' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTimeInZone(tz: string) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(now);

  const h = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10);
  const m = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0', 10);
  const s = parseInt(parts.find(p => p.type === 'second')?.value ?? '0', 10);
  return { h, m, s };
}

function getDateInZone(tz: string) {
  const now = new Date();
  const dayName = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'long',
  }).format(now);

  const dateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);

  return { dayName, dateStr };
}

function getGreeting(h: number): { text: string; emoji: string } {
  if (h >= 5 && h < 12)  return { text: 'Good Morning', emoji: '\u2600\uFE0F' };
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', emoji: '\uD83C\uDF24\uFE0F' };
  if (h >= 17 && h < 21) return { text: 'Good Evening', emoji: '\uD83C\uDF05' };
  return { text: 'Good Night', emoji: '\uD83C\uDF19' };
}

function isDaytime(h: number): boolean {
  return h >= 6 && h < 18;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function WorldClock() {
  const [selectedTz, setSelectedTz] = useState('Asia/Dhaka');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  const rafRef = useRef<number>(0);
  const dropRef = useRef<HTMLDivElement>(null);

  // Hydration-safe mount
  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  // RAF loop for smooth second hand
  useEffect(() => {
    let active = true;
    const loop = () => {
      if (!active) return;
      setTime(getTimeInZone(selectedTz));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [selectedTz]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-md mx-auto opacity-0">
        {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  const { h, m, s } = time;
  const { dayName, dateStr } = getDateInZone(selectedTz);
  const greeting = getGreeting(h);
  const day = isDaytime(h);
  const currentTz = timezones.find(tz => tz.value === selectedTz)!;

  // Clock hand angles
  const secDeg = s * 6;                   // 360/60
  const minDeg = m * 6 + s * 0.1;         // 360/60 + smooth
  const hourDeg = (h % 12) * 30 + m * 0.5; // 360/12 + smooth

  // Digital time string
  const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-white/[0.03] backdrop-blur-xl bg-white/[0.02] p-5 transition-all duration-300 hover:border-cyan-400/15 hover:shadow-[0_0_40px_-10px_rgba(0,229,255,0.08)]">

        {/* Greeting + Date */}
        <div className="text-center mb-3">
          <h3 className="text-lg font-semibold text-white/80 flex items-center justify-center gap-2">
            {greeting.emoji} {greeting.text}
          </h3>
          <p className="text-white/30 text-xs mt-1">{dateStr}</p>
        </div>

        {/* Analog Clock SVG — centered */}
        <div className="relative mx-auto w-36 h-36 mb-3">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${day ? 'rgba(0,229,255,0.15)' : 'rgba(167,139,250,0.15)'}, transparent)`,
              filter: 'blur(2px)',
            }}
          />

          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Clock face background */}
            <circle
              cx="100" cy="100" r="94"
              fill="rgba(5,5,16,0.8)"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />

            {/* Hour tick marks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const outerR = 86;
              const innerR = 76;
              return (
                <line
                  key={`h-${i}`}
                  x1={100 + Math.cos(angle) * innerR}
                  y1={100 + Math.sin(angle) * innerR}
                  x2={100 + Math.cos(angle) * outerR}
                  y2={100 + Math.sin(angle) * outerR}
                  stroke="rgba(0,229,255,0.4)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Minute tick marks */}
            {Array.from({ length: 60 }).map((_, i) => {
              if (i % 5 === 0) return null;
              const angle = (i * 6 - 90) * (Math.PI / 180);
              const outerR = 86;
              const innerR = 82;
              return (
                <line
                  key={`m-${i}`}
                  x1={100 + Math.cos(angle) * innerR}
                  y1={100 + Math.sin(angle) * innerR}
                  x2={100 + Math.cos(angle) * outerR}
                  y2={100 + Math.sin(angle) * outerR}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Hour hand */}
            <line
              x1="100" y1="100"
              x2={100 + Math.cos((hourDeg - 90) * (Math.PI / 180)) * 50}
              y2={100 + Math.sin((hourDeg - 90) * (Math.PI / 180)) * 50}
              stroke="#00e5ff"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px rgba(0,229,255,0.6))' }}
            />

            {/* Minute hand */}
            <line
              x1="100" y1="100"
              x2={100 + Math.cos((minDeg - 90) * (Math.PI / 180)) * 68}
              y2={100 + Math.sin((minDeg - 90) * (Math.PI / 180)) * 68}
              stroke="#a78bfa"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.6))' }}
            />

            {/* Second hand */}
            <line
              x1={100 - Math.cos((secDeg - 90) * (Math.PI / 180)) * 15}
              y1={100 - Math.sin((secDeg - 90) * (Math.PI / 180)) * 15}
              x2={100 + Math.cos((secDeg - 90) * (Math.PI / 180)) * 75}
              y2={100 + Math.sin((secDeg - 90) * (Math.PI / 180)) * 75}
              stroke="#2dd4bf"
              strokeWidth="1.2"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(45,212,191,0.8))' }}
            />

            {/* Center dot */}
            <circle cx="100" cy="100" r="4" fill="#2dd4bf" style={{ filter: 'drop-shadow(0 0 6px rgba(45,212,191,0.8))' }} />
            <circle cx="100" cy="100" r="2" fill="#050510" />
          </svg>
        </div>

        {/* Digital Time */}
        <div className="text-center mb-2">
          <p
            className="text-3xl font-mono font-bold tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #00e5ff, #a78bfa, #2dd4bf)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {timeStr}
          </p>
        </div>

        {/* Day/Night + City row */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-xs text-white/40 flex items-center gap-1">
            {day ? '\u2600\uFE0F Day' : '\uD83C\uDF19 Night'}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-xs text-white/40 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {currentTz.city}
          </span>
        </div>

        {/* Timezone Selector */}
        <div ref={dropRef} className="relative w-1/2 mx-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-400/20 hover:bg-white/[0.04] transition-all duration-200 text-xs text-white/60 hover:text-white/80"
          >
            <span className="truncate">{currentTz.label}</span>
            <ChevronDown
              className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 max-h-52 overflow-y-auto rounded-xl border border-white/[0.06] bg-[#0a0a1a]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50">
              {timezones.map((tz) => (
                <button
                  key={tz.value}
                  onClick={() => {
                    setSelectedTz(tz.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 hover:bg-white/[0.05] ${
                    tz.value === selectedTz
                      ? 'text-cyan-400 bg-cyan-400/5'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <span className="font-medium">{tz.city}</span>
                  <span className="ml-2 text-white/30 text-xs">{tz.offset}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
