import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { GlobalRiskSetting, RiskSettingsInterface } from '@/lib/types';
import apiClient from '@/services/Api';
import { useToast } from '@/hooks/use-toast';

export const RiskSettingModal = ({
  open,
  onModalClose,
}: {
  open: 'Global' | 'Strategy' | '';
  onModalClose: () => void;
}) => {
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [riskSettings, setRiskSettings] = useState<GlobalRiskSetting | null>(null);

  function onRiskSettingsChange(key: string, value: string | boolean | number) {
    setRiskSettings({
      ...riskSettings,
      [key]: value,
    });
  }

  useEffect(() => {
    setRiskSettings({
      dailyLossCurrency: user.globalSetting?.dailyLossCurrency,
      dailyLossLimit: user.globalSetting?.dailyLossLimit,
      maxLossCurrency: user.globalSetting?.maxLossCurrency,
      maxLossLimit: user.globalSetting?.maxLossLimit,
    });
  }, [user]);

  async function onSaveClick() {
    try {
      const data = await apiClient.post('/users/update-global-setting', {
        globalSetting: riskSettings,
      });
      console.log('Data:', data);

      if (data.success) {
        setUser(data.user);
        toast({
          title: 'Success',
          description: data.message ?? 'Successfully updated global risk setting',
          variant: 'profit',
        });
        onModalClose();
      }
    } catch (error) {
      console.error('Error while saving:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Unexpected error',
      });
    }
  }

  return (
    <Dialog open={open === 'Global'} onOpenChange={() => onModalClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center'>
              <TrendingUp className='h-4 w-4 text-primary-foreground' />
            </div>
            Global Risk Setting
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-2'>
          {/* Daily Loss Limit */}
          <div>
            <Label>Daily Loss Limit</Label>
            <div className='flex gap-2 mt-2'>
              <Input
                placeholder='1000'
                className='flex-1'
                value={riskSettings?.dailyLossLimit ?? ''}
                onChange={(e) => onRiskSettingsChange('dailyLossLimit', e.target.value)}
              />
              <Select
                value={riskSettings?.dailyLossCurrency ?? 'percentage'}
                onValueChange={(value) => onRiskSettingsChange('dailyLossCurrency', value)}
              >
                <SelectTrigger className='w-32'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='amount'>USD</SelectItem>
                  <SelectItem value='percentage'>%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Maximum Loss Limit */}
          <div>
            <Label>Maximum Loss Limit</Label>
            <div className='flex gap-2 mt-2'>
              <Input
                placeholder='1000'
                className='flex-1'
                value={riskSettings?.maxLossLimit ?? ''}
                onChange={(e) => onRiskSettingsChange('maxLossLimit', e.target.value)}
              />
              <Select
                value={riskSettings?.maxLossCurrency ?? 'percentage'}
                onValueChange={(value) => onRiskSettingsChange('maxLossCurrency', value)}
              >
                <SelectTrigger className='w-32'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='amount'>USD</SelectItem>
                  <SelectItem value='percentage'>%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions on Limit Breach */}
          <div className='space-y-3'>
            <Label>Actions on Limit Breach</Label>
            <div className='mt-2'>
              <div className='flex items-center justify-between bg-background/50 rounded-lg'>
                <div className='flex items-start gap-2'>
                  {/* <AlertTriangle className='h-4 text-warning' /> */}
                  <span className='text-sm pl-2'>
                    Will close all open positions, pause trading for the day and you will receive a notification
                    alerting you of this action
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <div>
            <p>Close All Trades</p>
            <span></span>
          </div> */}
        </div>

        <DialogFooter>
          <Button variant='gold' onClick={() => onSaveClick()}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
