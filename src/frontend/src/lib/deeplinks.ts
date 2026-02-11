export function buildScenarioDeepLink(scenario: string): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({ scenario });
  return `${baseUrl}/?${params.toString()}`;
}

export function parseScenarioFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  return params.get('scenario');
}
