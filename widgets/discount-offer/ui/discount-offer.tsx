'use client'

import Link from 'next/link'
import { Flame, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DiscountOfferProps {
  time?: number
  discountCode?: string
  href?: string
}

function getTimeParts(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  return { days, hours, minutes }
}

export function DiscountOffer({
  time,
  discountCode = 'I2ODM4NW',
  href = '/profile/subscription',
}: DiscountOfferProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(time ?? 0)

  useEffect(() => {
    setRemainingSeconds(time ?? 0)
    if (!time || time <= 0) return

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [time])

  const { days, hours, minutes } = getTimeParts(remainingSeconds)
  const timeParts = [
    ['days', days],
    ['hours', hours],
    ['min', minutes],
  ] as const

  return (
    <div className="mt-auto rounded-xl bg-white p-4 text-center shadow-sm">
      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-[#2045a7]">
        <Flame className="h-6 w-6 fill-[#f54b45] text-[#f54b45]" />
        30% OFF
      </div>
      <p className="mt-1 text-sm font-semibold text-[#0b163d]">Standard plan only</p>
      {time && remainingSeconds > 0 ? (
        <>
          <p className="mt-4 text-sm font-semibold text-[#0b163d]">Offer expires in:</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {timeParts.map(([label, value]) => (
              <div key={label}>
                <p className="text-xl font-semibold tabular-nums text-[#0b163d]">
                  {String(value).padStart(2, '0')}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
      <Link
        href={href}
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#f54b45] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#df3f3a]"
      >
        <Plus className="h-5 w-5" />
        Choose a plan
      </Link>
      <p className="mt-2 text-xs text-muted-foreground">Code: {discountCode}</p>
    </div>
  )
}
