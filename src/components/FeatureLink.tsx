import type { ReactNode } from 'react'

type FeatureLinkProps = {
  to: '/login' | '/signup' | '/faq' | '/terms' | '/privacy'
  className?: string
  children: ReactNode
}

export function FeatureLink({ to, className, children }: FeatureLinkProps) {
  return <a href={to} className={className}>{children}</a>
}
