'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/design-system/badge'

export function TranslatorHero() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="primary" className="mb-6">
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              New Feature — Live Translation
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark leading-tight mb-6 text-balance">
              Understand Every Meeting in{' '}
              <span className="text-primary">Real-Time</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray mb-8 max-w-xl text-pretty">
              AssistantAI translates your Google Meet, Zoom or Teams meeting live — from any language to yours, instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8">
                <Link href="/register">
                  Try For Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="#how-it-works">
                  <Play className="mr-2 h-4 w-4" />
                  See How It Works
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Hero Mockup - Split screen translation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl shadow-elevated overflow-hidden bg-dark">
              {/* Header bar */}
              <div className="bg-dark/90 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                </div>
                <span className="text-white/60 text-sm ml-2">Live Translation</span>
              </div>
              
              {/* Split content */}
              <div className="grid grid-cols-2 divide-x divide-white/10">
                {/* Original speech */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇺🇸</span>
                    <span className="text-white/60 text-sm font-medium">Original (English)</span>
                  </div>
                  <div className="space-y-3">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/90 text-sm"
                    >
                      {"\"Tell me about a time when you had to handle a difficult situation with a colleague...\""}
                    </motion.p>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 1, duration: 2 }}
                      className="h-0.5 bg-primary/50 rounded"
                    />
                  </div>
                </div>
                
                {/* Translated text */}
                <div className="p-4 sm:p-6 bg-primary/10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇷🇺</span>
                    <span className="text-primary text-sm font-medium">Translated (Russian)</span>
                  </div>
                  <div className="space-y-3">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="text-white text-sm"
                    >
                      {"\"Расскажите о случае, когда вам пришлось справляться со сложной ситуацией с коллегой...\""}
                    </motion.p>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-success text-xs">Live • {'<'}2s delay</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="absolute -bottom-4 -right-4 bg-background rounded-xl shadow-elevated px-4 py-3 border border-border"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark">50+ Languages</p>
                  <p className="text-xs text-gray">Instant translation</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
