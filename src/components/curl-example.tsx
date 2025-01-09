'use client';

import { CopyButton } from '@/components/copy-button';

interface CurlExampleProps {
  method: string;
  url: string;
  body?: string;
}

export function CurlExample({ method, url, body }: CurlExampleProps) {
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

  return (
    <div className="flex items-center gap-2 bg-muted rounded-md p-3">
      <pre className="flex-1 text-xs font-mono whitespace-pre-wrap">
        {getCurlCommand()}
      </pre>
      <CopyButton value={getCurlCommand()} />
    </div>
  );
} 