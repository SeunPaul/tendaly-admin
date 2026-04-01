'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

const DEEP_LINK = 'tendaly://wallet/connect/refresh'

export default function ConnectRefreshPage() {
  useEffect(() => {
    window.location.href = DEEP_LINK
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="flex justify-center">
          <RefreshCw className="h-16 w-16 text-amber-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Link expired</h1>
        <p className="text-gray-500">
          The onboarding link has expired. Returning you to the app to get a fresh one…
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
