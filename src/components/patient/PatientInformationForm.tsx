import { useState } from 'react'
import type { ChangeEvent, FormEvent, HTMLInputTypeAttribute } from 'react'

export type PatientDetails = {
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  contactNumber: string
  gender: '' | 'Female' | 'Male'
  dateOfBirth: string
  addressLine: string
  lastHospitalVisitDate: string
  previousHospitalDoctor: string
}

const emptyDetails: PatientDetails = {
  firstName: '', middleName: '', lastName: '', suffix: '',
  contactNumber: '', gender: '', dateOfBirth: '', addressLine: '',
  lastHospitalVisitDate: '', previousHospitalDoctor: '',
}

const contactNumberPattern = /^[0-9]{11}$/
const nameNumberPattern = /\p{N}/u

function localDate(offsetDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function validPastDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value >= localDate()) return false
  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime()) && localDateFrom(date) === value
}

function localDateFrom(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

type FieldName = Exclude<keyof PatientDetails, 'gender'>
type FieldErrors = Partial<Record<FieldName, string>>

function validate(details: PatientDetails, isExisting: boolean): FieldErrors {
  const errors: FieldErrors = {}
  if (details.firstName.trim().length < 2) errors.firstName = 'First name must contain at least 2 characters.'
  if (details.lastName.trim().length < 2) errors.lastName = 'Last name must contain at least 2 characters.'
  for (const [name, label] of [
    ['firstName', 'First name'],
    ['middleName', 'Middle name'],
    ['lastName', 'Last name'],
    ['suffix', 'Suffix'],
  ] as const) {
    if (nameNumberPattern.test(details[name])) errors[name] = `${label} cannot contain numbers.`
  }
  if ([details.firstName, details.middleName, details.lastName, details.suffix].map((part) => part.trim()).filter(Boolean).join(' ').length > 200) {
    errors.firstName = 'Full name must contain 200 characters or fewer.'
  }
  if (!contactNumberPattern.test(details.contactNumber.trim())) errors.contactNumber = 'Enter an 11-digit contact number.'
  if (!validPastDate(details.dateOfBirth)) errors.dateOfBirth = 'Enter a birth date before today.'
  if (details.addressLine.trim().length < 5) errors.addressLine = 'Address must contain at least 5 characters.'
  if (isExisting && details.lastHospitalVisitDate && !validPastDate(details.lastHospitalVisitDate)) {
    errors.lastHospitalVisitDate = 'Last visit date must be before today.'
  } else if (isExisting && details.lastHospitalVisitDate && details.lastHospitalVisitDate < details.dateOfBirth) {
    errors.lastHospitalVisitDate = 'Last visit date cannot be before your birth date.'
  }
  const limits: Partial<Record<FieldName, number>> = {
    firstName: 100, middleName: 100, lastName: 100, suffix: 20,
    addressLine: 255, previousHospitalDoctor: 100,
  }
  for (const [name, limit] of Object.entries(limits) as [FieldName, number][]) {
    if (details[name].trim().length > limit) errors[name] = `Use ${limit} characters or fewer.`
  }
  return errors
}

type PatientFieldProps = {
  label: string
  name: FieldName
  value: string
  error?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  type?: HTMLInputTypeAttribute
  required?: boolean
  maxLength?: number
  max?: string
  className?: string
}

function PatientField({ label, name, value, error, onChange, type = 'text', required, maxLength, max, className = '' }: PatientFieldProps) {
  return (
    <label className={`block text-sm font-semibold text-ink ${className}`} htmlFor={`patient-${name}`}>
      {label}
      <input
        id={`patient-${name}`} name={name} type={type} inputMode={type === 'tel' ? 'numeric' : undefined}
        autoComplete="off" value={value} onChange={onChange} required={required}
        maxLength={maxLength} max={max} aria-invalid={!!error}
        aria-describedby={error ? `patient-${name}-error` : undefined}
        className="mt-2 w-full rounded-xl border border-hairline bg-white px-4 py-3 text-ink focus:outline-2 focus:outline-accent-700"
      />
      {error && <span id={`patient-${name}-error`} className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  )
}

type PatientInformationFormProps = {
  patientType: 'new' | 'existing'
  initialDetails: PatientDetails | null
  onBack: (details: PatientDetails) => void
  onContinue: (details: PatientDetails) => void
}

export function PatientInformationForm({ patientType, initialDetails, onBack, onContinue }: PatientInformationFormProps) {
  const [details, setDetails] = useState<PatientDetails>(initialDetails ?? emptyDetails)
  const [errors, setErrors] = useState<FieldErrors>({})

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const name = event.target.name as keyof PatientDetails
    setDetails((current) => ({ ...current, [name]: event.target.value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(details, patientType === 'existing')
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const normalized = Object.fromEntries(Object.entries(details).map(([key, value]) => [key, value.trim()])) as PatientDetails
    onContinue(patientType === 'existing' ? normalized : {
      ...normalized, lastHospitalVisitDate: '', previousHospitalDoctor: '',
    })
  }

  const field = (name: FieldName) => ({ value: details[name], error: errors[name], onChange: updateField })

  return (
    <section aria-labelledby="patient-information-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent-700">{patientType === 'new' ? 'New patient' : 'Existing hospital patient'}</p>
          <h2 id="patient-information-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink">Patient information</h2>
        </div>
        <button type="button" onClick={() => onBack(details)} className="text-sm font-semibold text-accent-700 underline underline-offset-2">Back to patient type</button>
      </div>

      <form onSubmit={submit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
        <PatientField label="First name" name="firstName" required maxLength={100} {...field('firstName')} />
        <PatientField label="Middle name" name="middleName" maxLength={100} {...field('middleName')} />
        <PatientField label="Last name" name="lastName" required maxLength={100} {...field('lastName')} />
        <PatientField label="Suffix" name="suffix" maxLength={20} {...field('suffix')} />
        <PatientField label="Contact number" name="contactNumber" type="tel" required maxLength={11} {...field('contactNumber')} />
        <label className="block text-sm font-semibold text-ink" htmlFor="patient-gender">
          Gender
          <select id="patient-gender" name="gender" value={details.gender} onChange={updateField} className="mt-2 w-full rounded-xl border border-hairline bg-white px-4 py-3 text-ink focus:outline-2 focus:outline-accent-700">
            <option value="">Prefer not to say</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </label>
        <PatientField label="Date of birth" name="dateOfBirth" type="date" required max={localDate(-1)} {...field('dateOfBirth')} />
        <PatientField label="Address" name="addressLine" required maxLength={255} className="sm:col-span-2" {...field('addressLine')} />
        {patientType === 'existing' && (
          <>
            <PatientField label="Last visit date" name="lastHospitalVisitDate" type="date" max={localDate(-1)} {...field('lastHospitalVisitDate')} />
            <PatientField label="Previous doctor" name="previousHospitalDoctor" maxLength={100} {...field('previousHospitalDoctor')} />
          </>
        )}
        <button type="submit" className="landing-cta w-full sm:col-span-2">Continue to account setup</button>
      </form>
    </section>
  )
}
