import type { ReactNode } from 'react'

const pageNames = {
  '/login': 'Sign in',
  '/signup': 'Registration',
  '/faq': 'FAQ',
  '/terms': 'Terms and Conditions',
  '/privacy': 'Privacy Notice',
}

type FeatureLinkProps = {
  to: keyof typeof pageNames
  onUnavailable: (page: string) => void
  className?: string
  children: ReactNode
}

// These destinations will become links when their pages are implemented.
export function FeatureLink({ to, onUnavailable, className, children }: FeatureLinkProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => onUnavailable(pageNames[to])}
    >
      {children}
    </button>
  )
}
