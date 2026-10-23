export function LegalLinks({ className = '' }: { className?: string }) {
  return (
    <nav aria-label="Public pages" className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 ${className}`}>
      <a href="/terms" className="font-semibold text-brand-600 underline-offset-4 hover:underline">Terms and Conditions</a>
      <a href="/privacy" className="font-semibold text-brand-600 underline-offset-4 hover:underline">Privacy Notice</a>
      <a href="/faq" className="font-semibold text-brand-600 underline-offset-4 hover:underline">FAQ</a>
    </nav>
  )
}
