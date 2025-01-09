'use client'

import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface CopyButtonProps {
  value: string
}

export function CopyButton({ value }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
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
  )
} 