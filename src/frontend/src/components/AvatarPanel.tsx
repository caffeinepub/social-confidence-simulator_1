import { useEffect, useState } from 'react';

interface AvatarPanelProps {
  mood: 'neutral' | 'confident' | 'anxious' | 'encouraging';
  message?: string;
  avatarType?: 'cartoon' | 'gif';
}

const avatarImages = {
  cartoon: {
    neutral: '/assets/generated/avatar-neutral.dim_512x512.png',
    confident: '/assets/generated/avatar-confident.dim_512x512.png',
    anxious: '/assets/generated/avatar-anxious.dim_512x512.png',
    encouraging: '/assets/generated/avatar-encouraging.dim_512x512.png',
  },
  gif: {
    neutral: '/assets/generated/avatar-neutral.dim_512x512.png',
    confident: '/assets/generated/avatar-confident.dim_512x512.png',
    anxious: '/assets/generated/avatar-anxious.dim_512x512.png',
    encouraging: '/assets/generated/avatar-encouraging.dim_512x512.png',
  },
};

export default function AvatarPanel({ mood, message, avatarType = 'cartoon' }: AvatarPanelProps) {
  const [currentMood, setCurrentMood] = useState(mood);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  useEffect(() => {
    if (message) {
      setShowBubble(true);
      const timer = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-4 transition-all duration-500">
          <img
            src={avatarImages[avatarType][currentMood]}
            alt={`Avatar ${currentMood}`}
            className="w-full h-full object-contain transition-opacity duration-500"
          />
        </div>
        {showBubble && message && (
          <div className="absolute -right-4 top-8 max-w-xs bg-card border-2 rounded-2xl rounded-tr-none p-4 shadow-lg animate-in fade-in slide-in-from-left-5 duration-300">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground capitalize">{currentMood}</p>
      </div>
    </div>
  );
}
