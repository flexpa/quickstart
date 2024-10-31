'use client'

import FlexpaLink from '@flexpa/link'
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'


export default function Home() {
  const router = useRouter();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [usage, setUsage] = useState<'ONE_TIME' | 'ONGOING'>('ONE_TIME');
  const [externalId, setExternalId] = useState('usr_1234');
  const [error, setError] = useState<string | null>(null);

  function open() {
    FlexpaLink.create({
      publishableKey: process.env.NEXT_PUBLIC_FLEXPA_PUBLISHABLE_KEY!,
      user: {
        externalId
      },
      usage,
      onSuccess: async (publicToken: string) => {
        const response = await fetch('/api/exchange', {
          method: 'POST',
          body: JSON.stringify({ publicToken })
        })
        if (response.ok) {
          router.push('/dashboard');
        } else {
          setError('Failed to connect, try again.');
        }
      }
    })

    FlexpaLink.open();
  }

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
        <Button onClick={() => open()}>
          Launch Link
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <div className="mt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {showAdvanced ? 'Hide' : 'Show'} advanced options
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Usage Type</label>

                <Select value={usage} onValueChange={(value) => setUsage(value as 'ONE_TIME' | 'ONGOING')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONE_TIME">One Time</SelectItem>
                    <SelectItem value="Multiple">Multiple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">External User ID</label>
                <Input
                  type="text"
                  value={externalId}
                  onChange={(e) => setExternalId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}