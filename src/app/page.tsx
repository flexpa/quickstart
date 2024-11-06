'use client'

import { LaunchLink } from '@/components/launch-link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Flexpa Quickstart</h1>
        <p className="text-xl mb-6">A sample end-to-end integration with Flexpa</p>
        <p className="text-gray-600 mb-8">
          The Flexpa consent flow begins when your user wants to connect their health insurance to your app. Simulate this by clicking
          the button below to launch Link - the client-side component that your users will interact with in order to link
          their health insurance to Flexpa and allow you to access their claims data via the Flexpa API.
        </p>
        <LaunchLink />
      </div>
    </div>
  )
}