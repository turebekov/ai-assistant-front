'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  index?: number
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  className,
  index = 0
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'group relative bg-card rounded-xl p-6 shadow-card border border-border',
        'transition-all duration-300 hover:shadow-elevated hover:border-primary/20',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-heading mb-2">{title}</h3>
      <p className="text-sm text-gray leading-relaxed">{description}</p>
    </motion.div>
  )
}
