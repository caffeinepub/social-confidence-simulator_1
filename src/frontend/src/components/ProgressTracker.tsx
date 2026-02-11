import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProgressStats } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';

export default function ProgressTracker() {
  const { identity } = useInternetIdentity();
  const { data: progress, isLoading } = useGetProgressStats();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            ⚠️ Progress is stored locally on this device. Login to sync across devices.
          </p>
          <div className="text-center py-8 text-muted-foreground">
            No sessions yet. Start practicing to track your progress!
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progress || Number(progress.sessionCount) === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No sessions yet. Start practicing to track your progress!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-3xl font-bold text-primary">{Number(progress.sessionCount)}</div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-3xl font-bold text-primary">
              {Math.round(progress.averageConfidence * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Confidence</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Recent Sessions
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {progress.allSessions.slice(-5).reverse().map((session) => (
              <Button
                key={session.id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => navigate({ to: '/summary/$sessionId', params: { sessionId: session.id } })}
              >
                <div className="flex-1">
                  <div className="font-medium">{session.scenario.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(Number(session.startTime) / 1000000), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <div className="text-sm font-semibold text-primary">
                  {session.confidenceScores.length > 0
                    ? Math.round(
                        (session.confidenceScores.reduce((a, b) => a + b, 0) /
                          session.confidenceScores.length) *
                          100
                      )
                    : 0}%
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
