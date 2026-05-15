import Link from 'next/link'
import { Twitter, Linkedin, Github } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { footerLinks } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-light-gray border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <JobTapLogo href="/" variant="light" iconSize={32} />
            <p className="mt-4 text-sm text-gray leading-relaxed">
              Real-time AI coaching for your interviews. Get instant suggestions invisible to screen sharing.
            </p>
            {/* Social links */}
            <div className="mt-6 flex gap-4">
              <a
                href={footerLinks.social[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={footerLinks.social[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={footerLinks.social[2].href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-dark">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-dark">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-dark">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-gray text-center">
            &copy; {new Date().getFullYear()} JobTap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
