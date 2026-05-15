'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/design-system/badge'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Background gradient blob */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] opacity-30 blur-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-primary/20 to-transparent rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="accent" className="mb-6">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Новый проект JobTap
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark leading-tight tracking-tight text-balance">
              Ace Your Interview with Real-Time AI Coaching
            </h1>

            <p className="mt-6 text-lg text-gray leading-relaxed max-w-xl">
              JobTap listens to your interviewer and delivers instant answer suggestions — completely invisible to screen sharing.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8"
              >
                <Link href="/auth?mode=register">Start For Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 gap-2"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['JD', 'MK', 'SC', 'AT', 'RB'].map((initials, i) => (
                  <div
                    key={initials}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground text-xs font-semibold"
                    style={{ zIndex: 5 - i }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray">
                Trusted by <span className="font-semibold text-dark">50,000+</span> job seekers
              </p>
            </div>
          </motion.div>

          {/* Right content - Hero mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
              {/* Fake video call interface */}
              <div className="bg-dark/95 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <div className="w-3 h-3 rounded-full bg-success" />
                  </div>
                  <span className="text-xs text-white/60">Interview Call - 00:23:45</span>
                </div>
              </div>

              {/* Video area */}
              <div className="relative aspect-video bg-gradient-to-br from-gray/10 to-gray/5 p-6">
                {/* Interviewer placeholder */}
                <div className="absolute inset-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gray/20 flex items-center justify-center mb-4">
                      <span className="text-2xl font-semibold text-gray">HR</span>
                    </div>
                    <p className="text-sm text-gray">Interviewer</p>
                  </div>
                </div>

                {/* AI Suggestion overlay */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-64 bg-card/95 backdrop-blur-sm rounded-xl shadow-elevated border border-primary/30 p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium text-primary">AI Suggestion</span>
                  </div>
                  <p className="text-sm text-dark leading-relaxed">
                    Mention your experience with <span className="text-primary font-medium">microservices architecture</span> and how you scaled the system to handle 10x traffic.
                  </p>
                </motion.div>
              </div>

              {/* Self view */}
              <div className="absolute bottom-20 left-4 w-24 h-16 bg-dark/80 rounded-lg border border-white/10 flex items-center justify-center">
                <span className="text-xs text-white/60">You</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/50 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
