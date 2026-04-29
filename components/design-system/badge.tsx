import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'accent' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        // Size variants
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        // Color variants
        variant === 'default' && 'bg-primary/10 text-primary',
        variant === 'success' && 'bg-success/10 text-success',
        variant === 'warning' && 'bg-warning/10 text-warning',
        variant === 'accent' && 'bg-accent text-accent-foreground',
        variant === 'outline' && 'border border-border text-gray',
        className
      )}
    >
      {children}
    </span>
  )
}
