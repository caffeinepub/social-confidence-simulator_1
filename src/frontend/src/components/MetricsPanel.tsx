import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { usePreferences } from '../hooks/usePreferences';

interface MetricsPanelProps {
  confidenceScore: number;
  wpm?: number;
  fillerWords: number;
  hesitations: number;
  tips: string[];
}

export default function MetricsPanel({
  confidenceScore,
  wpm,
  fillerWords,
  hesitations,
  tips,
}: MetricsPanelProps) {
  const { speak, isSupported } = useTextToSpeech();
  const { preferences } = usePreferences();

  const getConfidenceColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleSpeakTip = (tip: string) => {
    if (preferences.voiceFeedback && isSupported) {
      speak(tip);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Confidence Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-5xl font-bold ${getConfidenceColor(confidenceScore)}`}>
              {Math.round(confidenceScore)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {confidenceScore >= 70 ? 'Great job!' : confidenceScore >= 40 ? 'Keep going!' : 'You can do it!'}
            </p>
          </div>
          <Progress value={confidenceScore} className="h-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {wpm !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Words per minute</span>
              </div>
              <span className="font-semibold">{wpm}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>Filler words</span>
            </div>
            <span className="font-semibold">{fillerWords}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span>Hesitations</span>
            </div>
            <span className="font-semibold">{hesitations}</span>
          </div>
        </CardContent>
      </Card>

      {tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span className="flex-1">{tip}</span>
                  {preferences.voiceFeedback && isSupported && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => handleSpeakTip(tip)}
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
