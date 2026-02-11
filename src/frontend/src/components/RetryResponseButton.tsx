import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface RetryResponseButtonProps {
  onRetry: () => void;
  disabled?: boolean;
}

export default function RetryResponseButton({ onRetry, disabled = false }: RetryResponseButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onRetry}
      disabled={disabled}
      className="gap-2"
    >
      <RotateCcw className="h-4 w-4" />
      Retry Response
    </Button>
  );
}
