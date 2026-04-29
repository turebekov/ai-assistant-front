'use client'

import { motion } from 'framer-motion'
import { TestimonialCard } from '@/components/design-system/testimonial-card'
import { testimonials } from '@/lib/constants'

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
            50,000+ candidates already succeeded
          </h2>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Join thousands of job seekers who landed their dream jobs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              {...testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
