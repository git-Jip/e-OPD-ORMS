import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { HospitalLogo } from '../components/common/HospitalLogo'
import { LineIcon } from '../components/navigation/LineIcon'
import { supabase } from '../lib/supabase'

type DashboardState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; user: User; name: string; today: Date }

const upcomingSections = [
  { label: 'Doctors', icon: 'doctors' },
  { label: 'Appointments', icon: 'calendar' },
  { label: 'Medical requests', icon: 'document' },
  { label: 'Payments', icon: 'payment' },
] as const

function DashboardNavigation() {
  return (
    <nav aria-label="Patient navigation" className="space-y-1.5">
      <a
        href="/patient/dashboard"
        aria-current="page"
        className="flex items-center gap-3 rounded-xl bg-accent-cta px-3 py-3 font-semibold text-white"
      >
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15"><LineIcon name="dashboard" /></span>
        Dashboard
      </a>
      {upcomingSections.map(({ label, icon }) => (
        <span key={label} aria-disabled="true" className="flex items-center gap-3 rounded-xl px-3 py-3 text-ink-soft">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-hairline text-brand-600"><LineIcon name={icon} /></span>
          <span className="min-w-0 flex-1">{label}</span>
          <span className="text-xs">Soon</span>
        </span>
      ))}
    </nav>
  )
}

