# e-OPD

Frontend foundation for the e-OPD outpatient management application, built with
React, TypeScript, Vite, and Tailwind CSS.

The public landing page uses the original e-OPD content, hospital photograph,
hospital logo, typography, colors, and responsive layout.

## Requirements

- Node.js 20.19+ on the 20.x release line, or Node.js 22.12 and newer.
- npm (included with Node.js).

This project was verified with Node.js 24.11.1 and npm 11.6.2.

## Get started

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`
before starting the server. Use the publishable key from the intended Supabase
project. The checked-out local setup connects to **e-OPD-ORMS**.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with hot reload. |
| `npm run build` | Check TypeScript and create a production build in `dist/`. |
| `npm run lint` | Check the source with Oxlint and React rules. |
| `npm run preview` | Serve the production build locally after building. |

## Project structure

```text
public/             Static assets served directly, including the favicon
src/
  assets/           Original hospital photograph and logo
  components/       Hospital branding, public navigation, and shared controls
  pages/            Landing, registration, FAQ, and legal pages
  lib/              Supabase client and generated database types
  App.tsx           Public page entry point
  App.css           Public header, controls, and responsive styles
  index.css         Tailwind import, shared styles, and color tokens
  main.tsx          React entry point
index.html          HTML entry point and page metadata
vite.config.ts      Vite configuration
tsconfig*.json      TypeScript configuration
.oxlintrc.json      Lint configuration
```

## Current scope

The landing page includes the hospital introduction, patient services,
appointment steps, visit preparation, and footer. Section links and the mobile
menu work. Create Account opens `/signup`, with hospital branding and a choice between
new and existing hospital patients. Both choices collect name, contact number,
birth date, optional gender, and address before account setup. Existing patients
may also provide their last visit date and previous doctor. Neither choice verifies or links
hospital records. Both forms continue to a Supabase email/password account step
with a patient-type summary, a required Terms and Conditions acknowledgement,
and links that open the Terms and Privacy Notice in an in-page dialog. After
submitting the details, patients enter the email verification code before the
patient profile is created. The confirmation link remains an alternative.
The direct `/terms` and `/privacy` URLs remain available. Sign-in opens `/login` with password and Google
options; there is no email-code sign-in option. Both account surfaces support email
confirmation, session restoration, local sign-out, and editing the signed-in
user's full name. The signed-in account view links to `/patient/dashboard`.
The dashboard uses the account's saved name and shows clearly labeled empty
states for appointments, queues, payments, and medical requests; those services
do not have data or actions yet. FAQ, Terms and Conditions, and Privacy Notice are available
at `/faq`, `/terms`, and `/privacy`, with links from the landing page and signup
footer. Their content is adapted from the original Desktop/e-OPD project's
`client/src/pages/FaqPage.jsx` and `client/src/pages/legal/LegalPages.jsx`.
The text describes this revision's account features and identifies unavailable
outpatient services. It does not claim that the original system's payment,
SMS, staff-role, MFA, or audit workflows exist here. The privacy notice covers
the current Supabase account/profile data, patient details, and Google Fonts requests, with
links to official privacy information. Legal pages carry a last-updated date;
the FAQ has no legal effective-date line.

The signup and sign-in pages support direct navigation and reloads. A static deployment
must rewrite `/signup`, `/login`, `/account`, `/reset-password`, `/patient/dashboard`, `/faq`, `/terms`, and `/privacy` (including trailing-slash
variants) to `/index.html` with status 200.

The `public.profiles` table was created directly in the Supabase SQL Editor,
without a migration file. It contains the Auth user ID, full name, and creation
time. RLS restricts select, insert, and update operations to the signed-in user's
own row; anonymous access is revoked. The profile is created when a confirmed
user opens an account form, using the signup name as display data only.
The `public.patient_profiles` table was also created directly in the SQL Editor.
It holds the details from either patient-information form, including optional
last-visit details for existing patients, and restricts read and insert
access to the signed-in account owner. There is no public or anonymous access,
and the portal does not provide online editing for these details. Signup carries
the details through Supabase Auth metadata until a confirmed user signs in and
the account form saves the row. If saving fails, opening the account form again
retries it. The table is an online account profile, not a hospital patient record.
Staff roles and permissions are not stored in user-editable metadata.

Supabase Auth's Site URL is `http://localhost:5173`, with
`http://localhost:5173/` allowed as a redirect. Google sign-in returns to that
root URL and then opens `/login` after Supabase restores the session. Password
recovery also returns to the allowed root URL before opening `/reset-password`.
Update the Site URL and add the deployed site's exact root URL when deploying.
Keep email confirmation enabled. In Supabase Authentication > Email Templates >
Confirm sign up, include `{{ .Token }}` so the verification code is present in
the email. Keep `{{ .ConfirmationURL }}` if patients should also be able to use
the confirmation link. The first signup request creates a pending Supabase Auth
user; the public patient profile is saved after email verification when the
confirmed user opens the account form. If email confirmation is disabled, Supabase can grant a
session immediately, which bypasses this intended verification step. The
default Supabase email service has delivery restrictions; configure custom SMTP
before opening registration to patients.

Appointment requests, queues, clinical patient records, payments, and
medical document workflows have not been implemented. Account registration
does not submit an appointment or create a clinical patient record.

To verify a new installation, create and confirm an account, sign in, save a
name, and reopen `/login` to check persistence. Use a second account to
confirm that profiles remain isolated. The SQL Editor runs with privileged
access and is not an authorization test by itself.

The Manrope font loads from Google Fonts, with system fonts as a fallback.

Keep secrets out of frontend code. Vite variables prefixed with `VITE_` are
included in the browser bundle and must never contain private credentials.

`node_modules/`, `dist/`, and local environment files are ignored by Git.
Commit `package-lock.json` with dependency changes; use `npm ci` for clean,
reproducible installs.
