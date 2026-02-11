import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import QRCodeDisplay from './QRCodeDisplay';

interface ScenarioCardProps {
  title: string;
  icon: string;
  onClick: () => void;
}

export default function ScenarioCard({ title, icon, onClick }: ScenarioCardProps) {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/50">
        <CardContent className="p-6" onClick={onClick}>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <img src={icon} alt={title} className="w-16 h-16 object-contain" />
            </div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setShowQR(true);
              }}
            >
              <QrCode className="h-4 w-4" />
              QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Scan this QR code to start this scenario on another device
            </DialogDescription>
          </DialogHeader>
          <QRCodeDisplay scenario={title} />
        </DialogContent>
      </Dialog>
    </>
  );
}
