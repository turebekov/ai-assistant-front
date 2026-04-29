'use client'

import { motion } from 'framer-motion'
import { Video, Languages, Cpu, Monitor } from 'lucide-react'

const steps = [
  {
    step: 1,
    icon: Video,
    title: 'Open Your Meeting',
    description: 'Start any meeting in browser — Meet, Zoom, Teams',
  },
  {
    step: 2,
    icon: Languages,
    title: 'Select Languages',
    description: 'Choose source language + your language (supports EN, RU, KZ, DE, FR, ES, ZH, AR, HI)',
  },
  {
    step: 3,
    icon: Cpu,
    title: 'AI Translates Live',
    description: 'Alibaba Qwen ASR transcribes → Claude AI translates in under 2 seconds',
  },
  {
    step: 4,
    icon: Monitor,
    title: 'Read in Your Language',
    description: 'Clean overlay shows translated text as speaker talks. Invisible to screen sharing.',
  },
]

export function TranslatorHowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-light-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            How Live Translation Works
          </h2>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Four simple steps to understand any meeting in your language
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-border" />
              )}
              
              <div className="bg-background rounded-2xl p-6 shadow-card text-center relative">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-dark mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
