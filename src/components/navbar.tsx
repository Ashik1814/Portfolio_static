'use client'

import { useState, useEffect, useCallback } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavLink {
  label: string
  href: string
  id: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState<string>('home')
  const [scrolled, setScrolled] = useState<boolean>(false)

  // Track scroll position for navbar background intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active section detection using IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.id)
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          })
        },
        {
          rootMargin: '-40% 0px -55% 0px',
          threshold: 0,
        }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  // Smooth scroll handler
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault()
      const targetId = href.replace('#', '')
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }

      // Close mobile menu after clicking
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    },
    [mobileMenuOpen]
  )

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'bg-black/40' : 'bg-black/30'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-0.5 text-xl font-bold text-white transition-opacity hover:opacity-80"
          >
            Portfolio
            <span className="text-cyan-400">.</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={
                    isActive
                      ? {
                          textShadow: '0 0 12px rgba(0, 212, 255, 0.5), 0 0 24px rgba(0, 212, 255, 0.2)',
                        }
                      : undefined
                  }
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-cyan-400" />
                  )}
                </a>
              )
            })}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
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
        className={`overflow-hidden border-t border-white/10 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'max-h-80 bg-black/30' : 'max-h-0 border-t-0'
        }`}
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-cyan-400 bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                style={
                  isActive
                    ? {
                        textShadow: '0 0 12px rgba(0, 212, 255, 0.5), 0 0 24px rgba(0, 212, 255, 0.2)',
                      }
                    : undefined
                }
              >
                {link.label}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
