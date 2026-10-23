// Adapted from the original e-OPD LegalPages.jsx for this revision's implemented features.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LegalShell } from '../../components/common/PublicDocumentLayout'

function TermsContent() {
  return (
    <>
      <section>
        <h2>1. About e-OPD</h2>
        <p>
          e-OPD is the online outpatient portal of Balayan Bayview Hospital and Medical Center.
          This version currently provides account registration, email confirmation, sign-in,
          patient profile details, profile name editing, and sign-out. Its public FAQ and legal pages can be read
          without an account.
        </p>
      </section>

      <section>
        <h2>2. Accepting these terms</h2>
        <p>
          By creating an account or continuing to use e-OPD, you agree to these Terms and
          Conditions for the services currently available and acknowledge the Privacy Notice.
          If you act for another person, you must have authority to do so.
        </p>
      </section>

      <section>
        <h2>3. Accounts and security</h2>
        <ul>
          <li>Provide your own accurate name and an email address you can access.</li>
          <li>Confirm your email address before signing in and keep your password private.</li>
          <li>Do not use another person's account without lawful authority.</li>
          <li>Sign out after using a shared device and contact the hospital if you suspect unauthorized access.</li>
        </ul>
      </section>

      <section>
        <h2>4. Registration and hospital records</h2>
        <p>
          Both new and existing patients enter personal and contact details before account
          setup. Existing patients may also enter their last visit date and previous doctor.
          These details are self-reported. Selecting either option
          does not retrieve, verify, or connect an existing hospital record. Creating an
          account does not create a clinical patient record or register an outpatient visit.
        </p>
      </section>

      <section>
        <h2>5. Medical care and emergencies</h2>
        <p>
          e-OPD does not replace professional medical advice, diagnosis, treatment, or
          emergency services. This version does not provide online consultations.
          For urgent or life-threatening concerns, go to the nearest emergency department
          or contact local emergency services.
        </p>
      </section>

      <section>
        <h2>6. Appointments, payments and documents</h2>
        <p>
          Appointment requests and cancellations, live queues, billing, online payments,
          SMS notifications, and medical document requests are not available in this version.
          Creating an account or choosing a patient type does not book an appointment,
          reserve a queue position, make a payment, or request a document.
        </p>
      </section>

      <section>
        <h2>7. Acceptable use</h2>
        <p>You must not:</p>
        <ul>
          <li>submit false, misleading, unlawful, or harmful information;</li>
          <li>attempt to access another person's account or profile without authority;</li>
          <li>probe, disrupt, overload, or bypass the portal's security controls; or</li>
          <li>use the portal to impersonate another person or interfere with account services.</li>
        </ul>
      </section>

      <section>
        <h2>8. Availability and third-party services</h2>
        <p>
          Account services depend on internet access and Supabase authentication and
          database services. The website also loads its typeface from Google Fonts.
          Maintenance, network problems, or provider interruptions can affect availability.
        </p>
      </section>

      <section>
        <h2>9. Privacy</h2>
        <p>
          The <a href="/privacy">Privacy Notice</a> explains the account and profile
          information processed in this version, the services that receive it,
          the access controls in use, and how to raise a privacy request.
        </p>
      </section>

      <section>
        <h2>10. Account access and requests</h2>
        <p>
          You can sign in, edit your profile name, and sign out through the account form.
          Other patient details cannot currently be changed through the portal.
          You can request a password reset link from the sign-in page. Self-service
          account deletion is not yet available here. For account assistance or a privacy request, use the hospital
          contact channels listed in the Privacy Notice.
        </p>
      </section>

      <section>
        <h2>11. Changes and questions</h2>
        <p>
          These terms may change when the available services change. The last-updated
          date identifies this revision of the text. Questions may be directed to
          hospital administration or the OPD office through the hospital's official
          contact channels.
        </p>
      </section>
    </>
  )
}

