import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { ConnectAccount } from '@/lib/types';
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
  const [accounts, setAccounts] = useState<ConnectAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<ConnectAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open === '') {
      setAccounts([]);
      setSelectedAccount(null);
    } else if (open === 'Global') {
      setAccounts([...user.accounts]);
      setSelectedAccount({
        ...user.accounts[0],
        strategySettings: user.accounts[0].strategySettings.map((ss) => ({ ...ss })),
      });
    }
  }, [open]);

  function onRiskSettingsChange(key: string, value: string | boolean | number) {
    const updatedAccount = {
      ...selectedAccount,
      [key]: value,
    };
    const updatedAccounts = accounts.map((account) =>
      account.accountId === updatedAccount.accountId ? updatedAccount : account
    );
    setSelectedAccount(updatedAccount);
    setAccounts(updatedAccounts);
  }

  function hasAccountsChanged(accounts1, accounts2) {
    if (accounts1.length !== accounts2.length) return true;

    for (let i = 0; i < accounts1.length; i++) {
      const a1 = accounts1[i];
      const a2 = accounts2.find((acc) => acc.accountId === a1.accountId);
      if (!a2) return true;

      // Compare strategySettings length or other key properties if needed
      if (JSON.stringify(a1) !== JSON.stringify(a2)) {
        return true;
      }
    }

    return false;
  }

  async function onSaveClick() {
    console.log(accounts, user.accounts);
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
      const data = await apiClient.post('/users/update-account-setting', {
        accounts,
      });
      console.log('Data:', data);
      if (data.success) {
        setUser(data.user);
        toast({
          title: 'Success',
          description: data.message ?? 'Successfully updated account limit',
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
    setIsLoading(false);
  }

  return (
    <Dialog open={open === 'Global'} onOpenChange={() => onModalClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            Global Risk Setting
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {/* Daily Loss Limit */}
          <div>
            <Label>Daily Loss Limit</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="1000"
                className="flex-1"
                value={selectedAccount?.dailyLossLimit ?? ''}
                onChange={(e) => onRiskSettingsChange('dailyLossLimit', e.target.value)}
              />
              <Select
                value={selectedAccount?.dailyLossCurrency ?? 'percentage'}
                onValueChange={(value) => onRiskSettingsChange('dailyLossCurrency', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">USD</SelectItem>
                  <SelectItem value="percentage">%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Maximum Loss Limit */}
          <div>
            <Label>Maximum Loss Limit</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="1000"
                className="flex-1"
                value={selectedAccount?.maxLossLimit ?? ''}
                onChange={(e) => onRiskSettingsChange('maxLossLimit', e.target.value)}
              />
              <Select
                value={selectedAccount?.maxLossCurrency ?? 'percentage'}
                onValueChange={(value) => onRiskSettingsChange('maxLossCurrency', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">USD</SelectItem>
                  <SelectItem value="percentage">%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions on Limit Breach */}
          <div className="space-y-3">
            <Label>Actions on Limit Breach</Label>
            <div className="mt-2">
              <div className="flex items-center justify-between bg-background/50 rounded-lg">
                <div className="flex items-start gap-2">
                  {/* <AlertTriangle className='h-4 text-warning' /> */}
                  <span className="text-sm pl-2">
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
          <div className="space-y-1">
            {accounts.map((account) => {
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
                    {account.name} <span className="text-xs">({account.platform})</span>: Daily ={' '}
                    {account.dailyLossCurrency === 'amount' && '$'}
                    {account.dailyLossLimit}
                    {account.dailyLossCurrency === 'percentage' && '%'} Max ={' '}
                    {account.maxLossCurrency === 'amount' && '$'}
                    {account.maxLossLimit}
                    {account.maxLossCurrency === 'percentage' && '%'}
                  </p>
                </div>
              );
            })}
          </div>
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
