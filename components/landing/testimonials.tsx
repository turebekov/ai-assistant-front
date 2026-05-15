'use client'

import { motion } from 'framer-motion'
import { MessageSquareOff } from 'lucide-react'

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Reviews
          </h2>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            JobTap is a new product — we don&apos;t have public reviews yet. Be among the first to try it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-lg rounded-2xl border border-dashed border-border bg-light-gray/50 px-8 py-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <MessageSquareOff className="h-7 w-7 text-gray" />
          </div>
          <p className="text-base font-medium text-dark">No reviews yet</p>
          <p className="mt-2 text-sm text-gray">
            After your first interview with JobTap, you&apos;ll be able to share feedback here.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
