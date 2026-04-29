'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PricingCard } from '@/components/design-system/pricing-card'
import { pricingPlans } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-light-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray max-w-2xl mx-auto mb-8">
            Choose the plan that works best for you
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn('text-sm', !isAnnual ? 'text-dark font-medium' : 'text-gray')}>
              Monthly
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isAnnual}
              onClick={() => setIsAnnual(!isAnnual)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                isAnnual ? 'bg-primary' : 'bg-border'
              )}
            >
              <span className="sr-only">Toggle annual billing</span>
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
            <span className={cn('text-sm', isAnnual ? 'text-dark font-medium' : 'text-gray')}>
              Annual
              <span className="ml-1.5 text-xs text-success font-medium">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              {...plan}
              isAnnual={isAnnual}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
