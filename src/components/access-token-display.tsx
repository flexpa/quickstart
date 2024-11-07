'use client'

import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

const handleCopyToken = (token: string) => {
  navigator.clipboard.writeText(token);
};

export function AccessTokenDisplay({ token }: { token: string }) {
  const [hasCopied, setHasCopied] = useState(false)
  const start = token.slice(0, 18);
  const end = token.slice(-18);
  
  return (
    <div className="text-sm flex items-center gap-2">
      <span className="font-mono">{start}<span className="opacity-50">...</span>{end}</span>
      <Button
        variant="outline"
        className="hover:bg-muted ml-auto" 
        onClick={() => {
          handleCopyToken(token)
          setHasCopied(true)
          setTimeout(() => setHasCopied(false), 2000)
        }}
      >
        {hasCopied ? (
          <>
            <Check className="h-4 w-4" /> Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copy
          </>
        )}
      </Button>
    </div>
  )
} 