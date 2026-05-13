'use client'

import { motion } from 'framer-motion'
import { PricingCard } from '@/components/design-system/pricing-card'
import { pricingPlans } from '@/lib/constants'

export function Pricing() {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-light-gray">
      <motion.div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Choose the monthly plan that fits your interview workflow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              {...plan}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
