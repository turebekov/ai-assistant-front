'use client'

import { motion } from 'framer-motion'

const languages = [
  { flag: '🇺🇸', name: 'English' },
  { flag: '🇷🇺', name: 'Russian' },
  { flag: '🇰🇿', name: 'Kazakh' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇨🇳', name: 'Chinese' },
  { flag: '🇸🇦', name: 'Arabic' },
  { flag: '🇮🇳', name: 'Hindi' },
  { flag: '🇵🇹', name: 'Portuguese' },
  { flag: '🇯🇵', name: 'Japanese' },
  { flag: '🇰🇷', name: 'Korean' },
  { flag: '🇹🇷', name: 'Turkish' },
  { flag: '🇮🇹', name: 'Italian' },
  { flag: '🇵🇱', name: 'Polish' },
]

export function SupportedLanguages() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            50+ Languages Supported
          </h2>
          <p className="text-lg text-gray">
            Translate from and to any major language instantly
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              className="bg-light-gray rounded-xl p-4 text-center hover:shadow-card transition-shadow"
            >
              <span className="text-3xl mb-2 block">{lang.flag}</span>
              <span className="text-sm font-medium text-dark">{lang.name}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-gray"
        >
          And 35+ more languages including Dutch, Vietnamese, Thai, Indonesian, Ukrainian, Hebrew, Greek...
        </motion.p>
      </div>
    </section>
  )
}
