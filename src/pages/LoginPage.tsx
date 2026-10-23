import { AuthPanel } from '../components/AuthPanel'
import { HospitalLogo } from '../components/common/HospitalLogo'
import { LegalLinks } from '../components/common/LegalLinks'
import hospitalPhoto from '../assets/landing-hospital-bg.webp'

export function LoginPage() {
  return (
    <div className="signup-page min-h-screen bg-white text-ink">
      <header className="signup-header">
        <a href="/" aria-label="e-OPD home" className="inline-flex items-center gap-4">
          <HospitalLogo plated={false} className="h-12" />
          <span className="text-2xl font-medium tracking-tight">e-OPD</span>
        </a>
      </header>

      <main id="main-content" tabIndex={-1} className="signup-layout login-layout">
        <section className="signup-intro" aria-labelledby="login-welcome-title">
          <div className="mx-auto w-full max-w-[40rem]">
            <h1 id="login-welcome-title" className="signup-title font-semibold tracking-tight">Welcome to e-OPD</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft sm:text-xl">
              Sign in to manage your e-OPD account and patient information.
            </p>
            <img
              src={hospitalPhoto}
              alt="Balayan Bayview Hospital and Medical Center"
              width="1452"
              height="1083"
              fetchPriority="high"
              className="mt-9 aspect-[1.4] w-full rounded-3xl object-cover"
            />
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-hairline bg-white px-5 py-4 text-sm leading-relaxed">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 fill-none stroke-orange-600" strokeWidth="1.8">
                <path d="M12 3.5 21 20H3L12 3.5Z" strokeLinejoin="round" />
                <path d="M12 9v5m0 3h.01" strokeLinecap="round" />
              </svg>
              <p><strong>Not for emergencies.</strong> e-OPD is not an emergency service. Go to the nearest emergency department or contact local emergency services.</p>
            </div>
          </div>
        </section>

        <section className="signup-content" aria-label="Sign in">
          <div className="w-full max-w-[31rem]">
            <AuthPanel mode="login" onModeChange={() => window.location.assign('/signup')} loginLayout />
            <div className="mt-7 border-t border-hairline pt-5 text-center text-xs text-ink-soft">
              <p>Use of e-OPD is governed by the hospital&apos;s policies.</p>
              <LegalLinks className="mt-3" />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
