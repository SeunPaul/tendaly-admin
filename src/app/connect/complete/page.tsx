'use client'

import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

const DEEP_LINK = 'tendaly://wallet/connect/complete'

export default function ConnectCompletePage() {
  useEffect(() => {
    window.location.href = DEEP_LINK
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">You&apos;re all set!</h1>
        <p className="text-gray-500">
          Your payout account has been set up successfully. Returning you to the app…
        </p>
        <p className="text-sm text-gray-400">
          If the app did not open,{' '}
          <a href={DEEP_LINK} className="text-[#0099FF] underline">
            tap here
          </a>
          .
        </p>
      </div>
    </div>
  )
}
