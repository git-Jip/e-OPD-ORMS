import { FeatureLink } from "../components/FeatureLink";
import { HospitalLogo } from "../components/common/HospitalLogo";
import { LineIcon } from "../components/navigation/LineIcon";
import landingHospitalBg from "../assets/landing-hospital-bg.webp";
import { PublicNavbar } from "../components/navigation/PublicNavbar";

const capabilities = [
  {
    title: "Register for your visit",
    icon: "calendar",
    description:
      "Create a patient account, see which OPD doctors are available, and request an appointment without queueing at the counter.",
  },
  {
    title: "Follow your queue",
    icon: "queue",
    description:
      "Live queue visibility keeps patients and staff coordinated, and priority tagging helps staff identify qualified priority patients faster.",
  },
  {
    title: "Pay and collect",
    icon: "payment",
    description:
      "Follow the payment status of a visit, settle existing charges, and submit medical document requests until the hospital releases them.",
  },
] as const;

const steps = [
  {
    title: "Submit your appointment request",
    description:
      "Register or sign in, choose your patient details, and send your preferred OPD schedule.",
  },
  {
    title: "Wait for hospital confirmation",
    description:
      "The hospital team reviews your request, doctor availability, and visit details.",
  },
  {
    title: "Receive queue and visit updates",
    description:
      "After confirmation, follow queue movement, payments, and requests from your account.",
  },
];

const preparation = [
  "Use an active contact number for updates.",
  "Prepare your patient information and valid ID.",
  "Bring priority documents if you qualify.",
  "Review your appointment details before submitting.",
];

const section = "px-5 py-14 sm:px-6 sm:py-28 lg:px-8";
const shell = "mx-auto max-w-7xl";
const eyebrow = "text-base font-semibold text-accent-700";
const heading =
  "mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl";
const lede = "mt-4 text-lg leading-relaxed text-ink-soft";

const headingBlock = "mx-auto max-w-2xl text-center";

function Tick() {
  return (
    <svg
      aria-hidden="true"
      className="mt-1 h-5 w-5 shrink-0 text-brand-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LandingPage() {

  return (
    <main className="landing-page min-h-screen overflow-x-hidden bg-white text-ink">

      <PublicNavbar />

      <section id="main-content" tabIndex={-1} className={`public-header-offset ${section}`}>

        <div
          className={`${shell} grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]`}
        >
          <div>

            <h1 className="text-[2rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[2.75rem] lg:text-5xl">
              Balayan Bayview Hospital and Medical Center{" "}
              <span className="text-accent-600">Online OPD</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              A simpler way to request appointments, follow queue updates, and prepare for your hospital visit.
            </p>

            <FeatureLink to="/signup" className="landing-cta mt-8 inline-flex items-center justify-center">
              Create Account
            </FeatureLink>

          </div>

          <div className="-mx-5 overflow-hidden bg-canvas-muted sm:mx-0 sm:rounded-3xl lg:w-[50vw] lg:max-w-none lg:rounded-r-none">
            <img
              alt="Balayan Bayview Hospital and Medical Center"
              className="h-56 w-full object-cover object-[center_35%] sm:h-72 lg:h-[26rem]"
              decoding="async"
              fetchPriority="high"
              height="1083"
              src={landingHospitalBg}
              width="1452"
            />
          </div>
        </div>
      </section>

      <section
        id="what-you-can-do"
        className={`public-anchor-offset bg-canvas-muted ${section}`}
      >
        <div className={shell}>
          <div className={headingBlock}>
            <p className={eyebrow}>What you can do here</p>
            <h2 className={heading}>Patient services in one place.</h2>
            <p className={lede}>
              e-OPD brings registration, appointment requests, queue updates, payment status,
              and medical requests into one patient portal.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                key={capability.title}
                className="rounded-3xl bg-white p-6 sm:p-8"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-canvas-muted text-ink">
                  <LineIcon name={capability.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                  {capability.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`public-anchor-offset ${section}`}>
        <div className={shell}>
          <div className={headingBlock}>
            <p className={eyebrow}>How it works</p>
            <h2 className={heading}>What happens after you register</h2>
            <p className={lede}>
              The process is designed so patients know the next step after every
              appointment request.
            </p>
          </div>

          <ol className="mt-14 grid gap-10 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="text-center">
                <span className="text-2xl font-semibold tracking-tight text-accent-600">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="before-you-visit"
        className={`public-anchor-offset bg-canvas-muted ${section}`}
      >
        <div className={shell}>
          <div className={headingBlock}>
            <p className={eyebrow}>Before you visit</p>
            <h2 className={heading}>
              Prepare the details patients usually need.
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl gap-x-8 gap-y-5 text-left sm:grid-cols-2">
            {preparation.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Tick />
                <span className="text-lg leading-relaxed text-ink">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-ink-soft">
              Balayan-Batangas Rd, Balayan, Batangas
            </p>
            <HospitalLogo className="mx-auto mt-8 max-w-xs" />
          </div>
        </div>
      </section>

      <footer className="safe-area-footer border-t border-hairline bg-white px-5 py-10 text-center text-sm text-ink-soft sm:px-6 lg:px-8">
        <p>
          Copyright 2026 Balayan Bayview Hospital and Medical Center e-OPD.
          Secure outpatient appointment management.
        </p>

        <nav
          aria-label="Public pages"
          className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          <FeatureLink
            className="font-medium text-ink hover:text-accent-700"
            to="/terms"
          >
            Terms and Conditions
          </FeatureLink>
          <FeatureLink
            className="font-medium text-ink hover:text-accent-700"
            to="/privacy"
          >
            Privacy Notice
          </FeatureLink>
          <FeatureLink className="font-medium text-ink hover:text-accent-700" to="/faq">
            FAQ
          </FeatureLink>
        </nav>
      </footer>
    </main>
  );
}
