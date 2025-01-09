'use client';

import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CurlExampleProps {
  method: string;
  url: string;
  body?: string;
}

export function CurlExample({ method, url, body }: CurlExampleProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const getCurlCommand = () => {
    let command = `curl -X ${method} \\
  '${url}' \\
  -H 'Authorization: Bearer $ACCESS_TOKEN'`;

    if (body) {
      command += ` \\
  -H 'Content-Type: application/json' \\
  -d '${body}'`;
    }

    return command;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCurlCommand());
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 bg-muted rounded-md p-3">
      <pre className="flex-1 text-xs font-mono whitespace-pre-wrap">
        {getCurlCommand()}
      </pre>
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopy}
      >
        {hasCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
} 