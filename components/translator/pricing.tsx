'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  'Unlimited live translations',
  'All 50+ languages',
  'Invisible overlay mode',
  'Context-aware AI',
  'Interview hints included',
  'Session history',
  'Priority support',
]

export function TranslatorPricing() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Meeting Translator is Included in Pro
          </h2>
          <p className="text-lg text-gray">
            Get all translation features plus AI interview coaching
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Card */}
          <div className="relative bg-background rounded-3xl shadow-elevated border-2 border-primary overflow-hidden">
            {/* Badge */}
            <div className="absolute top-0 right-6 bg-primary text-primary-foreground px-4 py-1 rounded-b-lg text-sm font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Most Popular
            </div>
            
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-2">Pro Plan</h3>
                  <p className="text-gray">Everything you need for international interviews</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-dark">$14</span>
                    <span className="text-gray">/month</span>
                  </div>
                  <p className="text-sm text-success font-medium">Save 20% yearly</p>
                </div>
              </div>
              
              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-dark">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full">
                  <Link href="/register">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1 rounded-full">
                  <Link href="#pricing">View All Plans</Link>
                </Button>
              </div>
            </div>
            
            {/* Free tier note */}
            <div className="bg-accent/50 px-8 py-4 border-t border-border">
              <p className="text-center text-dark">
                <span className="font-semibold">Start Free</span>
                <span className="text-gray"> — 5 translations included, no credit card required</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
