"use client"
import { signIn } from 'next-auth/react'

export default function SignInButton(){
  return (
    <button
      onClick={() => signIn('google')}
      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded"
    >
      Sign in with Google
    </button>
  )
}
