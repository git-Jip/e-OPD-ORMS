// Adapted from the original e-OPD FAQ for this revision's implemented features.
import { LegalShell } from '../components/common/PublicDocumentLayout'

const FAQ_GROUPS = [
  {
    heading: 'Registration',
    questions: [
      {
        question: 'Do I need an account to use e-OPD?',
        answer: 'You can read the public pages without signing in. Create an account and confirm your email address to use the account and profile features.',
      },
      {
        question: 'How do I create an account?',
        answer: 'Select Create Account on the landing page and choose your patient type. Enter your name, contact number, birth date, optional gender, and address. Existing hospital patients may also enter their last visit date and previous doctor. Then enter your email and a password with at least 8 characters, review the Terms and Privacy Notice, and request a verification email. Enter its code and select Create Account, or use the confirmation link in the email. Your patient profile is saved after verification.',
      },
      {
        question: 'Does choosing Existing hospital patient link my hospital record?',
        answer: 'No. The details you enter create an online account profile. Last visit date and previous doctor are supplied by you and do not verify or link an existing hospital record.',
      },
      {
        question: 'Why do I need to confirm my email address?',
        answer: 'Email confirmation checks that you can access the email address used for your account. You must confirm it before signing in.',
      },
    ],
  },
  {
    heading: 'Your account',
    questions: [
      {
        question: 'How do I sign in?',
        answer: 'Select Sign In in the header and use your registered email address and password. If you are already signed in, your account controls appear instead of the sign-in form.',
      },
      {
        question: 'Can I update my details?',
        answer: 'Open your account controls, edit Full name, and select Save name. Other patient details and your email address cannot be edited through this version. Contact the hospital if those details need correction.',
      },
      {
        question: 'Will I stay signed in?',
        answer: 'Your sign-in session is stored in the browser so it can be restored when you return. Use Sign out in your account controls when you finish on a shared device.',
      },
      {
        question: 'Can I reset my password or delete my account here?',
        answer: 'Use Forgot password on the sign-in page to request a password reset link. This version does not provide self-service account deletion. For account assistance or a privacy request, use the hospital contact channels in the Privacy Notice.',
      },
      {
        question: 'Who can see or change my profile?',
        answer: 'Your account is required to read or edit your profile. Other patient accounts cannot read or change it through the portal. Authorized administrators may access information when needed to operate the service or handle a request.',
      },
    ],
  },
  {
    heading: 'Appointments, payments and documents',
    questions: [
      {
        question: 'Can I request or cancel an appointment?',
        answer: 'Not yet. Appointment requests and cancellations are not available in this version. Creating an online account does not book an appointment or register a hospital visit.',
      },
      {
        question: 'Can I see my queue position or receive text updates?',
        answer: 'Not yet. Live queue information and SMS notifications are not available in this version.',
      },
      {
        question: 'Can I pay online or request a medical document?',
        answer: 'Not yet. Billing, online payments, and medical document requests are not available in this version. The current account forms do not process payments or document requests.',
      },
      {
        question: 'Can I use e-OPD in an emergency?',
        answer: 'No. e-OPD does not provide emergency care or replace professional medical advice. For urgent or life-threatening concerns, go to the nearest emergency department or contact local emergency services.',
      },
    ],
  },
]

export function FaqPage() {
  return (
    <LegalShell
      eyebrow="Help"
      title="Frequently asked questions"
      summary="Help with registration, sign-in, and your profile, plus the availability of outpatient services in this version."
      meta={null}
    >
      {FAQ_GROUPS.map((group) => (
        <section key={group.heading}>
          <h2>{group.heading}</h2>
          {group.questions.map((item) => (
            <details key={item.question} className="mt-4">
              <summary className="cursor-pointer list-item font-semibold text-ink marker:text-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
                {item.question}
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </section>
      ))}
    </LegalShell>
  )
}
