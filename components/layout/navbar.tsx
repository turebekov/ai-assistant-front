'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { Button } from '@/components/ui/button'
import { navLinks } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem('auth_token') || ''
      setIsAuthorized(Boolean(token))
    }
    syncAuthState()
    window.addEventListener('storage', syncAuthState)
    return () => window.removeEventListener('storage', syncAuthState)
  }, [])

  return (
    <nav
      className={cn(
        'nav-site fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-card'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <JobTapLogo href="/" variant="light" iconSize={32} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-nav transition-colors hover:text-nav-text-hover dark:text-slate-200 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {isAuthorized ? (
              <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full">
                <Link href="/profile">My Assistant</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-nav hover:bg-transparent hover:text-nav-text-hover dark:text-slate-200 dark:hover:text-white">
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full">
                  <Link href="/auth?mode=register">Start For Free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray hover:text-heading"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-nav transition-colors hover:text-nav-text-hover dark:text-slate-200 dark:hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {isAuthorized ? (
                  <Button asChild className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-full">
                    <Link href="/profile">My Assistant</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full justify-center text-nav hover:bg-muted hover:text-nav-text-hover dark:text-slate-200 dark:hover:text-white">
                      <Link href="/auth">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-full">
                      <Link href="/auth?mode=register">Start For Free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