function PrivacyContent() {
  return (
    <>
      <section>
        <h2>1. Who is responsible for your information</h2>
        <p>
          Balayan Bayview Hospital and Medical Center is responsible for information
          processed through its e-OPD portal. This notice covers the account registration,
          sign-in, and profile features currently available. Supabase supports
          authentication and storage of account and profile information.
        </p>
      </section>

      <section>
        <h2>2. Information we process</h2>
        <ul>
          <li>the full name and email address you submit when creating an account;</li>
          <li>your first, middle, and last names, optional suffix and gender, contact number, date of birth, and address;</li>
          <li>if you choose Existing hospital patient, an optional last visit date and previous doctor;</li>
          <li>the password submitted to Supabase Auth for registration or sign-in;</li>
          <li>account identifiers, email verification status, sign-in session information, and authentication security information handled by Supabase;</li>
          <li>your stored profile name, patient details, account identifier, and profile creation time; and</li>
          <li>technical request information needed to deliver and secure account services and website fonts.</li>
        </ul>
        <p>
          Patient details are included in account signup information and saved to an
          account-owned patient profile after confirmation and sign-in. The available forms
          do not request diagnoses, consultation notes, medical
          documents, billing information, payment details, identity documents, or
          hospital record numbers. Selecting a patient type does not retrieve or link
          a hospital record.
        </p>
      </section>

      <section>
        <h2>3. Why we process it</h2>
        <p>Account information is used to:</p>
        <ul>
          <li>create your account and confirm access to your email address;</li>
          <li>authenticate sign-in and maintain your account session;</li>
          <li>save and display your profile name and patient details;</li>
          <li>allow you to edit your profile name; and</li>
          <li>protect account access and investigate account or service problems.</li>
        </ul>
        <p>
          Processing is limited to these account-service and security purposes and
          must have an applicable lawful basis. This includes the steps you request
          to create and use an account and the legitimate interest in securing the
          service, subject to your rights. Consent is required where applicable.
          The <a href="https://privacy.gov.ph/data-privacy-act-/" target="_blank" rel="noreferrer">Data Privacy Act of 2012</a>
          {' '}sets out the requirements for lawful processing.
        </p>
      </section>

      <section>
        <h2>4. Who may receive information</h2>
        <p>
          Supabase receives registration and sign-in information, including patient
          details submitted during signup, and stores account and profile data. Authorized administrators may access information as
          needed to operate the service or respond to an account or privacy request.
          Other patient accounts cannot read or edit your profile through the portal.
        </p>
        <p>
          Your browser contacts Google Fonts to load the website's typeface. Google
          receives the network request information needed to deliver the font,
          including your IP address. See <a href="https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html" target="_blank" rel="noreferrer">Google Fonts privacy information</a>.
        </p>
        <p>
          This version does not send information to a payment gateway or an SMS service.
          Information may also be disclosed when a lawful requirement applies.
        </p>
      </section>

      <section>
        <h2>5. Storage and retention</h2>
        <p>
          Account and profile information, including patient details,
          is stored in Supabase. This portal does not
          automatically delete your account or profile after a set period and does
          not provide a self-service deletion control. Contact the hospital about
          retention or deletion requests. Retention must be limited to what is needed
          for the stated purposes and applicable obligations.
        </p>
      </section>

      <section>
        <h2>6. How information is protected</h2>
        <p>
          Supabase Auth checks sign-in credentials and email confirmation. Profile
          access rules restrict each signed-in patient account to its own profile and
          patient details.
          Requests to Supabase use HTTPS. The application does not store passwords
          in the profile table. Keep your password private and sign out after using
          a shared device.
        </p>
      </section>

      <section>
        <h2>7. Your data privacy rights</h2>
        <p>
          Subject to the applicable conditions, you may request information about
          processing, access your data, correct it, object to processing, seek erasure
          or blocking, and request portability. You may also seek available remedies
          or complain to the National Privacy Commission. Identity and authority may
          need to be verified before a request is acted on. Read the Commission's
          {' '}<a href="https://privacy.gov.ph/data-subject-rights/" target="_blank" rel="noreferrer">guide to data subject rights</a>.
        </p>
      </section>

      <section>
        <h2>8. Children and representatives</h2>
        <p>
          A parent, guardian, or other lawful representative may contact the hospital
          about privacy requests for a person they are authorized to represent.
          Proof of identity or authority may be required. This version does not
          provide separate dependent profiles or linked family accounts.
        </p>
      </section>

      <section>
        <h2>9. Browser storage and account sessions</h2>
        <p>
          Necessary browser storage keeps your sign-in session active and allows it
          to be restored when you return. Patient form entries remain in this page's
          memory until account setup is submitted or the page is closed. This portal does not add advertising or
          analytics tracking. Sign out through your account controls when you finish
          using a shared device.
        </p>
      </section>

      <section>
        <h2>10. Contact and complaints</h2>
        <p>
          For privacy questions or to exercise a right, ask that your request be
          routed to the hospital's Data Protection Officer through these hospital
          administration channels:
        </p>
        <ul>
          <li>Address: Brgy. Langgangan, Balayan, Batangas</li>
          <li>Telephone: <a href="tel:+63434073508">(043) 407-3508</a></li>
          <li>Email: <a href="mailto:balayanbayviewhospital@yahoo.com">balayanbayviewhospital@yahoo.com</a></li>
        </ul>
        <p>
          You may also contact or file a complaint with the
          {' '}<a href="https://privacy.gov.ph/" target="_blank" rel="noreferrer">National Privacy Commission</a>.
        </p>
      </section>

      <section>
        <h2>11. Changes to this notice</h2>
        <p>
          This notice will need to reflect any changes to the available services,
          information collected, providers, or safeguards. The last-updated date
          identifies the text currently displayed on this page.
        </p>
      </section>
    </>
  )
}

