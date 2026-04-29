'use client'

import { motion } from 'framer-motion'
import { Check, X, Minus } from 'lucide-react'

const features = [
  { name: 'Real-time speed', assistantai: '<2 sec', manual: '5-10 sec', assistantaiWins: true },
  { name: 'Invisible overlay', assistantai: true, manual: false, assistantaiWins: true },
  { name: 'Context-aware AI', assistantai: true, manual: false, assistantaiWins: true },
  { name: 'Interview hints', assistantai: true, manual: false, assistantaiWins: true },
  { name: 'Privacy (no storage)', assistantai: true, manual: false, assistantaiWins: true },
  { name: 'Works in browser', assistantai: true, manual: 'partial', assistantaiWins: true },
]

function FeatureValue({ value, wins }: { value: boolean | string, wins?: boolean }) {
  if (value === true) {
    return (
      <div className={`flex items-center justify-center ${wins ? 'text-success' : 'text-gray'}`}>
        <Check className="h-5 w-5" />
      </div>
    )
  }
  if (value === false) {
    return (
      <div className="flex items-center justify-center text-destructive">
        <X className="h-5 w-5" />
      </div>
    )
  }
  if (value === 'partial') {
    return (
      <div className="flex items-center justify-center text-warning">
        <Minus className="h-5 w-5" />
      </div>
    )
  }
  return (
    <span className={`text-sm font-medium ${wins ? 'text-success' : 'text-destructive'}`}>
      {value}
    </span>
  )
}

export function ComparisonTable() {
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
            AssistantAI vs Manual Translation
          </h2>
          <p className="text-lg text-gray">
            See why AI-powered translation beats the alternatives
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-background rounded-2xl shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-light-gray">
                  <th className="text-left py-4 px-6 font-semibold text-dark">Feature</th>
                  <th className="text-center py-4 px-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">
                      AssistantAI
                    </div>
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray">Manual / Google</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={index % 2 === 0 ? 'bg-background' : 'bg-light-gray/50'}
                  >
                    <td className="py-4 px-6 text-dark font-medium">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      <FeatureValue value={feature.assistantai} wins={feature.assistantaiWins} />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <FeatureValue value={feature.manual} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
