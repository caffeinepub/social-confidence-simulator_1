import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import ScenarioCard from '../components/ScenarioCard';
import ProgressTracker from '../components/ProgressTracker';
import { scenarios, getDefaultScenario } from '../lib/scenarios';
import { parseScenarioFromUrl } from '../lib/deeplinks';
import { Play } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const scenarioFromUrl = parseScenarioFromUrl();
    if (scenarioFromUrl) {
      navigate({
        to: '/conversation',
        search: { scenario: scenarioFromUrl },
      });
    }
  }, [navigate]);

  const handleScenarioSelect = (scenarioTitle: string) => {
    navigate({
      to: '/conversation',
      search: { scenario: scenarioTitle },
    });
  };

  const handleQuickStart = () => {
    const defaultScenario = getDefaultScenario();
    navigate({
      to: '/conversation',
      search: { scenario: defaultScenario.title },
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl font-bold tracking-tight">
          Practice Social Conversations with Confidence
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose a scenario below to start practicing. Get real-time feedback and track your progress.
        </p>
        <Button size="lg" onClick={handleQuickStart} className="gap-2 mt-4">
          <Play className="h-5 w-5" />
          Start Practice Now
        </Button>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6">Choose Your Scenario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.title}
              title={scenario.title}
              icon={scenario.icon}
              onClick={() => handleScenarioSelect(scenario.title)}
            />
          ))}
        </div>
      </div>

      <ProgressTracker />
    </div>
  );
}
