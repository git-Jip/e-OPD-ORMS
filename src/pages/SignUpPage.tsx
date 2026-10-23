import { useState } from 'react'
import { AuthPanel } from '../components/AuthPanel'
import { HospitalLogo } from '../components/common/HospitalLogo'
import { LegalLinks } from '../components/common/LegalLinks'
import { PatientInformationForm } from '../components/patient/PatientInformationForm'
import type { PatientDetails } from '../components/patient/PatientInformationForm'
import hospitalPhoto from '../assets/landing-hospital-bg.webp'

const patientChoices = [
  {
    type: 'new',
    title: 'New patient',
    description: 'I have not visited this hospital before.',
  },
  {
    type: 'existing',
    title: 'Existing hospital patient',
    description: 'I have visited this hospital before.',
  },
] as const

type PatientType = typeof patientChoices[number]['type']

export function SignUpPage() {
  const [patientType, setPatientType] = useState<PatientType | null>(null)
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')
  const [accountStep, setAccountStep] = useState(false)
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null)
  const [verificationPending, setVerificationPending] = useState(false)

  function returnToChoices() {
    setPatientType(null)
    setAuthMode('signup')
    setAccountStep(false)
  }

  return (
    <div className="signup-page min-h-screen bg-white text-ink">
      <header className="signup-header">
        <a href="/" aria-label="e-OPD home" className="inline-flex items-center gap-4">
          <HospitalLogo plated={false} className="h-12" />
          <span className="text-2xl font-medium tracking-tight">e-OPD</span>
        </a>
      </header>

      <main id="main-content" tabIndex={-1} className="signup-layout">
        <section className="signup-intro" aria-labelledby="signup-title">
          <div className="mx-auto w-full max-w-[40rem]">
            <p className="text-lg font-semibold text-accent-700">Patient registration</p>
            <h1 id="signup-title" className="signup-title mt-4 font-semibold tracking-tight">
              Create your<br />e-OPD account
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft sm:text-xl">
              Register once to save your patient information and manage your
              e-OPD account.
            </p>

            <img
              src={hospitalPhoto}
              alt="Balayan Bayview Hospital and Medical Center"
              width="1452"
              height="1083"
              fetchPriority="high"
              className="mt-9 aspect-video w-full rounded-3xl object-cover"
            />

          </div>
        </section>

        <section className="signup-content" aria-labelledby={patientType && !accountStep ? 'patient-information-heading' : patientType ? 'preview-title' : 'patient-choice-title'}>
          <div className="w-full max-w-[46.25rem]">
            {patientType && !accountStep ? (
              <PatientInformationForm
                patientType={patientType}
                initialDetails={patientDetails}
                onBack={(details) => { setPatientDetails(details); returnToChoices() }}
                onContinue={(details) => { setPatientDetails(details); setAccountStep(true) }}
              />
            ) : patientType ? (
              <div>
                <div className="signup-account-summary">
                  <span className="font-medium">{patientChoices.find((choice) => choice.type === patientType)?.title}</span>
                  {!verificationPending && <button type="button" onClick={() => setAccountStep(false)} className="font-semibold text-accent-700 underline underline-offset-2">Edit patient information</button>}
                </div>
                <div className="mx-auto mt-6 w-full max-w-[30.75rem]">
                  <AuthPanel mode={authMode} onModeChange={setAuthMode} onVerificationPendingChange={setVerificationPending} patientDetails={patientDetails} patientType={patientType} registrationLayout redirectAuthenticated />
                </div>
              </div>
            ) : (
              <>
                <p className="font-semibold text-accent-700">Patient registration</p>
                <h2 id="patient-choice-title" className="mt-4 text-2xl font-semibold leading-tight tracking-tight sm:text-[1.75rem]">
                  Have you visited this hospital before?
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  Choose one to continue creating your e-OPD account.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {patientChoices.map((choice) => (
                    <button key={choice.type} type="button" onClick={() => { setPatientType(choice.type); setAuthMode('signup'); setAccountStep(false) }} className="signup-choice">
                      <span className="block font-semibold text-ink">{choice.title}</span>
                      <span className="mt-2 block text-sm leading-relaxed text-ink-soft">{choice.description}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <footer className="border-t border-hairline px-5 py-6 text-sm">
        <LegalLinks />
      </footer>
    </div>
  )
}
