import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[loading=true]:opacity-80 data-[loading=true]:cursor-wait",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground text-base font-medium leading-none shadow-none hover:bg-primary-hover hover:-translate-y-px active:translate-y-0 active:bg-primary-active disabled:translate-y-0 disabled:bg-[#FFD0B0] disabled:text-primary-foreground/90 disabled:opacity-100',
        destructive:
          'bg-destructive text-white font-semibold shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-2 border-primary bg-transparent text-primary shadow-none hover:bg-primary-light hover:text-primary dark:border-primary dark:hover:bg-primary-light/10',
        /** Secondary actions (e.g. profile chrome) — slate / gray-900, not orange */
        neutral:
          'border border-gray-900 bg-transparent text-gray-900 shadow-none hover:bg-gray-900/[0.07] focus-visible:border-gray-900 focus-visible:ring-gray-900/20 dark:border-gray-500 dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:border-gray-400 dark:focus-visible:ring-white/15',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-muted hover:text-foreground border border-border',
        ghost:
          'text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
        link: 'rounded-none text-nav underline-offset-4 hover:text-nav-text-hover hover:underline shadow-none h-auto px-0 py-0 font-medium',
      },
      size: {
        default: 'h-11 px-6 py-2.5 has-[>svg]:px-5',
        sm: 'h-8 gap-1.5 px-4 text-sm font-medium leading-none has-[>svg]:px-3',
        lg: 'h-14 px-8 text-base font-medium leading-none has-[>svg]:px-6',
        icon: 'size-11',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
