'use client'

export function AccessTokenDisplay({ token }: { token: string }) {
  const start = token.slice(0, 18);
  const end = token.slice(-18);
  
  return (
    <div className="text-sm">
      <span className="font-mono">{start}<span className="opacity-50">...</span>{end}</span>
    </div>
  )
} 