'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import EverythingRequest from '@/components/api-requests/everything';
import PatientRequest from '@/components/api-requests/patient';
import EobRequest from '@/components/api-requests/eob';
import CoverageRequest from '@/components/api-requests/coverage';

export const handleCopyJson = (data: unknown) => {
  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
};

export function ApiRequests() {
  return (
    <>
      <p className="text-gray-600 my-4">
        With the access token, you can make all of the following requests:
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Claims data API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <EverythingRequest />
          <Separator />
          <PatientRequest />
          <Separator />
          <EobRequest />
          <Separator />
          <CoverageRequest />
        </CardContent>
      </Card>
    </>
  );
}
