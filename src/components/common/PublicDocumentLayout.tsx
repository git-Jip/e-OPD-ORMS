import type { ReactNode } from 'react'
import { PublicNavbar } from '../navigation/PublicNavbar'
import { LegalLinks } from './LegalLinks'

type LegalShellProps = {
  eyebrow: string
  title: string
  summary: string
  meta?: string | null
  children: ReactNode
}

export function LegalShell({
  eyebrow,
  title,
  summary,
  meta = 'Last updated: October 23, 2026',
  children,
}: LegalShellProps) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-canvas-muted text-ink">
      <PublicNavbar showSections={false} />

      <article className="public-header-offset mx-auto max-w-3xl px-5 pb-10 sm:px-8 sm:pb-14">
        <p className="text-sm font-semibold text-accent-700">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">{summary}</p>
        {meta && <p className="mt-3 text-sm text-ink-soft">{meta}</p>}

        <div className="legal-document mt-9 rounded-2xl border border-hairline bg-white p-6 sm:p-10">
          {children}
        </div>

        <LegalLinks className="mt-8 text-sm" />
        <p className="mt-4 text-center text-sm text-ink-soft">
          <a className="font-semibold text-ink underline-offset-4 hover:underline" href="/">Return to e-OPD</a>
        </p>
      </article>
    </main>
  )
}
