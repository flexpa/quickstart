'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Bot, CheckCircle2, Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Streamdown } from 'streamdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages and streaming chunks
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50/50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-lg mx-auto items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-bold">Health Records Agent</span>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="container max-w-screen-lg mx-auto py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
              <Bot className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">
                Ask about your health records
              </p>
              <p className="text-sm mt-1">
                Try &quot;Summarize my recent medical visits&quot; or &quot;How
                much did I pay out of pocket?&quot;
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'flex',
                m.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'rounded-lg px-4 py-2 max-w-[80%] text-sm',
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground whitespace-pre-wrap'
                    : 'bg-muted',
                )}
              >
                {m.parts.map((part, i) =>
                  part.type === 'text' ? (
                    m.role === 'assistant' ? (
                      <Streamdown
                        key={`${m.id}-${i}`}
                        isAnimating={status === 'streaming'}
                      >
                        {part.text}
                      </Streamdown>
                    ) : (
                      <span key={`${m.id}-${i}`}>{part.text}</span>
                    )
                  ) : part.type.startsWith('tool-') && 'state' in part ? (
                    <div
                      key={`${m.id}-${i}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground py-1"
                    >
                      {part.state === 'output-available' ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      {part.state === 'output-available'
                        ? 'Fetched health records'
                        : 'Fetching health records...'}
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          ))}

          {status !== 'ready' && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2 flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-background p-4">
        <form
          onSubmit={handleSubmit}
          className="container max-w-screen-lg mx-auto flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your health records..."
            disabled={status !== 'ready'}
          />
          <Button type="submit" disabled={status !== 'ready' || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
