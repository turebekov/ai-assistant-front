import Link from 'next/link'
import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/lib/constants'

type ContactLinksProps = {
  /** Intro sentence before the contact list (optional). */
  intro?: string
  className?: string
}

export function ContactLinks({ intro, className }: ContactLinksProps) {
  return (
    <div className={className}>
      {intro ? <p>{intro}</p> : null}
      <ul className="mt-2 list-inside list-disc space-y-1 text-inherit">
        <li>
          Email:{' '}
          <Link href={`mailto:${CONTACT_EMAIL}`} className="text-link underline">
            {CONTACT_EMAIL}
          </Link>
        </li>
        {SOCIAL_LINKS.map((link) => (
          <li key={link.id}>
            {link.label}:{' '}
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline"
            >
              {link.handle}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
