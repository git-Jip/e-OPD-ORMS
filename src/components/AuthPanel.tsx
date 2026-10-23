import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { PatientDetails } from './patient/PatientInformationForm'

type AuthMode = 'signup' | 'login'

export const GOOGLE_SIGN_IN_RETURN_KEY = 'e-opd-google-sign-in-return'

type AuthPanelProps = {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onVerificationPendingChange?: (pending: boolean) => void
  patientDetails?: PatientDetails | null
  patientType?: 'new' | 'existing'
  registrationLayout?: boolean
  loginLayout?: boolean
  redirectAuthenticated?: boolean
}

const inputClass = 'mt-2 w-full rounded-xl border border-hairline bg-white px-4 py-3 text-ink focus:outline-2 focus:outline-accent-700'

export function AuthPanel({ mode, onModeChange, onVerificationPendingChange, patientDetails, patientType, registrationLayout = false, loginLayout = false, redirectAuthenticated = false }: AuthPanelProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileReady, setProfileReady] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const signupInProgress = useRef(false)
  const [error, setError] = useState(() => loginLayout
    ? new URLSearchParams(window.location.hash.slice(1)).get('error_description') ?? ''
    : '')
  const [message, setMessage] = useState('')
  const registrationName = patientDetails
    ? [patientDetails.firstName, patientDetails.middleName, patientDetails.lastName, patientDetails.suffix].filter(Boolean).join(' ')
    : fullName.trim()

  useEffect(() => {
    if (loginLayout) {
      const params = new URLSearchParams(window.location.hash.slice(1))
      if (params.get('error_description')) window.history.replaceState(null, '', '/login')
    }
    let active = true
    let authChanged = false

    function updateSession(nextUser: User | null) {
      if (!active) return
      if (nextUser && signupInProgress.current) return
      setUser(nextUser)
      if (nextUser) {
        setFullName(typeof nextUser.user_metadata.full_name === 'string' ? nextUser.user_metadata.full_name.trim() : '')
        setProfileLoading(true)
        setProfileReady(false)
      } else {
        setProfileReady(false)
      }
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authChanged = true
      updateSession(session?.user ?? null)
    })

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active || authChanged) return
      updateSession(data.session?.user ?? null)
      if (sessionError) setError('Your session could not be restored. Please sign in again.')
    }).catch(() => {
      if (active) {
        setError('We could not connect. Please try again.')
        setLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [loginLayout])

  useEffect(() => {
    if (!user) return
    let active = true
    const currentUser = user
    const savedName = typeof currentUser.user_metadata.full_name === 'string'
      ? currentUser.user_metadata.full_name.trim()
      : ''

    async function loadProfile() {
      try {
        // Name metadata is display data only; database policies enforce ownership.
        if (savedName) {
          const { error: createError } = await supabase.from('profiles').upsert(
            { id: currentUser.id, full_name: savedName },
            { onConflict: 'id', ignoreDuplicates: true },
          )
          if (createError) throw createError
        }

        const { data, error: profileError } = await supabase.from('profiles')
          .select('full_name').eq('id', currentUser.id).maybeSingle()
        if (profileError) throw profileError
        if (active && data) setFullName(data.full_name)

        const patient = currentUser.user_metadata.patient_details as (PatientDetails & { patientType?: 'new' | 'existing' }) | undefined
        if (patient && typeof patient.firstName === 'string' && typeof patient.lastName === 'string') {
          const { error: patientError } = await supabase.from('patient_profiles').upsert({
            id: currentUser.id,
            registration_type: patient.patientType === 'existing' ? 'existing' : 'new',
            first_name: patient.firstName.trim(),
            middle_name: patient.middleName?.trim() || null,
            last_name: patient.lastName.trim(),
            suffix: patient.suffix?.trim() || null,
            contact_number: patient.contactNumber.trim(),
            gender: patient.gender || null,
            date_of_birth: patient.dateOfBirth,
            address_line: patient.addressLine.trim(),
            last_hospital_visit_date: patient.patientType === 'existing' && patient.lastHospitalVisitDate ? patient.lastHospitalVisitDate : null,
            previous_hospital_doctor: patient.patientType === 'existing' ? patient.previousHospitalDoctor?.trim() || null : null,
          }, { onConflict: 'id', ignoreDuplicates: true })
          if (patientError) throw patientError
        }
        if (active) setProfileReady(true)
      } catch {
        if (active) {
          setProfileReady(false)
          setError('Your profile could not be completed. Sign in again to retry.')
        }
      } finally {
        if (active) setProfileLoading(false)
      }
    }

    void loadProfile()
    return () => { active = false }
  }, [user])

  useEffect(() => {
    if (user && profileReady && redirectAuthenticated) {
      window.location.replace('/patient/dashboard')
    }
  }, [user, profileReady, redirectAuthenticated])

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        if (registrationLayout && !acceptedTerms) {
          setError('Agree to the Terms and Conditions and acknowledge the Privacy Notice to continue.')
          return
        }
        if (!registrationName) {
          setError('Enter your full name.')
          return
        }
        signupInProgress.current = true
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: registrationName, ...(patientDetails ? { patient_details: { ...patientDetails, patientType } } : {}) },
            emailRedirectTo: `${window.location.origin}/`,
          },
        })
        if (authError) throw authError
        setPassword('')
        if (data.session) {
          await supabase.auth.signOut({ scope: 'local' })
          throw new Error('Email confirmation must be enabled in Supabase before patient registration.')
        }
        setVerificationEmail(email.trim())
        setVerificationCode('')
        onVerificationPendingChange?.(true)
        setMessage('If this is a new account, check your email and Spam folder for a verification code or confirmation link. If you have used this email before, sign in or reset your password instead.')
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(), password,
        })
        if (authError) throw authError
        setPassword('')
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'We could not connect. Please try again.')
    } finally {
      signupInProgress.current = false
      setBusy(false)
    }
  }

  async function verifyEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: verificationEmail,
        token: verificationCode.trim(),
        type: 'email',
      })
      if (verifyError) throw verifyError
      if (!data.session) throw new Error('Email verification did not start a session. Please sign in.')
      setVerificationCode('')
      setVerificationEmail('')
      onVerificationPendingChange?.(false)
      setMessage('Email verified.')
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'The code could not be verified. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function resendVerification() {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: verificationEmail,
        options: { emailRedirectTo: `${window.location.origin}/` },
      })
      if (resendError) throw resendError
      setMessage('If this address is awaiting confirmation, a new verification email has been sent.')
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : 'The verification email could not be resent. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function signInWithGoogle() {
    setBusy(true)
    setError('')
    setMessage('')

    try {
      sessionStorage.setItem(GOOGLE_SIGN_IN_RETURN_KEY, '1')
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` },
      })
      if (authError) throw authError
    } catch (authError) {
      sessionStorage.removeItem(GOOGLE_SIGN_IN_RETURN_KEY)
      setError(authError instanceof Error ? authError.message : 'Google sign-in could not be started. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function forgotPassword() {
    if (!email.trim()) {
      setError('Enter your email address first, then choose Forgot password.')
      return
    }
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/`,
      })
      if (resetError) throw resetError
      setMessage('If this email has an account, a password reset link has been sent.')
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'The reset link could not be sent. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    if (!fullName.trim()) {
      setError('Enter your full name.')
      return
    }
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const { error: profileError } = await supabase.from('profiles')
        .upsert({ id: user.id, full_name: fullName.trim() })
      if (profileError) throw profileError
      setMessage('Your name has been saved.')
    } catch {
      setError('Your name could not be saved. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' })
      if (signOutError) throw signOutError
      setUser(null)
      setFullName('')
      setPassword('')
      setMessage('You have signed out.')
    } catch {
      setError('We could not sign you out. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const title = user ? 'Your account' : mode === 'signup' ? 'Create your account' : loginLayout ? 'Sign in to e-OPD' : 'Sign in'

  function switchMode() {
    setError('')
    setMessage('')
    setPassword('')
    setShowPassword(false)
    onModeChange(mode === 'signup' ? 'login' : 'signup')
  }

  return (
    <>
      <h2 id="preview-title" className={`${registrationLayout || loginLayout ? 'text-center text-2xl' : 'text-2xl'} font-semibold tracking-tight text-ink`}>{title}</h2>
      <p id="preview-description" className={`${registrationLayout || loginLayout ? 'mt-1 text-center text-sm' : 'mt-3'} leading-relaxed text-ink-soft`}>
        {user ? `Signed in as ${user.email ?? 'your account'}.` : loginLayout ? 'Welcome back. Please sign in to continue.' : registrationLayout ? mode === 'signup' ? 'Welcome! Please fill in the details to get started.' : 'Welcome back. Sign in to your account.' : 'Access your BBHMC Online OPD account.'}
      </p>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}

      {loading ? <p role="status" className="mt-6">Checking your account…</p> : user && redirectAuthenticated && (profileLoading || profileReady) ? (
        <p role="status" className="mt-6">Opening your patient dashboard…</p>
      ) : user ? (
        <>
          {profileLoading ? <p role="status" className="mt-6 text-sm text-ink-soft">Finishing your patient profile…</p> : profileReady && <a href="/patient/dashboard" className="landing-cta mt-6 flex w-full items-center justify-center text-center">Open patient dashboard</a>}
          <form onSubmit={saveProfile} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-ink" htmlFor="profile-name">
              Full name
              <input id="profile-name" name="fullName" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={200} disabled={busy || profileLoading} className={inputClass} />
            </label>
            <button type="submit" disabled={busy || profileLoading} className="landing-cta w-full">
              {profileLoading ? 'Loading your profile…' : busy ? 'Please wait…' : 'Save name'}
            </button>
          </form>
          <button type="button" onClick={() => void signOut()} disabled={busy || profileLoading} className="landing-secondary mt-3 w-full">Sign out</button>
        </>
      ) : mode === 'signup' && verificationEmail ? (
        <>
          <form onSubmit={verifyEmail} className={registrationLayout ? 'mt-9 space-y-6' : 'mt-6 space-y-4'}>
            <p className="text-sm leading-relaxed text-ink-soft">Enter the verification code for <strong className="text-ink">{verificationEmail}</strong>. If the email contains a confirmation link, you can use that instead.</p>
            <label className="block text-sm font-medium text-ink" htmlFor="auth-verification-code">
              Email verification code
              <input id="auth-verification-code" name="verificationCode" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]+" title="Enter the digits from your verification email" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ''))} required disabled={busy} className={inputClass} />
            </label>
            <button type="submit" disabled={busy} className="landing-cta w-full">{busy ? 'Please wait…' : 'Create Account'}</button>
          </form>
          <button type="button" disabled={busy} onClick={() => void resendVerification()} className="mt-5 w-full text-sm font-semibold text-accent-700 underline underline-offset-4">Resend verification email</button>
          <p className="mt-5 text-center text-sm text-ink-soft">Already verified? <a href="/login" className="font-semibold text-accent-700 hover:underline">Sign in</a></p>
        </>
      ) : (
        <>
          <form onSubmit={submitAuth} className={registrationLayout ? 'mt-9 space-y-6' : loginLayout ? 'mt-8 space-y-5' : 'mt-6 space-y-4'}>
            {mode === 'signup' && patientDetails && !registrationLayout && <p className="rounded-xl bg-canvas-muted px-4 py-3 text-sm text-ink">Patient: <strong>{registrationName}</strong></p>}
            {mode === 'signup' && !patientDetails && (
              <label className="block text-sm font-medium text-ink" htmlFor="auth-name">
                Full name
                <input id="auth-name" name="fullName" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={200} disabled={busy} className={inputClass} />
              </label>
            )}
            <label className="block text-sm font-medium text-ink" htmlFor="auth-email">
              Email address
              <input id="auth-email" name="email" type="email" autoComplete="email" placeholder={registrationLayout ? 'Enter your email address' : undefined} value={email} onChange={(event) => setEmail(event.target.value)} required disabled={busy} className={inputClass} />
            </label>
            <div className="text-sm font-medium text-ink">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="auth-password">Password</label>
                {loginLayout && <button type="button" disabled={busy} onClick={() => void forgotPassword()} className="font-medium text-accent-700 hover:underline">Forgot password?</button>}
              </div>
              <span className="relative block">
                <input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder={registrationLayout ? mode === 'signup' ? 'Create a password' : 'Enter your password' : undefined} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === 'signup' ? 8 : undefined} disabled={busy} aria-describedby={mode === 'signup' ? 'password-help' : undefined} className={`${inputClass} ${registrationLayout || loginLayout ? 'pr-12' : ''}`} />
                {(registrationLayout || loginLayout) && <button type="button" disabled={busy} onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-accent-700">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{showPassword && <path d="M3 3l18 18" />}</svg>
                </button>}
              </span>
            </div>
            {mode === 'signup' && <p id="password-help" className="text-sm text-ink-soft">Use at least 8 characters.</p>}
            {mode === 'signup' && registrationLayout && <div className="flex items-start gap-2 text-sm leading-relaxed text-ink">
              <input id="auth-terms" name="terms" type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required disabled={busy} aria-label="I agree to the Terms and Conditions and acknowledge the Privacy Notice" className="mt-1 h-4 w-4 accent-accent-700" />
              <span><label htmlFor="auth-terms">I agree to the </label><a href="/terms" className="text-accent-700 underline underline-offset-2">Terms and Conditions</a> and acknowledge the <a href="/privacy" className="text-accent-700 underline underline-offset-2">Privacy Notice</a>.</span>
            </div>}
            <button type="submit" disabled={busy || (mode === 'signup' && registrationLayout && !acceptedTerms)} className="landing-cta w-full disabled:cursor-not-allowed">
              {busy ? 'Please wait…' : mode === 'signup' ? 'Send verification email' : loginLayout ? 'Sign in with password' : 'Sign in'}
              {mode === 'signup' && registrationLayout && <span aria-hidden="true" className="ml-2">›</span>}
            </button>
          </form>
          {mode === 'login' && (
            <>
              {loginLayout ? <div className="my-5 flex items-center gap-3 text-xs text-ink-soft" aria-hidden="true">
                <span className="h-px flex-1 bg-hairline" />Other methods<span className="h-px flex-1 bg-hairline" />
              </div> : <p className="my-5 text-center text-sm text-ink-soft">or</p>}
              <button type="button" disabled={busy} onClick={() => void signInWithGoogle()} className="landing-secondary flex w-full items-center justify-center gap-3">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                  <path fill="#4285F4" d="M21.6 12.23c0-.74-.07-1.45-.19-2.14H12v4.05h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.43Z" />
                  <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.58A10 10 0 0 0 12 22Z" />
                  <path fill="#FBBC05" d="M6.41 13.91a6 6 0 0 1 0-3.82V7.51H3.06a10 10 0 0 0 0 8.98l3.35-2.58Z" />
                  <path fill="#EA4335" d="M12 5.97c1.47 0 2.78.51 3.82 1.5l2.87-2.88A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.94 5.51l3.35 2.58C7.2 7.73 9.4 5.97 12 5.97Z" />
                </svg>
                {busy ? 'Please wait…' : 'Continue with Google'}
              </button>
            </>
          )}
          {loginLayout ? <p className="mt-5 text-center text-sm text-ink-soft">
            Don&apos;t have an account? <a href="/signup" className="font-semibold text-accent-700 hover:underline">Sign up</a>
          </p> : registrationLayout ? <p className="mt-9 text-center text-sm text-ink-soft">
            {mode === 'signup' ? 'Already have an account? ' : 'Need an account? '}
            <button type="button" disabled={busy} onClick={switchMode} className="font-semibold text-accent-700 hover:underline">{mode === 'signup' ? 'Sign in' : 'Register'}</button>
          </p> : <button type="button" disabled={busy} onClick={switchMode} className="mt-5 w-full text-sm font-semibold text-accent-700 underline underline-offset-4">
            {mode === 'signup' ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>}
        </>
      )}
    </>
  )
}
