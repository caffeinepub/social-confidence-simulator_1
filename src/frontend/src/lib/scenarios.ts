export interface ScenarioData {
  title: string;
  prompt: string;
  icon: string;
}

export const scenarios: ScenarioData[] = [
  {
    title: 'Job Interview',
    prompt: "You're interviewing for a software developer position. I'll play the interviewer.",
    icon: '/assets/generated/scenario-job-interview-icon.dim_256x256.png',
  },
  {
    title: 'First Date',
    prompt: "You're on a first date at a coffee shop. I'll play your date.",
    icon: '/assets/generated/scenario-first-date-icon.dim_256x256.png',
  },
  {
    title: 'Party',
    prompt: "You're at a party and meeting new people. I'll play a friendly guest.",
    icon: '/assets/generated/scenario-party-icon.dim_256x256.png',
  },
  {
    title: 'Networking Event',
    prompt: "You're at a networking event. Let's practice introducing yourself. I will play a new industry contact.",
    icon: '/assets/generated/scenario-networking-icon.dim_256x256.png',
  },
];

export function getDefaultScenario(): ScenarioData {
  return scenarios[0];
}

export function getScenarioByTitle(title: string): ScenarioData | undefined {
  return scenarios.find((s) => s.title === title);
}
