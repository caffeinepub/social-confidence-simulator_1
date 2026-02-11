import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export default function VoiceInputButton({ onTranscript, disabled = false }: VoiceInputButtonProps) {
  const { isListening, isSupported, error, startListening, stopListening, transcript } = useSpeechToText();

  const handleClick = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        onTranscript(transcript);
      }
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="outline" size="icon" disabled className="h-10 w-10">
              <MicOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice input is not supported in your browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={handleClick}
            disabled={disabled}
            className="h-10 w-10"
          >
            {isListening ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? 'Stop recording' : 'Start voice input'}</p>
          {error && <p className="text-destructive text-xs">{error}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
