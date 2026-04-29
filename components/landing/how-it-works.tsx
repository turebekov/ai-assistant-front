'use client'

import { motion } from 'framer-motion'
import { Video, Headphones, Lightbulb } from 'lucide-react'
import { howItWorksSteps } from '@/lib/constants'

const iconMap = {
  Video,
  Headphones,
  Lightbulb,
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Get started in seconds and ace your next interview
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {howItWorksSteps.map((step, index) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap]
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
                )}

                {/* Step number */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-gray leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
