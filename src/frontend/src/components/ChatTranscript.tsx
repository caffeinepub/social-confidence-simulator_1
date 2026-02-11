import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import type { Message } from '../backend';

interface ChatTranscriptProps {
  messages: Message[];
}

export default function ChatTranscript({ messages }: ChatTranscriptProps) {
  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isAI = message.sender === 'AI';
          return (
            <div
              key={index}
              className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isAI
                    ? 'bg-muted text-foreground rounded-tl-none'
                    : 'bg-primary text-primary-foreground rounded-tr-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {format(new Date(Number(message.time) / 1000000), 'h:mm a')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
