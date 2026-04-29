'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import {
  Github,
  Linkedin,
  Youtube,
  Facebook,
  FlaskConical,
} from 'lucide-react';
import { contactUrls } from '@/lib/contact-links';

// ─── Brand SVG Icons ────────────────────────────────────────────────────────

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 5.5V18.5C22 19.33 21.33 20 20.5 20H3.5C2.67 20 2 19.33 2 18.5V5.5C2 4.67 2.67 4 3.5 4H20.5C21.33 4 22 4.67 22 5.5ZM20.5 5.5H3.5V7.23L12 12.33L20.5 7.23V5.5ZM3.5 18.5H20.5V9.12L12 14.27L3.5 9.12V18.5Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Navigation links for Quick Links section ──────────────────────────────

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Education', href: '/education' },
  { label: 'Contact', href: '/contact' },
];

// ─── Social links for Connect section ──────────────────────────────────────

const socialLinks = [
  { href: contactUrls.gmail, icon: GmailIcon, label: 'Gmail' },
  { href: contactUrls.whatsapp, icon: WhatsAppIcon, label: 'WhatsApp' },
  { href: contactUrls.github, icon: Github, label: 'GitHub' },
  { href: contactUrls.linkedin, icon: Linkedin, label: 'LinkedIn' },
  { href: contactUrls.youtube, icon: Youtube, label: 'YouTube' },
  { href: contactUrls.facebook, icon: Facebook, label: 'Facebook' },
];

// ─── Footer Component ──────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-black/10 backdrop-blur-xl mt-auto">
      {/* Nuxt Icon — centered on the top border */}
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-black/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.15)]">
        <Icon icon="simple-icons:nuxtdotjs" className="shrink-0 size-5 text-cyan-400" aria-hidden="true" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 md:grid-cols-3">
          {/* ── Brand ──────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-400/20 transition-all duration-300">
                <FlaskConical className="h-4 w-4 text-cyan-400" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-cyan-400">Ashik</span>
                <span className="text-white">.io</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              © 2025 Ashik.io. All rights reserved .
            </p>
          </div>

          {/* ── Quick Links ────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-x-8 gap-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="text-base text-slate-500 transition-colors duration-200 hover:text-cyan-400"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Connect ────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Connect</h4>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/10 text-slate-500 transition-all duration-200 hover:border-cyan-400/25 hover:bg-cyan-400/5 hover:text-cyan-400"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div className="mt-10 flex items-center justify-center border-t border-white/[0.03] pt-8">
          <p className="text-xs text-slate-700">
            © 2025 Ashik.io. All rights reserved .
          </p>
        </div>
      </div>
    </footer>
  );
}
