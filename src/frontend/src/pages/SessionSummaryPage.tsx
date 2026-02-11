import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';
import ChatTranscript from '../components/ChatTranscript';
import ConfidenceChart from '../components/ConfidenceChart';
import { useGetSessionById } from '../hooks/useQueries';
import { format } from 'date-fns';

export default function SessionSummaryPage() {
  const { sessionId } = useParams({ from: '/summary/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetSessionById(sessionId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">Session not found</p>
        <Button onClick={() => navigate({ to: '/' })}>Back to Dashboard</Button>
      </div>
    );
  }

  const avgConfidence =
    session.confidenceScores.length > 0
      ? Math.round(
          (session.confidenceScores.reduce((a, b) => a + b, 0) / session.confidenceScores.length) * 100
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Summary
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{session.scenario.title} - Session Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(Number(session.startTime) / 1000000), 'MMMM d, yyyy h:mm a')}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">{avgConfidence}%</div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">{session.messages.length}</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {session.endTime
                    ? Math.round((Number(session.endTime) - Number(session.startTime)) / 60000000000)
                    : 0}
                </div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Confidence Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <ConfidenceChart scores={session.confidenceScores} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversation Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px]">
              <ChatTranscript messages={session.messages} />
            </div>
          </CardContent>
        </Card>

        {session.analysisSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Personalized Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{session.analysisSummary}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
