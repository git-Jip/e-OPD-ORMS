import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { HospitalLogo } from '../components/common/HospitalLogo'
import { supabase } from '../lib/supabase'

export function ResetPasswordPage() {
  const linkError = new URLSearchParams(window.location.hash.slice(1)).get('error_description')
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(!linkError)
  const [busy, setBusy] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(linkError ?? '')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    if (linkError) return () => { active = false }
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError || !data.session) setError('This reset link is invalid or expired. Request a new one from sign in.')
      else setReady(true)
      setChecking(false)
    }).catch(() => {
      if (active) {
        setError('The reset link could not be checked. Please try again.')
        setChecking(false)
      }
    })
    return () => { active = false }
  }, [linkError])

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password.length < 8) { setError('Use at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setBusy(true)
    setError('')
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
    } else {
      await supabase.auth.signOut({ scope: 'global' })
      setReady(false)
      setMessage('Your password has been changed. Sign in with your new password.')
    }
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-canvas-muted text-ink">
      <header className="signup-header bg-white">
        <a href="/" aria-label="e-OPD home" className="inline-flex items-center gap-4">
          <HospitalLogo plated={false} className="h-12" />
          <span className="text-2xl font-medium tracking-tight">e-OPD</span>
        </a>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-lg px-5 py-16">
        <div className="rounded-2xl border border-hairline bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-semibold">Reset password</h1>
          {checking && <p role="status" className="mt-5 text-ink-soft">Checking your reset link…</p>}
          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          {message && <p role="status" className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}
          {ready && <form onSubmit={savePassword} className="mt-6 space-y-4">
            <label className="block text-sm font-medium" htmlFor="reset-password">New password
              <input id="reset-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-hairline px-4 py-3" />
            </label>
            <label className="block text-sm font-medium" htmlFor="reset-confirm">Confirm new password
              <input id="reset-confirm" type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-2 w-full rounded-xl border border-hairline px-4 py-3" />
            </label>
            <button type="submit" disabled={busy} className="landing-cta w-full">{busy ? 'Saving…' : 'Save new password'}</button>
          </form>}
          <a href="/login" className="mt-6 inline-block text-sm font-semibold text-accent-700 hover:underline">Back to sign in</a>
        </div>
      </main>
    </div>
  )
}
