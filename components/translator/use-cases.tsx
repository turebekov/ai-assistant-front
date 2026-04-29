'use client'

import { motion } from 'framer-motion'
import { Target, Handshake, BookOpen } from 'lucide-react'

const useCases = [
  {
    icon: Target,
    title: 'Job Interviews',
    description: 'Interviewer speaks fast English? Get instant translation in your language.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Handshake,
    title: 'International Business Meetings',
    description: 'Work with global teams — never miss a detail in cross-language meetings.',
    color: 'bg-success/10 text-success',
  },
  {
    icon: BookOpen,
    title: 'Online Courses & Webinars',
    description: 'Understand lectures and webinars in any language in real-time.',
    color: 'bg-warning/10 text-warning',
  },
]

export function TranslatorUseCases() {
  return (
    <section className="py-16 lg:py-24 bg-light-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Perfect For Any Scenario
          </h2>
          <p className="text-lg text-gray">
            Break language barriers in every online interaction
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className={`w-14 h-14 rounded-xl ${useCase.color} flex items-center justify-center mb-6`}>
                <useCase.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3">
                {useCase.title}
              </h3>
              <p className="text-gray">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
