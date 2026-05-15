'use client'

import { motion } from 'framer-motion'
import { companyLogos } from '@/lib/constants'

export function LogosStrip() {
  // Double the logos for seamless infinite scroll
  const duplicatedLogos = [...companyLogos, ...companyLogos]

  return (
    <section className="py-12 border-y border-border bg-light-gray/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray mb-8">
          We&apos;ll help you land roles at companies like
        </p>

        {/* Infinite scroll container */}
        <div className="relative overflow-hidden">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-light-gray/50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-light-gray/50 to-transparent z-10" />

          <motion.div
            className="flex gap-12 items-center"
            animate={{
              x: [0, -50 * companyLogos.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 20,
                ease: 'linear',
              },
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
              >
                <span className="text-xl font-semibold text-gray/60 whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