function greetingFor(date: Date) {
  const hour = date.getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

function ServiceCard({ icon, eyebrow, title, description, tone }: {
  icon: 'payment' | 'document'
  eyebrow: string
  title: string
  description: string
  tone: 'green' | 'blue'
}) {
  return (
    <article className="flex min-h-56 flex-col rounded-3xl border border-hairline bg-white p-6 sm:p-7">
      <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone === 'green' ? 'bg-green-50 text-brand-600' : 'bg-blue-50 text-blue-700'}`}>
        <LineIcon name={icon} className="h-6 w-6" />
      </span>
      <p className="mt-5 text-sm text-ink-soft">{eyebrow}</p>
      <h3 className="mt-1 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{description}</p>
      <p className="mt-5 text-sm font-semibold text-brand-600">Coming soon</p>
    </article>
  )
}

export function PatientDashboardPage() {
  const [state, setState] = useState<DashboardState>({ status: 'loading' })
  const [retry, setRetry] = useState(0)
  const [signingOut, setSigningOut] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && active) window.location.replace('/login')
    })

    async function loadAccount() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (!active) return
        if (sessionError) throw sessionError
        if (!session) {
          window.location.replace('/login')
          return
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (!active) return
        if (userError) throw userError
        if (!user) {
          window.location.replace('/login')
          return
        }

        const metadataName = typeof user.user_metadata.full_name === 'string'
          ? user.user_metadata.full_name.trim()
          : ''
        const { data: profile } = await supabase.from('profiles')
          .select('full_name').eq('id', user.id).maybeSingle()
        if (active) {
          setState({
            status: 'ready',
            user,
            name: profile?.full_name?.trim() || metadataName || user.email?.split('@')[0] || 'Patient',
            today: new Date(),
          })
        }
      } catch {
        if (active) setState({ status: 'error' })
      }
    }

    void loadAccount()
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [retry])

  async function signOut() {
    setSigningOut(true)
    setActionError('')
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) {
      setActionError('Could not sign out. Please try again.')
      setSigningOut(false)
      return
    }
    window.location.replace('/login')
  }

  if (state.status !== 'ready') {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-canvas-muted px-5 text-ink">
        <div className="w-full max-w-md rounded-3xl border border-hairline bg-white p-8 text-center">
          <HospitalLogo plated={false} className="mx-auto h-12" />
          {state.status === 'loading' ? (
            <p role="status" className="mt-6">Checking your account…</p>
          ) : (
            <>
              <h1 className="mt-6 text-xl font-semibold">We could not verify your account</h1>
              <p className="mt-2 text-sm text-ink-soft">Check your connection and try again, or sign in again.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => { setState({ status: 'loading' }); setRetry((value) => value + 1) }} className="landing-cta">Try again</button>
                <a href="/login" className="landing-secondary">Sign in</a>
              </div>
            </>
          )}
        </div>
      </main>
    )
  }

  const { user, name, today } = state
  const firstName = name.split(/\s+/)[0]
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'P'
  const dateLabel = new Intl.DateTimeFormat('en-PH', { weekday: 'long', month: 'long', day: 'numeric' }).format(today)

  return (
    <div className="min-h-screen bg-white text-ink lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-hairline bg-white px-4 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <a href="/" aria-label="e-OPD home" className="mb-9 flex items-center gap-3 px-3">
          <HospitalLogo plated={false} className="h-10" />
          <span className="text-xl font-semibold">e-OPD</span>
        </a>
        <DashboardNavigation />
        <p className="mt-auto px-3 pt-8 text-xs leading-relaxed text-ink-soft">Patient portal · Balayan Bayview Hospital and Medical Center</p>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-hairline bg-white">
          <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-4">
              <a href="/" aria-label="e-OPD home" className="lg:hidden"><HospitalLogo plated={false} className="h-8" /></a>
              <span className="text-lg font-semibold">Dashboard</span>
            </div>
            <details className="group relative">
              <summary className="flex list-none cursor-pointer items-center gap-3 rounded-xl border border-hairline px-2 py-1.5 text-left [&::-webkit-details-marker]:hidden">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-cta text-xs font-bold text-white">{initials}</span>
                <span className="hidden max-w-40 sm:block">
                  <span className="block truncate text-sm font-semibold">{name}</span>
                  <span className="block truncate text-xs text-ink-soft">My account</span>
                </span>
                <span aria-hidden="true" className="px-1 text-ink-soft">⌄</span>
              </summary>
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-hairline bg-white p-2 shadow-xl">
                <p className="truncate px-3 py-2 text-xs text-ink-soft" title={user.email ?? undefined}>{user.email}</p>
                <a href="/login" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-canvas-muted">Manage account</a>
                <button type="button" disabled={signingOut} onClick={() => void signOut()} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-canvas-muted disabled:opacity-60">{signingOut ? 'Signing out…' : 'Sign out'}</button>
              </div>
            </details>
          </div>
          <details className="border-t border-hairline px-5 py-2 lg:hidden">
            <summary className="flex list-none cursor-pointer items-center gap-2 text-sm font-semibold text-accent-700 [&::-webkit-details-marker]:hidden"><LineIcon name="menu" className="h-4 w-4" />Patient menu</summary>
            <div className="pt-3"><DashboardNavigation /></div>
          </details>
        </header>

        <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          {actionError && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{actionError}</p>}

          <section aria-labelledby="welcome-title" className="rounded-3xl border border-green-100 bg-[#f0f8f3] px-6 py-8 sm:px-8 sm:py-9">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-[#fff1e5] px-3 py-1 font-semibold text-accent-700">Patient home</span>
              <span className="text-ink-soft">{dateLabel}</span>
            </div>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h1 id="welcome-title" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl xl:text-5xl">{greetingFor(today)}, {firstName}.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">Your account is ready. Visit and queue information will appear here when those services are available.</p>
              </div>
              <a href="/login" className="landing-cta inline-flex items-center gap-3 text-sm">Manage account <span aria-hidden="true">→</span></a>
            </div>
          </section>

          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(20rem,0.95fr)]">
            <section aria-labelledby="queue-title" className="rounded-3xl border border-green-100 bg-white p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-brand-600"><LineIcon name="queue" className="h-6 w-6" /></span>
                  <div>
                    <p className="text-sm font-semibold text-accent-700">Queue status</p>
                    <h2 id="queue-title" className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Your place in line</h2>
                  </div>
                </div>
                <span className="rounded-full border border-hairline px-3 py-1 text-xs text-ink-soft">Coming soon</span>
              </div>
              <div className="mt-7 rounded-3xl border border-hairline bg-canvas-muted p-5 sm:p-7">
                <div className="grid gap-5 sm:grid-cols-[0.85fr_1.15fr]">
                  <div className="border-b border-hairline pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
                    <p className="text-sm font-medium text-accent-700">Your queue number</p>
                    <p className="mt-4 text-6xl font-semibold leading-none text-ink">—</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-hairline bg-white p-4"><p className="text-xs text-ink-soft">Now serving</p><p className="mt-2 text-3xl font-semibold">—</p></div>
                    <div className="rounded-2xl border border-hairline bg-white p-4"><p className="text-xs text-ink-soft">People ahead</p><p className="mt-2 text-3xl font-semibold">—</p></div>
                  </div>
                </div>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-soft">Live queue tracking is not available in this version. No queue number has been assigned through this portal.</p>
              </div>
            </section>

            <section aria-labelledby="visit-title" className="rounded-3xl border border-hairline bg-white p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-accent-700">Next visit</p>
                  <h2 id="visit-title" className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Appointment</h2>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><LineIcon name="calendar" className="h-6 w-6" /></span>
              </div>
              <div className="mt-7 rounded-2xl bg-canvas-muted p-5">
                <p className="font-semibold">No appointment available</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">Appointment requests and visit tracking are not available in this version. A visit will not be booked by creating an account.</p>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-ink-soft">When appointments launch, confirmed visit details will appear here.</p>
            </section>
          </div>

          <section aria-labelledby="services-title" className="mt-8">
            <p className="text-sm font-semibold text-accent-700">More services</p>
            <h2 id="services-title" className="mt-1 text-2xl font-semibold tracking-tight">Patient services</h2>
            <p className="mt-2 text-sm text-ink-soft">Payments and document requests are planned for a later release.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ServiceCard icon="payment" eyebrow="Bills & history" title="Payments" description="Review charges and verified payment history when billing is connected." tone="green" />
              <ServiceCard icon="document" eyebrow="Documents" title="Medical requests" description="Request and collect approved outpatient documents when this service becomes available." tone="blue" />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
