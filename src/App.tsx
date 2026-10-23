import { useRef, useState } from 'react'
import { LandingPage } from './pages/LandingPage'
import './App.css'

function App() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [pendingPage, setPendingPage] = useState('')

  function showUnavailable(page: string) {
    setPendingPage(page)
    dialogRef.current?.showModal()
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <LandingPage onUnavailable={showUnavailable} />
      <dialog ref={dialogRef} className="preview-dialog" aria-labelledby="preview-title" aria-describedby="preview-description">
        <h2 id="preview-title" className="text-2xl font-semibold tracking-tight text-ink">
          {pendingPage} is not available yet
        </h2>
        <p id="preview-description" className="mt-4 leading-relaxed text-ink-soft">
          This part of the patient portal is still being prepared. You can
          continue exploring the landing page.
        </p>
        <form method="dialog" className="mt-6">
          <button type="submit" className="landing-cta">Back to the page</button>
        </form>
      </dialog>
    </>
  )
}

export default App
