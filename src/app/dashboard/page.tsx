'use server'

import { cookies } from 'next/headers'
import { decrypt } from '../lib/session';
import { decodeJwt } from 'jose';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiRequests } from '@/components/api-requests'

export default async function Dashboard() {
  const token = await decrypt((await cookies()).get('session')?.value);

  const decoded = decodeJwt(token?.accessToken as string);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Flexpa Quickstart</h1>
        <p className="text-xl mb-6">Patient Authorization</p>
        <p className="text-gray-600 mb-8">
          Congrats! By linking a health insurance plan, you have created a <a href="https://docs.flexpa.com/reference/patient-authorization" className="text-black font-semibold underline">Patient Authorization</a>.
          This represents a user&apos;s consent to share their health data with you.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Patient Authorization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[100px_1fr] gap-4">
              <div className="text-sm font-medium text-muted-foreground">ID</div>
              <div className="font-mono text-sm">{decoded.sub as string}</div>

              <div className="text-sm font-medium text-muted-foreground">Patient ID</div>
              <div className="font-mono text-sm">{decoded.patient as string}</div>

              <div className="text-sm font-medium text-muted-foreground">Access Token</div>
              <div className="font-mono text-sm whitespace-pre-wrap break-all">{token?.accessToken as string}</div>
            </div>
          </CardContent>
        </Card>

        <ApiRequests />
      </div>
    </div>
  )
}
