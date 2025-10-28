import { useEffect, useMemo, useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { ConnectAccount } from '@/lib/types';
import apiClient from '@/services/Api';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import Api from '@/services/Api';

export const TradingTimeModal = ({
  open,
  onConfigModalClose,
  isLoading,
  setIsLoading,
}: {
  open: 'Global' | 'Strategy' | 'Time' | '';
  onConfigModalClose: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    dayOfWeek: 0,
    weeklyClose: false,
    weeklyCloseTime: '00:00',

    isTimeLimit: false,
    startTime: '00:00',
    endTime: '00:00',
  });

  useEffect(() => {
    setSettings({
      ...user.globalSetting,
    });
  }, [open]);

  function areSettingsDifferent(obj1: any, obj2: any): boolean {
    const keys = Object.keys(obj1);
    for (const key of keys) {
      if (obj1[key] !== obj2[key]) {
        return true; // Difference found
      }
    }
    return false; // No differences
  }

  async function onSaveClick() {
    if (!areSettingsDifferent(settings, user.globalSetting)) {
      return;
    }
    setIsLoading(true);
    try {
      console.log('Settings:', settings);
      const data = await Api.post('/users/update-trading-time', { ...settings });
      console.log('data for updating trading time:', data);
      if (data?.success) {
        setUser(data.user);
        onConfigModalClose();
      }
    } catch (error) {
      console.error('Error while saving in trading time modal:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Unexpected Error',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open === 'Time'} onOpenChange={() => onConfigModalClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            Trading Time Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          {/* Close All Trades */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 flex-1">
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Close All Trades</h2>
                <p className="text-sm text-muted-foreground">
                  Schedule weekly closures to manage positions and reduce weekend risk
                </p>
              </div>
              <div className="flex items-center justify-end">
                <Switch
                  checked={settings.weeklyClose}
                  onCheckedChange={(value) => setSettings({ ...settings, weeklyClose: value })}
                />
              </div>
              <Card className="flex flex-col gap-4 px-3 py-4 bg-card/30">
                <div className="space-y-2">
                  <h3 className="text-base">Day & Time to Close</h3>
                  <Select
                    value={settings.dayOfWeek.toString()}
                    onValueChange={(value) => setSettings({ ...settings, dayOfWeek: Number(value) })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="time"
                    className="relative flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    value={settings.weeklyCloseTime}
                    onChange={(e) => {
                      setSettings((prev) => ({ ...prev, weeklyCloseTime: e.target.value }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base">Delivery</h3>
                  <span className="text-sm text-muted-foreground">Will send email to your email address</span>
                </div>
                <p className="text-xs text-muted-foreground">Based on UTC timezone</p>
              </Card>
            </div>
          </Card>

          {/* Trading Time Limit */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 flex-1 p-4 flex flex-col gap-3">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Trading Time Limit</h2>
              <p className="text-sm text-muted-foreground">
                Allow new trades only within defiend time window to control market exposure
              </p>
            </div>
            <div className="flex items-center justify-end">
              <Switch
                checked={settings.isTimeLimit}
                onCheckedChange={(value) => setSettings({ ...settings, isTimeLimit: value })}
              />
            </div>
            <Card className="flex flex-col gap-4 px-3 py-4 bg-card/30 flex-1">
              <div className="space-y-2">
                <h3 className="text-base">Start Time</h3>
                <input
                  type="time"
                  className="relative flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                  value={settings.startTime}
                  onChange={(e) => {
                    setSettings((prev) => ({ ...prev, startTime: e.target.value }));
                  }}
                />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base">End Time</h3>
                <input
                  type="time"
                  className="relative flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                  value={settings.endTime}
                  onChange={(e) => {
                    setSettings((prev) => ({ ...prev, endTime: e.target.value }));
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Based on UTC timezone</p>
            </Card>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="gold" disabled={isLoading} onClick={() => onSaveClick()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
