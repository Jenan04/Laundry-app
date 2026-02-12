import { Suspense } from 'react'
import EmailVerification from "./EmailVerification";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerification /> 
    </Suspense>
  )
}