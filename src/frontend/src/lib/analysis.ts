import type { Message } from '../backend';

interface AnalysisResult {
  confidenceScore: number;
  fillerWords: number;
  hesitations: number;
  wpm?: number;
  mood: 'neutral' | 'confident' | 'anxious' | 'encouraging';
}

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'sort of', 'kind of', 'basically', 'actually'];

export function analyzeMessage(content: string, duration?: number): AnalysisResult {
  const lowerContent = content.toLowerCase();
  
  // Count filler words
  let fillerWords = 0;
  FILLER_WORDS.forEach((filler) => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) fillerWords += matches.length;
  });

  // Count hesitations (ellipsis, repeated words)
  const hesitations = (lowerContent.match(/\.\.\./g) || []).length +
    (lowerContent.match(/\b(\w+)\s+\1\b/g) || []).length;

  // Calculate WPM if duration provided
  const wordCount = content.split(/\s+/).length;
  const wpm = duration ? Math.round((wordCount / duration) * 60) : undefined;

  // Calculate confidence score
  let score = 0.5; // Base score

  // Length bonus
  if (wordCount > 20) score += 0.2;
  else if (wordCount > 10) score += 0.1;

  // Penalties
  score -= fillerWords * 0.05;
  score -= hesitations * 0.05;

  // Clamp between 0 and 1
  score = Math.max(0, Math.min(1, score));

  // Determine mood
  let mood: 'neutral' | 'confident' | 'anxious' | 'encouraging';
  if (score >= 0.7) mood = 'confident';
  else if (score >= 0.4) mood = 'neutral';
  else mood = 'anxious';

  return {
    confidenceScore: score,
    fillerWords,
    hesitations,
    wpm,
    mood,
  };
}

export function generateTips(analysis: AnalysisResult): string[] {
  const tips: string[] = [];

  if (analysis.fillerWords > 3) {
    tips.push('Try to reduce filler words like "um" and "uh". Pause instead of using fillers.');
  }

  if (analysis.hesitations > 2) {
    tips.push('Take a moment to gather your thoughts before speaking. It\'s okay to pause.');
  }

  if (analysis.confidenceScore < 0.4) {
    tips.push('Speak with more detail and elaboration. Longer, thoughtful responses show confidence.');
  }

  if (analysis.wpm && analysis.wpm < 100) {
    tips.push('Try speaking a bit faster. A moderate pace (120-150 WPM) sounds more confident.');
  }

  if (analysis.wpm && analysis.wpm > 180) {
    tips.push('Slow down a bit. Speaking too fast can make you seem nervous.');
  }

  if (tips.length === 0) {
    tips.push('Great job! Keep up the confident communication.');
  }

  return tips.slice(0, 3);
}

export function generateAIResponse(scenario: { title: string; prompt: string }, messages: Message[]): string {
  const responses: Record<string, string[]> = {
    'Job Interview': [
      'That\'s interesting. Can you tell me more about your experience with similar projects?',
      'I see. What would you say is your greatest strength in this area?',
      'Good. How do you handle challenging situations or tight deadlines?',
      'Thank you for sharing. What interests you most about this position?',
    ],
    'First Date': [
      'That sounds really cool! What do you like to do in your free time?',
      'I love that! Have you always been interested in that?',
      'That\'s fascinating. What\'s your favorite thing about it?',
      'Nice! So what brought you here today?',
    ],
    'Party': [
      'Oh awesome! How do you know the host?',
      'That\'s great! What do you do for work?',
      'Interesting! Have you been to events like this before?',
      'Cool! What are you drinking? Can I get you something?',
    ],
    'Networking Event': [
      'Great to meet you! What brings you to this event?',
      'That sounds exciting. What industry are you in?',
      'Interesting! Are you looking for any particular connections here?',
      'I\'d love to hear more about what you do. Do you have a card?',
    ],
  };

  const scenarioResponses = responses[scenario.title] || responses['Job Interview'];
  const userMessageCount = messages.filter((m) => m.sender === 'User').length;
  const index = Math.min(userMessageCount - 1, scenarioResponses.length - 1);

  return scenarioResponses[index];
}
