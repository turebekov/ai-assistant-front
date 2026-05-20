import Link from 'next/link'
import { JobTapLogo } from '@/components/brand/jobtap-logo'

type LegalDocumentLayoutProps = {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalDocumentLayout({
  title,
  lastUpdated,
  children,
}: LegalDocumentLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <JobTapLogo href="/" variant="light" iconSize={32} />
          <Link
            href="/"
            className="text-sm font-medium text-nav transition-colors hover:text-nav-text-hover hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">{title}</h1>
        <div className="mt-8 space-y-8 legal-doc-prose text-gray leading-relaxed [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-heading [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
          {children}
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          <em>Last updated on: {lastUpdated}</em>
        </p>
        <p className="mt-6 text-sm text-gray">
          By using the Service, you acknowledge that you have read, understood, and agree to be
          bound by this document.
        </p>
      </article>

      <footer className="mt-8 border-t border-border bg-light-gray">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <p className="text-sm text-gray">
            &copy; {new Date().getFullYear()} JobTap. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/document/policy" className="text-sm font-medium text-nav hover:text-nav-text-hover hover:underline">
              Privacy Policy
            </Link>
            <Link
              href="/document/terms"
              className="text-sm text-nav transition-colors hover:text-nav-text-hover hover:underline"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
