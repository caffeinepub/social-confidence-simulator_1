import { useState, useEffect } from 'react';

interface Preferences {
  avatarType: 'cartoon' | 'gif';
  voiceFeedback: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: Preferences = {
  avatarType: 'cartoon',
  voiceFeedback: false,
  language: 'en',
};

const STORAGE_KEY = 'social-confidence-preferences';

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<Preferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  return {
    preferences,
    updatePreferences,
  };
}
