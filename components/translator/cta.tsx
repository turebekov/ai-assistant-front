'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TranslatorCTA() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-dark px-6 py-16 sm:px-12 sm:py-20 text-center"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-success blur-3xl" />
          </div>
          
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
              Break the Language Barrier in Your Next Interview
            </h2>
            
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of candidates who aced international interviews with real-time AI translation.
            </p>
            
            <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8">
              <Link href="/register">
                Start Translating For Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <p className="mt-4 text-sm text-white/50">
              No credit card required • 5 free translations included
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
