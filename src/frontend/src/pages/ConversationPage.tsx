import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AvatarPanel from '../components/AvatarPanel';
import ChatTranscript from '../components/ChatTranscript';
import ChatComposer from '../components/ChatComposer';
import MetricsPanel from '../components/MetricsPanel';
import RetryResponseButton from '../components/RetryResponseButton';
import { useConversationSession } from '../hooks/useConversationSession';
import { scenarios } from '../lib/scenarios';
import { ArrowLeft, StopCircle } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';

export default function ConversationPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/conversation' }) as { scenario?: string };
  const { preferences } = usePreferences();
  
  const scenario = scenarios.find((s) => s.title === search.scenario) || scenarios[0];
  
  const {
    session,
    messages,
    currentMetrics,
    currentMood,
    isProcessing,
    sendMessage,
    retryLastMessage,
    endSession,
  } = useConversationSession(scenario);

  const [lastAIMessage, setLastAIMessage] = useState<string>();

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'AI') {
        setLastAIMessage(lastMsg.content);
      }
    }
  }, [messages]);

  const handleEndSession = async () => {
    const sessionId = await endSession();
    if (sessionId) {
      navigate({ to: '/summary/$sessionId', params: { sessionId } });
    }
  };

  const canRetry = messages.length > 0 && messages[messages.length - 1].sender === 'User';

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-4">
          {canRetry && (
            <RetryResponseButton onRetry={retryLastMessage} disabled={isProcessing} />
          )}
          <Button variant="destructive" onClick={handleEndSession} className="gap-2">
            <StopCircle className="h-4 w-4" />
            End Session
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold">{scenario.title}</h2>
        <p className="text-muted-foreground">{scenario.prompt}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Panel */}
        <Card className="lg:col-span-1">
          <AvatarPanel
            mood={currentMood}
            message={lastAIMessage}
            avatarType={preferences.avatarType}
          />
        </Card>

        {/* Chat Panel */}
        <Card className="lg:col-span-1 p-6 flex flex-col">
          <div className="flex-1 mb-4 min-h-[400px]">
            <ChatTranscript messages={messages} />
          </div>
          <ChatComposer onSend={sendMessage} disabled={isProcessing} />
        </Card>

        {/* Metrics Panel */}
        <div className="lg:col-span-1">
          <MetricsPanel
            confidenceScore={currentMetrics.confidenceScore}
            wpm={currentMetrics.wpm}
            fillerWords={currentMetrics.fillerWords}
            hesitations={currentMetrics.hesitations}
            tips={currentMetrics.tips}
          />
        </div>
      </div>
    </div>
  );
}
