'use client';

import { Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Bundle, Coverage } from 'fhir/r4';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { handleCopyJson } from '@/components/api-requests';

export default function CoverageRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [coverageData, setCoverageData] = useState<Bundle<Coverage> | null>(
    null
  );

  const handleCoverageRequest = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fhir/Patient');
      const data = await response.json();
      console.log('Coverage data:', data);
      setCoverageData(data);
    } catch (error) {
      console.error('Error fetching coverage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge variant="outline">GET</Badge>
            <span className="font-semibold">Patient</span>
            <span className="text-muted-foreground font-mono text-sm">
              /fhir/Coverage
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Retrieve coverage information for the patient.
          </p>
        </div>
        {coverageData ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleCopyJson(coverageData)}
            >
              <Copy className="h-4 w-4" />
              Copy JSON
            </Button>
          </div>
        ) : (
          <Button onClick={handleCoverageRequest} disabled={isLoading}>
            Send request
          </Button>
        )}
      </div>

      {coverageData && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coverageData?.entry?.map((entry) => (
              <TableRow key={entry?.resource?.id}>
                <TableCell>{entry?.resource?.status}</TableCell>
                <TableCell>{entry?.resource?.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}