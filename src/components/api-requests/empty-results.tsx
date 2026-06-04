'use client';

import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyResultsProps {
  message: string;
  onRetry: () => void;
  isLoading: boolean;
}

export function EmptyResults({
  message,
  onRetry,
  isLoading,
}: EmptyResultsProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-md border border-dashed p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Inbox className="h-4 w-4" />
        <span>{message}</span>
      </div>
      <Button
        variant="outline"
        onClick={onRetry}
        disabled={isLoading}
        className="min-w-[120px]"
      >
        {isLoading ? 'Loading...' : 'Send Request'}
      </Button>
    </div>
  );
}
