import Link from 'next/link'
import { Youtube } from 'lucide-react'
import { XLogo } from '@/components/icons/x-logo'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { footerLinks } from '@/lib/constants'

const socialIcons = {
  x: XLogo,
  youtube: Youtube,
} as const

function FooterLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  const className =
    'text-sm text-nav transition-colors hover:text-nav-text-hover hover:underline'

  if (external || href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }

  if (href.startsWith('mailto:')) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-footer-background text-gray">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <JobTapLogo href="/" variant="light" iconSize={32} />
            <p className="mt-4 text-sm leading-relaxed text-gray">
              Real-time AI coaching for your interviews. Get instant suggestions invisible to screen sharing.
            </p>
            <div className="mt-6 flex gap-4">
              {footerLinks.social.map((link) => {
                const Icon = socialIcons[link.id]
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-nav transition-colors hover:text-nav-text-hover"
                    aria-label={`${link.label} (${link.handle})`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-nav">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-nav">Contact</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <FooterLink
                    href={link.href}
                    label={link.label}
                    external={'external' in link ? link.external : undefined}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-nav">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-gray">
            &copy; {new Date().getFullYear()} JobTap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
