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
    <div className="relative bg-muted rounded-md p-3">
      <div className="absolute right-2 top-2 z-10">
        <CopyButton value={getCurlCommand()} />
      </div>
      <pre className="text-xs font-mono whitespace-pre-wrap pr-12">
        {getCurlCommand()}
      </pre>
    </div>
  );
}
