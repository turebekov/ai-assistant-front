import { Shield, Zap, Clock } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'

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

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] bg-dark p-12 flex-col justify-between">
        <div>
          <JobTapLogo href="/" variant="dark" iconSize={40} />

          <p className="mt-6 text-white/80 text-lg max-w-md">
            Real-time AI coaching for your interviews. Get instant suggestions invisible to screen sharing.
          </p>

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

        <p className="mt-auto pt-12 text-sm text-white/60">
          JobTap is a new project — user reviews are coming soon.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
