'use client';

import { Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Patient } from 'fhir/r4';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { handleCopyJson } from '@/components/api-requests';

export default function PatientRequests() {
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const handlePatientRequest = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fhir/Patient');
      const data = await response.json();
      console.log('Patient data:', data);
      setPatientData(data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    handleCopyJson(patientData);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge variant="outline">GET</Badge>
            <span className="font-semibold">Patient</span>
          </div>
          <span className="text-muted-foreground font-mono text-sm">
            /fhir/Patient/$PATIENT_ID
          </span>
          <p className="text-sm text-muted-foreground">
            Retrieve demographic data for the patient.
          </p>
        </div>
        {patientData ? (
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
          <Button onClick={handlePatientRequest} disabled={isLoading}>
            Send request
          </Button>
        )}
      </div>

      {patientData && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                {patientData?.name?.map((name) => name.given).join(' ')}{' '}
                {patientData?.name?.map((name) => name.family).join(' ')}
              </TableCell>
              <TableCell>{patientData?.id}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}
