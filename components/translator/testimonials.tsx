'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Aisha Nazarbayeva',
    role: 'Product Designer',
    company: 'Remote at US Startup',
    avatar: 'AN',
    quote: 'As a Kazakh speaker, English interviews were always stressful. AssistantAI translator helped me understand every question perfectly. I got offers from 3 US companies!',
  },
  {
    name: 'Dmitry Petrov',
    role: 'Backend Developer',
    company: 'Amazon (Berlin)',
    avatar: 'DP',
    quote: 'The German hiring manager spoke so fast. The live translation was a lifesaver — I could focus on my answers instead of struggling to understand.',
  },
  {
    name: 'Maria Santos',
    role: 'Data Analyst',
    company: 'Spotify',
    avatar: 'MS',
    quote: 'Coming from Brazil, technical English is hard. AssistantAI translated everything in real-time. Now I work at Spotify! The invisibility feature is brilliant.',
  },
]

export function TranslatorTestimonials() {
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
            Candidates Who Passed International Interviews
          </h2>
          <p className="text-lg text-gray">
            Real stories from people who broke the language barrier
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-card"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray mb-6 text-pretty">
                {`"${testimonial.quote}"`}
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
