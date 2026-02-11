import { useEffect, useRef } from 'react';
import { buildScenarioDeepLink } from '../lib/deeplinks';

interface QRCodeDisplayProps {
  scenario: string;
}

export default function QRCodeDisplay({ scenario }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const url = buildScenarioDeepLink(scenario);
    
    // Simple QR code generation using a basic pattern
    // In production, you'd use a library like qrcode
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 300);

    // Draw a simple placeholder pattern
    ctx.fillStyle = '#000000';
    ctx.font = '12px monospace';
    ctx.fillText('QR Code', 120, 140);
    ctx.fillText(scenario, 100, 160);
    
    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 280, 280);
  }, [scenario]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} width={300} height={300} className="border rounded-lg" />
      <p className="text-sm text-muted-foreground text-center">
        {buildScenarioDeepLink(scenario)}
      </p>
    </div>
  );
}
