import { Link, useNavigate } from '@tanstack/react-router';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginButton from './LoginButton';

export default function AppHeader() {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/assets/generated/social-confidence-simulator-logo.dim_512x512.png"
            alt="Social Confidence Simulator"
            className="h-10 w-10 rounded-lg"
          />
          <h1 className="text-xl font-bold tracking-tight">Social Confidence Simulator</h1>
        </Link>
        <div className="flex items-center gap-3">
          <LoginButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/settings' })}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
