'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  quote: string
  index?: number
  className?: string
}

export function TestimonialCard({
  name,
  role,
  company,
  avatar,
  rating,
  quote,
  index = 0,
  className,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'flex flex-col bg-card rounded-xl p-6 shadow-card border border-border',
        className
      )}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="h-5 w-5 fill-warning text-warning"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="flex-1 text-gray leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-heading">{name}</p>
          <p className="text-xs text-gray">
            {role} at {company}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
