import { useEffect, useRef, useState } from 'react'
import { HospitalLogo } from '../common/HospitalLogo'
import { FeatureLink } from '../FeatureLink'
import { LineIcon } from './LineIcon'

const sections = [
  { label: 'What you can do', href: '#what-you-can-do' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Before you visit', href: '#before-you-visit' },
]

export function PublicNavbar({ onUnavailable }: { onUnavailable: (page: string) => void }) {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    function closeOutside(event: MouseEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <header ref={headerRef} className="public-navbar public-navbar-solid">
      <div className="public-navbar-bar relative mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8 lg:py-4">
        <a href="/" aria-label="e-OPD home" className="flex min-w-0 items-center">
          <HospitalLogo plated={false} className="h-12 lg:h-14" />
        </a>

        <nav aria-label="Site sections" className="hidden items-center gap-1 lg:flex">
          {sections.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-medium text-ink transition hover:bg-black/5">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <FeatureLink to="/faq" onUnavailable={onUnavailable} className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-black/5 sm:inline-flex">
            FAQ
          </FeatureLink>
          <FeatureLink to="/login" onUnavailable={onUnavailable} className="inline-flex rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-black/5">
            Sign In
          </FeatureLink>
          <FeatureLink to="/signup" onUnavailable={onUnavailable} className="landing-cta hidden px-5 py-2.5 text-sm lg:inline-flex">
            Get Started
          </FeatureLink>
          <button
            ref={toggleRef}
            type="button"
            aria-controls="public-navbar-panel"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((current) => !current)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink transition hover:bg-black/5 sm:h-11 sm:w-11 lg:hidden"
          >
            <LineIcon name={open ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div id="public-navbar-panel" className="public-navbar-panel relative lg:hidden">
          <nav aria-label="Mobile site sections" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pb-4 pt-2 sm:px-6">
            {sections.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-ink transition hover:bg-black/5">
                {item.label}
              </a>
            ))}
            <FeatureLink to="/faq" onUnavailable={onUnavailable} className="rounded-xl px-4 py-3 text-left text-base font-medium text-ink transition hover:bg-black/5">
              FAQ
            </FeatureLink>
          </nav>
        </div>
      )}
    </header>
  )
}
