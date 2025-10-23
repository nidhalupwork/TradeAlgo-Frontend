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

export const LossAgreeModal = ({
  open,
  onConfigModalClose,
  strategy,
  isLoading,
  setIsLoading,
}: {
  open: 'Global' | 'Strategy' | 'Time' | '';
  onConfigModalClose: () => void;
  strategy: any;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState<ConnectAccount | null>(null);
  const [accounts, setAccounts] = useState<ConnectAccount[]>([]);
  const [quickTemplate, setQuickTemplate] = useState<'Conservative' | 'Balanced' | 'Aggressive' | ''>(''); // Conservative, Balanced, Aggressive
  const setting = useMemo(() => {
    return selectedAccount?.strategySettings?.find((ss) => ss.strategyId === strategy?._id);
  }, [selectedAccount, open]);

  useEffect(() => {
    if (open === '') {
      setAccounts([]);
      setSelectedAccount(null);
    } else if (open === 'Strategy') {
      setAccounts([...user.accounts]);
      setSelectedAccount({
        ...user.accounts[0],
        strategySettings: user.accounts[0].strategySettings.map((ss) => ({ ...ss })),
      });
    }
  }, [open]);

  function onTemplateClick(template: 'Conservative' | 'Balanced' | 'Aggressive' | '') {
    setQuickTemplate(template);
    let risk = 0.5;
    if (template === 'Conservative') {
      risk = 0.5;
    } else if (template === 'Balanced') {
      risk = 1;
    } else if (template === 'Aggressive') {
      risk = 2;
    }

    updateAccountAndAccounts(risk);
  }

  function updateAccountAndAccounts(risk: number) {
    if (selectedAccount.strategySettings.some((ss) => ss.strategyId === strategy._id)) {
      const updatedStrategySettings = selectedAccount.strategySettings.map((ss) =>
        ss.strategyId === strategy?._id ? { ...ss, riskPerTrade: risk } : ss
      );
      const updatedAccount = {
        ...selectedAccount,
        strategySettings: updatedStrategySettings,
      };
      const updatedAccounts = accounts.map((account) =>
        account.accountId === updatedAccount.accountId ? updatedAccount : account
      );
      setSelectedAccount(updatedAccount);
      setAccounts(updatedAccounts);
    } else {
      // Update selectedAccount immutably
      const updatedSelectedAccount = selectedAccount
        ? {
            ...selectedAccount,
            strategySettings: [
              ...selectedAccount.strategySettings,
              {
                strategyId: strategy._id,
                title: strategy.title,
                riskPerTrade: risk,
                subscribed: false,
              },
            ],
          }
        : null;

      // Update accounts immutably
      const updatedAccounts = accounts.map((account) =>
        account.accountId === updatedSelectedAccount.accountId
          ? {
              ...account,
              strategySettings: [
                ...account.strategySettings,
                {
                  strategyId: strategy._id,
                  title: strategy.title,
                  riskPerTrade: risk,
                  subscribed: false,
                },
              ],
            }
          : account
      );

      setSelectedAccount(updatedSelectedAccount);
      setAccounts(updatedAccounts);
    }
  }

  function hasAccountsChanged(accounts1, accounts2) {
    if (accounts1.length !== accounts2.length) return true;

    for (let i = 0; i < accounts1.length; i++) {
      const a1 = accounts1[i];
      const a2 = accounts2.find((acc) => acc.accountId === a1.accountId);
      if (!a2) return true;

      // Compare strategySettings length or other key properties if needed
      if (JSON.stringify(a1.strategySettings) !== JSON.stringify(a2.strategySettings)) {
        return true;
      }
    }

    return false;
  }

  async function onSaveClick() {
    if (!hasAccountsChanged(accounts, user.accounts)) {
      toast({
        title: 'No changes detected',
        description: 'Please update accounts before saving.',
        variant: 'warn',
      });
      return;
    }
    setIsLoading(true);
    try {
      const data = await apiClient.post('/users/strategy/update-setting', {
        title: strategy?.title,
        accounts,
      });
      console.log('Data:', data);
      if (data?.success) {
        setUser(data.user);
        onConfigModalClose();
        toast({
          title: 'Success',
          description: 'Successfully updated account risk settings',
          variant: 'profit',
        });
      }
    } catch (error) {
      console.error('Error while saving:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Unexpected error',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open === 'Strategy'} onOpenChange={() => onConfigModalClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            Risk Management for {strategy?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Risk Templates */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <div className="p-6 py-2">
              <h2 className="text-xl font-semibold mb-4">Quick Templates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className={`h-auto px-4 py-2 justify-start hover:border-profit/50 ${
                    quickTemplate === 'Conservative' ? 'border-profit/50' : ''
                  }`}
                  onClick={() => onTemplateClick('Conservative')}
                >
                  <div className="text-left">
                    <p className="font-semibold mb-1">Conservative</p>
                    <p className="text-xs text-muted-foreground">0.5% risk, strict limits</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className={`h-auto px-4 py-2 justify-start hover:border-primary/50 ${
                    quickTemplate === 'Balanced' ? 'border-primary/50' : ''
                  }`}
                  onClick={() => onTemplateClick('Balanced')}
                >
                  <div className="text-left">
                    <p className="font-semibold mb-1">Balanced</p>
                    <p className="text-xs text-muted-foreground">1% risk, moderate limits</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className={`h-auto px-4 py-2 justify-start hover:border-loss/50 ${
                    quickTemplate === 'Aggressive' ? 'border-loss/50' : ''
                  }`}
                  onClick={() => onTemplateClick('Aggressive')}
                >
                  <div className="text-left">
                    <p className="font-semibold mb-1">Aggressive</p>
                    <p className="text-xs text-muted-foreground">2% risk, flexible limits</p>
                  </div>
                </Button>
              </div>
            </div>
          </Card>

          {/* Custom Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Custom Settings</h2>
              <div className="space-y-4">
                {/* Risk Per Trade */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Risk Per Trade</Label>
                    <span className="text-sm font-medium text-primary">{setting?.riskPerTrade ?? 0}%</span>
                  </div>
                  <Slider
                    value={[setting?.riskPerTrade ?? 0]}
                    max={5}
                    step={0.1}
                    className="mb-2"
                    onValueChange={(value) => {
                      updateAccountAndAccounts(value[0]);
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>2.5%</span>
                    <span>5%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {accounts.map((account) => {
                    const accSetting = account?.strategySettings?.find((ss) => ss.strategyId === strategy?._id);
                    return (
                      <div
                        key={account.accountId}
                        className="flex gap-2 text-sm hover:cursor-pointer text-muted-foreground hover:text-muted-foreground/80 transition-all"
                        onClick={() => setSelectedAccount(account)}
                      >
                        <div
                          className={`w-5 h-5 rounded-full ${
                            selectedAccount.accountId === account.accountId ? 'bg-profit' : 'bg-muted'
                          }`}
                        />
                        <p>
                          {account.name}{' '}
                          <span className="text-xs">({accSetting?.subscribed ? 'Subscribed' : 'Unsubscribed'})</span>:
                        </p>
                        <p>Risk Selected = {accSetting?.riskPerTrade ?? 0}%</p>
                      </div>
                    );
                  })}
                </div>

                {/* Max Positions */}
                {/* <div>
                  <div className='flex items-center justify-between mb-2'>
                    <Label>Max Concurrent Positions</Label>
                    <span className='text-sm font-medium text-primary'>{riskSettings?.maxCurrentPositions}</span>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    className='mb-2'
                    value={[riskSettings?.maxCurrentPositions]}
                    onValueChange={(value) => {
                      onRiskSettingsChange('maxCurrentPositions', value[0].toString());
                    }}
                  />
                  <div className='flex justify-between text-xs text-muted-foreground'>
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div> */}

                {/* Daily Loss Limit */}
                {/* <div>
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
                </div> */}

                {/* Maximum Loss Limit */}
                {/* <div>
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
                </div> */}

                {/* Actions on Limit Breach */}
                {/* <div className='space-y-3'>
                  <Label>Actions on Limit Breach</Label>
                  <div className='space-y-3 mt-2'>
                    <div className='flex items-center justify-between p-3 bg-background/50 rounded-lg'>
                      <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-4 w-4 text-warning' />
                        <span className='text-sm'>
                          Will close all open positions, pause trading for the day and you will receive a notification
                          alerting you of this action
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-sm">Close all positions</span>
                      </div>
                      <Switch
                        checked={!!riskSettings?.isCloseAllPositions}
                        onCheckedChange={(value) => onRiskSettingsChange('isCloseAllPositions', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-loss" />
                        <span className="text-sm">Pause trading for the day</span>
                      </div>
                      <Switch
                        checked={!!riskSettings?.isPauseTrading}
                        onCheckedChange={(value) => onRiskSettingsChange('isPauseTrading', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span className="text-sm">Send alert notification</span>
                      </div>
                      <Switch
                        checked={!!riskSettings?.isSendNotification}
                        onCheckedChange={(value) => onRiskSettingsChange('isSendNotification', value)}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
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
