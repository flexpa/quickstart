'use client';

import { Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Bundle } from 'fhir/r4';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { handleCopyJson } from '@/components/api-requests';

const getResourceCounts = (bundle: Bundle) => {
  const counts: Record<string, number> = {};

  bundle.entry?.forEach((entry) => {
    const resourceType = entry.resource?.resourceType;
    if (resourceType) {
      counts[resourceType] = (counts[resourceType] || 0) + 1;
    }
  });

  return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
};

export default function Everything() {
  const [isLoading, setIsLoading] = useState(false);
  const [everythingData, setEverythingData] = useState<Bundle | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const handleEverythingRequest = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fhir/Patient/$everything');
      const data = await response.json();
      console.log('Everything data:', data);
      setEverythingData(data);
    } catch (error) {
      console.error('Error fetching everything data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    handleCopyJson(everythingData);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge variant="outline">GET</Badge>
            <span className="font-semibold">$everything</span>
          </div>
          <span className="text-muted-foreground font-mono text-sm">
            /fhir/Patient/$PATIENT_ID/$everything
          </span>
          <p className="text-sm text-muted-foreground">
            Retrieve all of the patient data in one request.
          </p>
        </div>
        {everythingData ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCopy}
            >
              {hasCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={handleEverythingRequest} disabled={isLoading}>
            Send request
          </Button>
        )}
      </div>
      {everythingData && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource Type</TableHead>
              <TableHead className="text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getResourceCounts(everythingData).map(([resourceType, count]) => (
              <TableRow key={resourceType}>
                <TableCell>{resourceType}</TableCell>
                <TableCell className="text-right">{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="font-bold">
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell className="text-right">
                {everythingData?.entry?.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}