const legalDocuments = {
  terms: {
    eyebrow: 'Patient portal policy',
    title: 'Terms and Conditions',
    summary: 'Rules for the account registration, sign-in, and profile features currently available in e-OPD.',
    Content: TermsContent,
  },
  privacy: {
    eyebrow: 'Data privacy',
    title: 'Privacy Notice',
    summary: 'How Balayan Bayview Hospital and Medical Center processes account and profile information in this version of e-OPD.',
    Content: PrivacyContent,
  },
} as const

type LegalDocumentKey = keyof typeof legalDocuments

export function TermsPage() {
  const { Content, eyebrow, title, summary } = legalDocuments.terms
  return (
    <LegalShell
      eyebrow={eyebrow}
      title={title}
      summary={summary}
    >
      <Content />
    </LegalShell>
  )
}

export function PrivacyPage() {
  const { Content, eyebrow, title, summary } = legalDocuments.privacy
  return (
    <LegalShell
      eyebrow={eyebrow}
      title={title}
      summary={summary}
    >
      <Content />
    </LegalShell>
  )
}

function LegalDocumentModal({ documentKey, onClose }: { documentKey: LegalDocumentKey; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { Content, eyebrow, title, summary } = legalDocuments[documentKey]

  useEffect(() => {
    const dialog = dialogRef.current
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    closeButtonRef.current?.focus()

    return () => {
      if (dialog?.open) dialog.close()
      document.body.style.overflow = previousOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
    closeButtonRef.current?.focus()
  }, [documentKey])

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby="legal-modal-title"
      aria-describedby="legal-modal-summary"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
          onClose()
        }
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-3xl flex-col overflow-hidden rounded-2xl border border-hairline bg-white p-0 text-ink shadow-2xl backdrop:bg-black/60 open:flex sm:max-h-[calc(100dvh-3rem)]"
    >
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-accent-700">{eyebrow}</p>
          <h2 id="legal-modal-title" className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-ink-soft">Last updated: October 23, 2026</p>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-2xl text-ink-soft hover:bg-canvas-muted hover:text-ink"
        >
          ×
        </button>
      </header>
      <div ref={scrollRef} className="min-h-0 flex-1 overscroll-contain overflow-y-auto px-5 py-5 sm:px-6">
        <p id="legal-modal-summary" className="text-sm leading-6 text-ink-soft">{summary}</p>
        <div className="legal-document mt-5"><Content /></div>
      </div>
    </dialog>,
    document.body,
  )
}

export function LegalDocumentModalHost() {
  const [documentKey, setDocumentKey] = useState<LegalDocumentKey | null>(null)

  useEffect(() => {
    function openLegalLink(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!anchor) return
      const url = new URL(anchor.getAttribute('href') ?? '', window.location.href)
      if (url.origin !== window.location.origin) return
      const path = url.pathname.replace(/\/+$/, '')
      if (path !== '/terms' && path !== '/privacy') return

      event.preventDefault()
      setDocumentKey(path === '/terms' ? 'terms' : 'privacy')
    }

    document.addEventListener('click', openLegalLink, true)
    return () => document.removeEventListener('click', openLegalLink, true)
  }, [])

  return documentKey
    ? <LegalDocumentModal documentKey={documentKey} onClose={() => setDocumentKey(null)} />
    : null
}
