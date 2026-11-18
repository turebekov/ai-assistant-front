import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell'
import { Button } from '@/components/ui/button'
import { TUTORIAL_YOUTUBE_URL, TUTORIAL_YOUTUBE_VIDEO_ID } from '@/lib/constants'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES } from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata(SEO_PAGES.tutorial)

const steps = [
  'Create an AI assistant with your role, interview type, and language.',
  'Open a session and share your meeting tab audio.',
  'Get real-time answer suggestions invisible to screen sharing.',
]

export default function TutorialPage() {
  const embedSrc = `https://www.youtube-nocookie.com/embed/${TUTORIAL_YOUTUBE_VIDEO_ID}?rel=0`

  return (
    <MarketingPageShell>
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background pt-28 pb-12 lg:pt-32 lg:pb-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">Tutorial</p>
          <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl text-balance">
            How to use JobTap
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray">
            A short walkthrough on creating your AI assistant and running your first interview session.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Web Version Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-heading mb-8">Web Version</h2>
            
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
              <div className="relative aspect-video w-full bg-dark/5">
                <iframe
                  src={embedSrc}
                  title="JobTap tutorial — create your assistant and start a session"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-gray">
              Prefer YouTube?{' '}
              <a
                href={TUTORIAL_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Open on YouTube
              </a>
            </p>

            <ul className="mt-10 space-y-4">
              {steps.map((step) => (
                <li key={step} className="flex items-start gap-3 text-gray">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Version Section */}
          <div className="border-t border-border pt-16">
            <h2 className="text-3xl font-bold tracking-tight text-heading mb-8">Desktop Version</h2>
            
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-bold text-heading mb-4">Introduction</h3>
                <p className="text-gray mb-4">
                  Prefer a desktop app? Download JobTap Assistant for Windows to get the same powerful interview coaching on your desktop. No server setup needed — the full interface runs locally on your computer.
                </p>
                <div className="mt-6">
                  {process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL ? (
                    <Button asChild size="lg" className="rounded-full">
                      <a href={process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL} download>
                        📥 Download JobTap Assistant (Windows)
                      </a>
                    </Button>
                  ) : (
                    <div className="rounded-lg border border-gray bg-gray/5 px-4 py-3 text-sm text-gray">
                      Download link coming soon. Check back later or contact <a href="mailto:support@jobtap.app" className="font-medium text-primary hover:underline">support@jobtap.app</a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-heading mb-4">System Requirements</h3>
                <ul className="space-y-2 text-gray">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Windows 10 or later, 64-bit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Internet connection for sign-in and API access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>JobTap account (Google sign-in or email)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Zoom, Teams, or Google Meet (browser or desktop)</span>
                  </li>
                </ul>
                <p className="text-sm text-gray mt-4 italic">
                  Note: The app uses localhost only for its interface window. No external database setup required.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-heading mb-4">Installation & Sign-In</h3>
                <ol className="space-y-3 text-gray">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary min-w-6">1.</span>
                    <span><strong>Download and run installer</strong> — Click the download button to get JobTap Assistant Setup</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary min-w-6">2.</span>
                    <span><strong>Follow installation wizard</strong> — Choose installation folder and proceed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary min-w-6">3.</span>
                    <span><strong>Launch and sign in</strong> — Open JobTap Assistant from Start menu or desktop shortcut, then sign in with your JobTap account</span>
                  </li>
                </ol>
                
                <div className="mt-6 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4 dark:bg-orange-950/20">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" aria-hidden />
                    <div className="text-sm text-orange-900 dark:text-orange-200">
                      <strong>Note:</strong> Windows may show a SmartScreen warning since the installer is not yet signed. This is normal. Click "More info" and then "Run anyway" to proceed with installation.
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-heading mb-4">How the Desktop App Works</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-bold text-heading mb-2">🎯 No Video, Only Audio</h4>
                    <p className="text-gray text-sm">
                      The desktop app captures system audio loopback (what plays through your speakers), not video. You'll hear everything from the meeting but won't see video. This is perfect for interviews where you need audio coaching while maintaining your own screen.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-bold text-heading mb-2">⚡ Offline Interface</h4>
                    <p className="text-gray text-sm">
                      The app window runs locally on your computer. This means fast, responsive interface with no server lag. All the interview coaching happens instantly without network delays.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-bold text-heading mb-2">🔒 Share Without Being Seen</h4>
                    <p className="text-gray text-sm">
                      When you share your screen in Zoom, Teams, or Meet, the JobTap window stays hidden. Using Windows API protection (SetWindowDisplayAffinity), your interview coaching interface remains invisible to other participants.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-heading mb-4">Interview Assistant Interface</h3>
                <p className="text-gray mb-4">
                  Once you open an interview session, you'll see a clean, three-panel interface:
                </p>
                <div className="rounded-lg overflow-hidden border border-border">
                  <Image
                    src="/desktop-guide/03-assistant-session.png"
                    alt="JobTap Interview Assistant interface showing conversation panel, live transcript, and AI suggestions"
                    width={1440}
                    height={900}
                    className="w-full"
                    priority
                  />
                </div>
                <p className="text-sm text-gray mt-3">
                  <strong>Left:</strong> Interview conversation area where you can connect to your meeting<br/>
                  <strong>Bottom:</strong> Live transcript of the interview (when connected)<br/>
                  <strong>Right:</strong> AI suggestions panel showing real-time coaching tips (hidden from screen share)
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-heading mb-4">How to Take a Screenshot (Solve Screenshot)</h3>
                <p className="text-gray mb-4">
                  When you need help solving a problem shown on screen during an interview, use the "Solve screenshot" feature:
                </p>
                <ol className="space-y-3 text-gray">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary min-w-6">1.</span>
                    <span><strong>Find the "Solve screenshot" button</strong> — Located in the AI suggestions panel during an active session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary min-w-6">2.</span>
                    <span><strong>Choose which screen to capture</strong> — A dialog will appear if you have multiple monitors. Select the screen showing your problem</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary min-w-6">3.</span>
                    <span><strong>Confirm the capture</strong> — The app takes one frame from your selected screen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary min-w-6">4.</span>
                    <span><strong>Get instant suggestions</strong> — JobTap analyzes the screenshot and provides answer suggestions in real-time, all hidden from your screen share</span>
                  </li>
                </ol>
                
                <div className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950/20">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden />
                    <div className="text-sm text-blue-900 dark:text-blue-200">
                      <strong>Important:</strong> This is a single-frame snapshot taken on demand, not continuous recording. You always control when to capture, and the screenshot is only used for AI analysis during your session.
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-heading mb-4">Desktop vs. Web: What's Different</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-bold text-heading">Feature</th>
                        <th className="text-left py-3 px-4 font-bold text-heading">Web App</th>
                        <th className="text-left py-3 px-4 font-bold text-heading">Desktop App</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray">
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><strong>Audio Input</strong></td>
                        <td className="py-3 px-4">Browser tab audio (from open tab only)</td>
                        <td className="py-3 px-4">System audio loopback (all system sound)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><strong>Screenshots</strong></td>
                        <td className="py-3 px-4">Use browser's screenshot feature</td>
                        <td className="py-3 px-4">Use desktop "Solve screenshot" (all screens available)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><strong>Setup</strong></td>
                        <td className="py-3 px-4">Just open JobTap in your browser</td>
                        <td className="py-3 px-4">Download and install .exe file</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><strong>Hidden from Share</strong></td>
                        <td className="py-3 px-4">Browser tab only (if sharing browser tab)</td>
                        <td className="py-3 px-4">Full app window (using Windows API protection)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4"><strong>Best For</strong></td>
                        <td className="py-3 px-4">Video calls where you share browser tab</td>
                        <td className="py-3 px-4">Any meeting type, desktop apps, coding interviews</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-heading mb-4">Troubleshooting</h3>
                <div className="space-y-4 text-gray">
                  <div>
                    <strong className="text-heading">App won't start or crashes</strong>
                    <p className="text-sm mt-1">Restart your computer and ensure Windows 10 or later is installed. Check your internet connection.</p>
                  </div>
                  <div>
                    <strong className="text-heading">No audio captured</strong>
                    <p className="text-sm mt-1">Make sure your system audio is working and not muted. Check speaker volume in Windows Settings. The app needs to hear output from Zoom, Teams, or Meet.</p>
                  </div>
                  <div>
                    <strong className="text-heading">Can't sign in with Google</strong>
                    <p className="text-sm mt-1">If the Google sign-in dialog doesn't open, try signing in with your email instead. This is a known issue with some Windows versions.</p>
                  </div>
                  <div>
                    <strong className="text-heading">"Solve screenshot" doesn't work</strong>
                    <p className="text-sm mt-1">Check that Windows permissions are enabled for the app to access your screens. Go to Settings {">"} Privacy {">"} Screen capture and allow JobTap Assistant.</p>
                  </div>
                  <div>
                    <strong className="text-heading">Missing GOOGLE_CLIENT_ID error</strong>
                    <p className="text-sm mt-1">This error appears if Google OAuth isn't configured. Use email sign-in as an alternative, or contact support.</p>
                  </div>
                </div>
                <p className="text-sm text-gray mt-6">
                  Need help? Contact us at <a href="mailto:support@jobtap.app" className="font-medium text-primary hover:underline">support@jobtap.app</a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-2xl bg-primary px-8 py-10 text-center text-primary-foreground">
            <h2 className="text-2xl font-bold">Ready to try it yourself?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
              Start free — 60 minutes of assistant time included. Use web or desktop version.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 rounded-full">
              <Link href="/auth?mode=register">Start For Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  )
}
