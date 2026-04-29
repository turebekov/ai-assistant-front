'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  name: string
  price: number
  period: string
  description: string
  features: readonly string[]
  cta: string
  highlighted?: boolean
  badge?: string
  isAnnual?: boolean
  index?: number
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted = false,
  badge,
  isAnnual = false,
  index = 0,
}: PricingCardProps) {
  const displayPrice = isAnnual ? Math.round(price * 0.8) : price

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'relative flex flex-col rounded-2xl p-8 shadow-card border',
        highlighted
          ? 'border-primary bg-card ring-2 ring-primary'
          : 'border-border bg-card'
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="warning" className="bg-warning text-warning-foreground shadow-sm">
            {badge}
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-dark">{name}</h3>
        <p className="mt-1 text-sm text-gray">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-dark">${displayPrice}</span>
          <span className="ml-1 text-gray">/{period}</span>
        </div>
        {isAnnual && price > 0 && (
          <p className="mt-1 text-sm text-success">Save 20% with annual billing</p>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="h-5 w-5 shrink-0 text-success mt-0.5" />
            <span className="text-sm text-gray">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className={cn(
          'w-full rounded-full',
          highlighted
            ? 'bg-primary hover:bg-primary-hover text-primary-foreground'
            : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
        )}
      >
        {cta}
      </Button>
    </motion.div>
  )
}
