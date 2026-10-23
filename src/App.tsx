import { useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { GOOGLE_SIGN_IN_RETURN_KEY } from './components/AuthPanel'
import { LoginPage } from './pages/LoginPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SignUpPage } from './pages/SignUpPage'
import { FaqPage } from './pages/FaqPage'
import { PrivacyPage, TermsPage } from './pages/legal/LegalPages'
import { isPasswordRecoveryReturn, supabase } from './lib/supabase'
import './App.css'

function AuthReturn({ recovery = false }: { recovery?: boolean }) {
  useEffect(() => {
    void supabase.auth.getSession().catch(() => {}).finally(() => {
      if (!recovery) sessionStorage.removeItem(GOOGLE_SIGN_IN_RETURN_KEY)
      const fragment = new URLSearchParams(window.location.hash.slice(1))
      const errorFragment = fragment.has('error') ? window.location.hash : ''
      window.location.replace(`${recovery ? '/reset-password' : '/login'}${window.location.search}${errorFragment}`)
    })
  }, [recovery])

  return <p role="status" className="grid min-h-screen place-items-center text-ink">Finishing account verification…</p>
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '')

  if (path === '/login') {
    return <><a className="skip-link" href="#main-content">Skip to content</a><LoginPage /></>
  }

  if (path === '/reset-password') {
    return <><a className="skip-link" href="#main-content">Skip to content</a><ResetPasswordPage /></>
  }

  if (path === '/signup') {
    return (
      <>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SignUpPage />
      </>
    )
  }

  if (!path && isPasswordRecoveryReturn) {
    return <AuthReturn recovery />
  }

  if (!path && sessionStorage.getItem(GOOGLE_SIGN_IN_RETURN_KEY) === '1') {
    return <AuthReturn />
  }

  const Page = path === '/faq' ? FaqPage
    : path === '/terms' ? TermsPage
    : path === '/privacy' ? PrivacyPage
    : LandingPage

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Page />
    </>
  )
}

export default App
