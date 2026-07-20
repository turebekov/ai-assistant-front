'use client'

import { motion } from 'framer-motion'
import { PricingCard } from '@/components/design-system/pricing-card'
import { pricingPlans } from '@/lib/constants'
import { usePaidSubscriptionsEnabled } from '@/lib/billing/use-paid-subscriptions-enabled'

export function Pricing() {
  const paidEnabled = usePaidSubscriptionsEnabled()

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-white">
      <motion.div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            {paidEnabled
              ? 'Choose the monthly plan that fits your interview workflow'
              : 'Start free today — paid plans are coming soon'}
          </p>
          <div className="mt-4 inline-flex items-center justify-center rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm">
            Use code <span className="ml-1 mr-1 text-red-900">K0NJA4NW</span> for a 50% discount on paid plans.
          </div>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const isFree = plan.price === 0
            const disabled = !isFree && !paidEnabled
            return (
              <PricingCard
                key={plan.name}
                {...plan}
                index={index}
                disabled={disabled}
                badge={disabled ? 'Coming soon' : 'badge' in plan ? plan.badge : undefined}
                cta={disabled ? 'Coming soon' : plan.cta}
                href={isFree ? '/auth?mode=register' : undefined}
              />
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
