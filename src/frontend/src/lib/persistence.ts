interface LocalSession {
  id: string;
  scenario: {
    title: string;
    prompt: string;
  };
  messages: Array<{
    sender: string;
    content: string;
    time: bigint;
  }>;
}

const SESSION_KEY = 'current-session';

export function getLocalSession(): LocalSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    // Convert time strings back to bigints
    parsed.messages = parsed.messages.map((m: any) => ({
      ...m,
      time: BigInt(m.time),
    }));
    return parsed;
  } catch {
    return null;
  }
}

export function saveLocalSession(session: LocalSession): void {
  if (typeof window === 'undefined') return;

  try {
    // Convert bigints to strings for storage
    const toStore = {
      ...session,
      messages: session.messages.map((m) => ({
        ...m,
        time: m.time.toString(),
      })),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function clearLocalSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}
