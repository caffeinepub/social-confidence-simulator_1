import { useMemo } from 'react';

interface ConfidenceChartProps {
  scores: number[];
}

export default function ConfidenceChart({ scores }: ConfidenceChartProps) {
  const chartData = useMemo(() => {
    if (scores.length === 0) return [];
    return scores.map((score, index) => ({
      turn: index + 1,
      score: Math.round(score * 100),
    }));
  }, [scores]);

  const maxScore = 100;
  const height = 200;
  const width = 600;
  const padding = 40;

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No data to display
      </div>
    );
  }

  const xStep = (width - padding * 2) / Math.max(chartData.length - 1, 1);
  const yScale = (height - padding * 2) / maxScore;

  const points = chartData
    .map((d, i) => {
      const x = padding + i * xStep;
      const y = height - padding - d.score * yScale;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = height - padding - value * yScale;
          return (
            <g key={value}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="currentColor"
                opacity="0.5"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="oklch(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {chartData.map((d, i) => {
          const x = padding + i * xStep;
          const y = height - padding - d.score * yScale;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="5" fill="oklch(var(--primary))" />
              <text
                x={x}
                y={height - padding + 20}
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
                opacity="0.5"
              >
                {d.turn}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="2"
        />

        {/* Labels */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          fontSize="14"
          fill="currentColor"
          opacity="0.7"
        >
          Turn Number
        </text>
        <text
          x={15}
          y={height / 2}
          textAnchor="middle"
          fontSize="14"
          fill="currentColor"
          opacity="0.7"
          transform={`rotate(-90, 15, ${height / 2})`}
        >
          Confidence %
        </text>
      </svg>
    </div>
  );
}
