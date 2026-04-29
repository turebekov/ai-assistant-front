import Link from 'next/link'
import { Brain, Shield, Zap, Clock } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const features = [
  {
    icon: Shield,
    title: 'Completely Private',
    description: 'Your interview data is never stored',
  },
  {
    icon: Zap,
    title: 'Real-Time Suggestions',
    description: 'Get instant AI-powered hints',
  },
  {
    icon: Clock,
    title: 'Setup in Seconds',
    description: 'No download required for web',
  },
]

const testimonial = {
  quote: "AssistantAI helped me land my dream job at Google. The real-time suggestions were game-changing!",
  author: "Sarah Chen",
  role: "Software Engineer at Google",
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary-hover p-12 flex-col justify-between">
        <div>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AssistantAI</span>
          </Link>

          <p className="mt-6 text-white/80 text-lg max-w-md">
            Real-time AI coaching for your interviews. Get instant suggestions invisible to screen sharing.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-auto pt-12">
          <blockquote className="border-l-2 border-white/30 pl-4">
            <p className="text-white/90 italic leading-relaxed">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <footer className="mt-4">
              <p className="text-white font-medium">{testimonial.author}</p>
              <p className="text-sm text-white/70">{testimonial.role}</p>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
