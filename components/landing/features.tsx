'use client'

import { motion } from 'framer-motion'
import { Mic, Brain, Eye, History, Globe, Languages } from 'lucide-react'
import Link from 'next/link'
import { FeatureCard } from '@/components/design-system/feature-card'
import { features } from '@/lib/constants'

const iconMap = {
  Mic,
  Brain,
  Eye,
  History,
  Globe,
  Languages,
}

export function Features() {
  return (
    <section
      id="features"
      className="py-16 lg:py-24 border-y border-landing-teal/12 bg-landing-mint"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
            Everything you need to ace any interview
          </h2>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Powerful features designed to help you perform your best
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap]
            const card = (
              <FeatureCard
                key={feature.title}
                icon={Icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            )
            if ('link' in feature && feature.link) {
              return (
                <Link key={feature.title} href={feature.link} className="block">
                  {card}
                </Link>
              )
            }
            return card
          })}
        </div>
      </div>
    </section>
  )
}
