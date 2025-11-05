import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Api from '@/services/Api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ExecutionAccuracyModalProps {
  open: boolean;
  onOpenChange: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ExecutionAccuracyModal = ({
  open,
  onOpenChange,
  isLoading,
  setIsLoading,
}: ExecutionAccuracyModalProps) => {
  const { user, setUser } = useAuth();
  const [enabled, setEnabled] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(10);

  useEffect(() => {
    if (open && user?.globalSetting) {
      setEnabled(user.globalSetting.executionAccuracyEnabled ?? false);
      setMultiplier(user.globalSetting.executionAccuracyMultiplier ?? 10);
    }
  }, [open, user]);

  const handleSave = async () => {
    if (multiplier < 0 || multiplier > 100) {
      toast.error('Multiplier must be between 0% and 100%');
      return;
    }

    setIsLoading(true);
    try {
      const data = await Api.post('/users/execution-accuracy', {
        enabled,
        multiplier,
      });

      if (data?.success) {
        setUser(data.user);
        toast.success('Execution accuracy settings updated successfully');
        onOpenChange();
      }
    } catch (error) {
      console.error('Error updating execution accuracy:', error);
      toast.error(error?.response?.data?.message || 'Failed to update settings');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Execution Accuracy Multiplier</DialogTitle>
          <DialogDescription>
            Configure execution accuracy settings to improve trade execution across different broker price feeds.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              When enabled, trades close based on TradingView alerts instead of broker-side take-profit or stop-loss
              triggers.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This feature widens both take-profit and stop-loss distances to improve execution accuracy across
              different broker price feeds and automatically adjusts the risk per trade to match.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The default and recommended multiplier is 10%, providing the best balance between accuracy and protection.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If disabled, trades will close at the broker's target levels as normal.
            </p>
          </div>

          {/* Enable/Disable Switch */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-1">
              <Label className="text-base font-medium">Enable Execution Accuracy</Label>
              <p className="text-sm text-muted-foreground">
                Use TradingView alerts instead of broker-side triggers
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} disabled={isLoading} />
          </div>

          {/* Multiplier Input */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="multiplier">Multiplier Percentage</Label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Input
                    id="multiplier"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    disabled={!enabled || isLoading}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: 10% for optimal balance between accuracy and protection
              </p>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMultiplier(5)}
                disabled={!enabled || isLoading}
              >
                5%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMultiplier(10)}
                disabled={!enabled || isLoading}
              >
                10% (Default)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMultiplier(15)}
                disabled={!enabled || isLoading}
              >
                15%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMultiplier(20)}
                disabled={!enabled || isLoading}
              >
                20%
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onOpenChange} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

