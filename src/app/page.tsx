'use client';

import { ExternalLink, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type ConsentFlow, startOAuthFlow } from '@/lib/oauth';

export default function Home() {
  async function handleConnect(flow: ConsentFlow) {
    const authUrl = await startOAuthFlow(flow);
    window.location.href = authUrl;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Flexpa Quickstart</h1>
        <p className="text-xl mb-6">
          A sample end-to-end integration with Flexpa
        </p>
        <p className="text-gray-600 mb-8">
          The Flexpa consent flow begins when your user wants to connect their
          health data to your app. Choose how they start below. Either way they
          are redirected to Flexpa to authorize access, then sent back here.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <Search className="h-6 w-6 mb-2 text-gray-700" />
              <CardTitle className="text-xl">Search</CardTitle>
              <CardDescription>
                The patient searches by health plan, provider, or facility and
                connects to each one directly. They can link several sources in
                a single session, with no identity verification step. Best when
                they already know where their records live.
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button onClick={() => handleConnect('search')}>
                Launch Search <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <ShieldCheck className="h-6 w-6 mb-2 text-gray-700" />
              <CardTitle className="text-xl">
                Identity verification (IAL2)
              </CardTitle>
              <CardDescription>
                The patient verifies their identity once with CLEAR, ID.me, or
                Persona. Flexpa then automatically finds and connects their
                records across tens of thousands of facilities nationwide. Best
                for broad coverage without hunting down each source.
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button onClick={() => handleConnect('ial2')}>
                Verify Identity <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
