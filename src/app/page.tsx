'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { startOAuthFlow } from '@/lib/oauth';

export default function Home() {
  async function handleConnect() {
    const authUrl = await startOAuthFlow();
    window.location.href = authUrl;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Flexpa Quickstart</h1>
        <p className="text-xl mb-6">
          A sample end-to-end integration with Flexpa
        </p>
        <p className="text-gray-600 mb-8">
          The Flexpa consent flow begins when your user wants to connect their
          health insurance to your app. Click the button below to start the
          OAuth authorization flow - you will be redirected to Flexpa where you
          can select your health plan and authorize access to your claims data.
        </p>
        <Button onClick={handleConnect}>
          Launch Consent <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
