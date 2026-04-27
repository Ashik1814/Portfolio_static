import Link from 'next/link';
import {
  Github,
  Linkedin,
  Youtube,
  Facebook,
  FlaskConical,
} from 'lucide-react';

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
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
];

// ─── Footer Component ──────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/8 bg-black/20 backdrop-blur-sm mt-auto">
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
                <span className="text-cyan-400">Alex</span>
                <span className="text-white">Chen</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              © 2025 Alex Chen. All rights reserved .🤍
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
            <div className="flex items-center gap-4">
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
        <div className="mt-10 flex items-center justify-center border-t border-cyan-500/8 pt-8">
          <p className="text-xs text-slate-700">
            © 2025 Alex Chen. All rights reserved .🤍
          </p>
        </div>
      </div>
    </footer>
  );
}
