import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export function MarketingPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
