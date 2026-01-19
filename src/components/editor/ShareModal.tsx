import { useState } from 'react';
import { Copy, Check, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useMcpStore } from '../../store/mcpStore';
import { useTranslations } from '../../store/langStore';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareModal({ open, onOpenChange }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { generateShareUrl, setToastMessage } = useMcpStore();
  const t = useTranslations();

  const shareUrl = generateShareUrl();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setToastMessage(t.urlCopied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToastMessage(t.copyFailed);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.shareConfig}</DialogTitle>
          <DialogDescription>
            {t.shareDesc}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="font-mono text-xs"
            />
            <Button onClick={handleCopy} variant="outline" className="shrink-0 gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {t.copy}
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-500">{t.warning}</p>
              <p className="text-muted-foreground">
                {t.shareWarning}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
