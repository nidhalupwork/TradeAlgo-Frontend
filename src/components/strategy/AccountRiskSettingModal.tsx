import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CircleAlert, Loader2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { ConnectAccount } from '@/lib/types';
import apiClient from '@/services/Api';
import { useToast } from '@/hooks/use-toast';
import { useSocket } from '@/providers/SocketProvider';
import { Checkbox } from '../ui/checkbox';

export const RiskSettingModal = ({
  open,
  onModalClose,
  isLoading,
  setIsLoading,
}: {
  open: 'Global' | 'Strategy' | 'Time' | '';
  onModalClose: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const { stats } = useSocket();
  const { user, setUser } = useAuth();
  const [accounts, setAccounts] = useState<ConnectAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<ConnectAccount | null>(null);
  const [selectedAccount1, setSelectedAccount1] = useState<ConnectAccount | null>(null);
  const [currency, setCurrency] = useState<string>('USD');
  const [currency1, setCurrency1] = useState<string>('USD');
  const [termsChecked, setTermsChecked] = useState(false);

  useEffect(() => {
    if (open === '') {
      setAccounts([]);
      setSelectedAccount(null);
      setSelectedAccount1(null);
    } else if (open === 'Global') {
      setAccounts([...user.accounts]);
      setSelectedAccount({
        ...user.accounts[0],
        strategySettings: user?.accounts[0]?.strategySettings?.map((ss) => ({ ...ss })),
      });
      setSelectedAccount1({
        ...user.accounts[0],
        strategySettings: user?.accounts[0]?.strategySettings?.map((ss) => ({ ...ss })),
      });
    }
  }, [open]);

  useEffect(() => {
    const accountInfo = stats?.accountInformation?.find((a) => a?.accountId === selectedAccount?.accountId);
    setCurrency(accountInfo?.currency ?? 'USD');
  }, [selectedAccount]);

  useEffect(() => {
    const accountInfo = stats?.accountInformation?.find((a) => a?.accountId === selectedAccount1?.accountId);
    setCurrency1(accountInfo?.currency ?? 'USD');
  }, [selectedAccount1]);

  function onRiskSettingsChange(key: string, value: string | boolean | number, type: 0 | 1) {
    if (type === 0) {
      const updatedAccount = {
        ...selectedAccount,
        [key]: value,
      };
      const updatedAccounts = accounts.map((account) =>
        account.accountId === updatedAccount.accountId ? updatedAccount : account
      );
      setSelectedAccount(updatedAccount);
      setAccounts(updatedAccounts);
      if (selectedAccount.login === selectedAccount1.login) {
        setSelectedAccount1(updatedAccount);
      }
    } else {
      const updatedAccount = {
        ...selectedAccount1,
        [key]: value,
      };
      const updatedAccounts = accounts.map((account) =>
        account.accountId === updatedAccount.accountId ? updatedAccount : account
      );
      setSelectedAccount1(updatedAccount);
      setAccounts(updatedAccounts);
      if (selectedAccount.login === selectedAccount1.login) {
        setSelectedAccount(updatedAccount);
      }
    }
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
    if (!termsChecked) {
      return;
    }
    if (accounts?.length === 0) {
      toast({
        title: 'No Account',
        description: 'You have no account. Please connect account at first.',
        variant: 'warn',
      });
      return;
    }
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
            Account Risk Setting
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
                onChange={(e) => onRiskSettingsChange('dailyLossLimit', e.target.value, 0)}
              />
              <Select
                value={selectedAccount?.dailyLossCurrency ?? 'percentage'}
                onValueChange={(value) => onRiskSettingsChange('dailyLossCurrency', value, 0)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">{currency}</SelectItem>
                  <SelectItem value="percentage">%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            {accounts.length > 0 ? (
              accounts?.map((account) => {
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
                      {account.name} <span className="text-xs">({account.platform})</span>: Daily Loss Limit ={' '}
                      {account.dailyLossLimit}
                      {account.dailyLossCurrency === 'percentage' ? '%' : ` ${currency}`}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="flex gap-2 items-center mt-4">
                <CircleAlert color="gold" size={20} />
                <p className="text-muted-foreground text-sm">You have no account</p>
              </div>
            )}
          </div>

          {/* Actions on Daily Limit Breach */}
          <div className="space-y-3">
            <Label>Actions on Limit Breach</Label>
            <div className="mt-2">
              <div className="flex items-center justify-between bg-background/50 rounded-lg">
                <div className="flex items-start gap-2">
                  {/* <AlertTriangle className='h-4 text-warning' /> */}
                  <span className="text-sm pl-2 text-muted-foreground">
                    All open positions will be automatically closed, and trading activity will be paused for the
                    remainder of the day. Trading will resume the following day.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Maximum Loss Limit */}
          <div>
            <Label>Maximum Loss Limit</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="1000"
                className="flex-1"
                value={selectedAccount1?.maxLossLimit ?? ''}
                onChange={(e) => onRiskSettingsChange('maxLossLimit', e.target.value, 1)}
              />
              <Select
                value={selectedAccount1?.maxLossCurrency ?? 'percentage'}
                onValueChange={(value) => onRiskSettingsChange('maxLossCurrency', value, 1)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">{currency1}</SelectItem>
                  <SelectItem value="percentage">%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            {accounts.length > 0 ? (
              accounts.map((account) => {
                return (
                  <div
                    key={account.accountId}
                    className="flex gap-2 text-sm hover:cursor-pointer text-muted-foreground hover:text-muted-foreground/80 transition-all"
                    onClick={() => setSelectedAccount1(account)}
                  >
                    <div
                      className={`w-5 h-5 rounded-full ${
                        selectedAccount1.accountId === account.accountId ? 'bg-profit' : 'bg-muted'
                      }`}
                    />
                    <p>
                      {account.name} <span className="text-xs">({account.platform})</span>: Max Loss Limit ={' '}
                      {account.maxLossLimit}
                      {account.maxLossCurrency === 'percentage' ? '%' : ` ${currency1}`}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="flex gap-2 items-center mt-4">
                <CircleAlert color="gold" size={20} />
                <p className="text-muted-foreground text-sm">You have no account</p>
              </div>
            )}
          </div>

          {/* Actions on Max Limit Breach */}
          <div className="space-y-3">
            <Label>Actions on Limit Breach</Label>
            <div className="mt-2">
              <div className="flex items-center justify-between bg-background/50 rounded-lg">
                <div className="flex items-start gap-2">
                  {/* <AlertTriangle className='h-4 text-warning' /> */}
                  <span className="text-sm pl-2 text-muted-foreground">
                    All open positions will be automatically closed, and trading will remain paused until strategies are
                    manually reactivated.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <div className="p-2 space-y-1">
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 mt-1">
                  <CircleAlert className="text-warning" size={16} />
                </div>
                <p className="text-sm">
                  Loss limits are checked every 5 minutes. In volatile markets, your actual loss may briefly exceed this
                  value before positions are closed.
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <Checkbox className="mt-1" checked={termsChecked} onClick={() => setTermsChecked(!termsChecked)} />
                <span className="text-muted-foreground text-sm">
                  I understand enforcement is every 5 minutes and losses may exceed my limit in volatile markets
                </span>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="gold" disabled={isLoading || !termsChecked} onClick={() => onSaveClick()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
