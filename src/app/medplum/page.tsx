'use server'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MedplumSync from '@/components/medplum-sync';

export default async function Dashboard() {
  await decrypt((await cookies()).get('session')?.value);

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Medplum Sync</h1>
          <p className="text-xl text-muted-foreground">
            Synchronize your health data with Medplum
          </p>
        </div>

        <div className="prose max-w-none">
          <p>
            The Medplum Sync feature allows you to synchronize your health records from Flexpa to your Medplum instance.
            This enables you to maintain a consistent view of patient data across both platforms while leveraging
            Medplum&apos;s powerful data management capabilities.
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Sync Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <MedplumSync />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
