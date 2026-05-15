import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type JobTapLogoProps = {
  className?: string
  href?: string
  /** Full image on dark backgrounds; icon + text on light */
  variant?: 'light' | 'dark'
  iconSize?: number
}

export function JobTapLogo({
  className,
  href = '/',
  variant = 'light',
  iconSize = 36,
}: JobTapLogoProps) {
  const content =
    variant === 'dark' ? (
      <Image
        src="/jobtap-logo.png"
        alt="JobTap"
        width={160}
        height={iconSize}
        className={cn('h-auto w-auto', className)}
        style={{ height: iconSize, width: 'auto' }}
        priority
      />
    ) : (
      <span className={cn('inline-flex items-center gap-2', className)}>
        <Image
          src="/favicon.png"
          alt=""
          width={iconSize}
          height={iconSize}
          className="rounded-lg"
          style={{ width: iconSize, height: iconSize }}
          aria-hidden
        />
        <span className="text-xl font-bold leading-none">
          <span className="text-dark">Job</span>
          <span className="text-primary">Tap</span>
        </span>
      </span>
    )

  if (!href) {
    return content
  }

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  )
}
