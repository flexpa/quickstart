'use client';

import { Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Bundle, ExplanationOfBenefit } from 'fhir/r4';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { handleCopyJson } from '@/components/api-requests';

export default function EobRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [eobData, setEobData] = useState<Bundle<ExplanationOfBenefit> | null>(
    null
  );
  const [hasCopied, setHasCopied] = useState(false);

  const handleEobRequest = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fhir/ExplanationOfBenefit');
      const data = await response.json();
      console.log('EOB data:', data);
      setEobData(data);
    } catch (error) {
      console.error('Error fetching EOB data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    handleCopyJson(eobData);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge variant="outline">GET</Badge>
            <span className="font-semibold">EOB</span>
          </div>
          <span className="text-muted-foreground font-mono text-sm">
            /fhir/ExplanationOfBenefit
          </span>
          <p className="text-sm text-muted-foreground">
            Retrieve claims and explanation of benefits data.
          </p>
        </div>
        {eobData ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopy}>
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
          <Button onClick={handleEobRequest} disabled={isLoading}>
            Send request
          </Button>
        )}
      </div>

      {eobData && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Use</TableHead>
              <TableHead>Claim ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eobData?.entry?.map((entry) => (
              <TableRow key={entry?.resource?.id}>
                <TableCell>{entry?.resource?.use}</TableCell>
                <TableCell>{entry?.resource?.id}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      entry?.resource?.status === 'active'
                        ? 'outline'
                        : 'secondary'
                    }
                  >
                    {entry?.resource?.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
