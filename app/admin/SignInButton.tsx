"use client"
import { signIn } from 'next-auth/react'

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn('google')}
      className="neo-btn neo-btn-blue mt-4 px-5 py-3 uppercase tracking-wide"
    >
      Sign in with Google
    </button>
  )
}
