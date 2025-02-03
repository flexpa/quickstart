'use client'

import FlexpaLink from '@flexpa/link'
import { ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export function LaunchLink() {
  const router = useRouter();

  function open() {
    FlexpaLink.create({
      publishableKey: process.env.NEXT_PUBLIC_FLEXPA_PUBLISHABLE_KEY!,
      usage: 'ONE_TIME',
      user: { externalId: crypto.randomUUID() },
      onSuccess: async (publicToken: string) => {
        await fetch('/api/exchange', { method: 'POST', body: JSON.stringify({ publicToken }) })
        router.push('/dashboard');
      }
    })

    FlexpaLink.open();
  }

  return (
    <Button onClick={() => open()}>
      Launch Link <ExternalLink className="ml-2 h-4 w-4" />
    </Button>
  )
}   