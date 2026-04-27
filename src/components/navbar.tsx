'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Navigation link definition for the multi-page portfolio */
interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Education', href: '/education' },
  { label: 'Contact', href: '/contact' },
]

/**
 * Navbar — Multi-page navigation with Next.js Link routing.
 *
 * Uses `usePathname()` to detect the active page and highlights
 * the corresponding nav link with a cyan accent and glow.
 * Mobile responsive with a hamburger toggle.
 */
export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)

  // Track scroll position for navbar background intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when any link is clicked
  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  /** Check if a link is active based on the current pathname */
  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'bg-black/30' : 'bg-black/20'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo — links to home */}
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-0.5 text-xl font-bold text-white transition-opacity hover:opacity-80"
          >
            Portfolio
            <span className="text-cyan-400">.</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-2 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`relative rounded-md px-4 py-2 text-base font-medium transition-colors ${
                    active
                      ? 'text-cyan-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={
                    active
                      ? {
                          textShadow: '0 0 12px rgba(0, 212, 255, 0.5), 0 0 24px rgba(0, 212, 255, 0.2)',
                        }
                      : undefined
                  }
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-cyan-400" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-white/70 hover:bg-white/10 hover:text-white"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`overflow-hidden border-t border-white/[0.04] backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'max-h-80 bg-black/20' : 'max-h-0 border-t-0'
        }`}
      >
        <div className="space-y-2 px-4 pb-6 pt-4">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`block rounded-md px-4 py-3 text-base font-medium transition-colors ${
                  active
                    ? 'text-cyan-400 bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                style={
                  active
                    ? {
                        textShadow: '0 0 12px rgba(0, 212, 255, 0.5), 0 0 24px rgba(0, 212, 255, 0.2)',
                      }
                    : undefined
                }
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
