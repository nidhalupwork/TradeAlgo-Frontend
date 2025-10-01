import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ConnectAccount } from '@/lib/types';
import apiClient from '@/services/Api';
import { useAuth } from '@/providers/AuthProvider';

interface AccountConfigModalProps {
  account: ConnectAccount;
  open: boolean;
  modalType: 'Details' | 'Connect';
  onOpenChange: (open: boolean) => void;
}

export const AccountConfigModal = ({ account, open, onOpenChange, modalType }: AccountConfigModalProps) => {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState({
    name: '',
    login: '',
    password: '',
    brokerage: '',
    platform: '-',
    magic: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    setConfiguration({
      name: account?.name || '',
      login: account?.login.toString() || '',
      password: '',
      brokerage: account?.brokerage || 'OctaFX-Demo',
      platform: account?.platform || '-',
      magic: account?.magic.toString() || '',
    });
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (
        !configuration.name ||
        !configuration.brokerage ||
        !configuration.login ||
        !configuration.magic ||
        !configuration.password ||
        configuration.platform === '-'
      ) {
        throw new Error('Please fill in all the fields.');
      }
      const data = await apiClient.post('/users/connect-account', configuration);
      console.log('Data in account config modal:', data);
      if (data?.success) {
        setUser(data.user);

        toast({
          title: 'Account Connected',
          description: `Account has been successfully configured.`,
          variant: 'profit',
        });

        onOpenChange(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Connection Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to connect account. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            {modalType}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loginNumber">Name</Label>
            <Input
              id="name"
              placeholder="Enter human readable name"
              value={configuration.name}
              onChange={(e) => setConfiguration({ ...configuration, name: e.target.value })}
              disabled={isLoading || modalType === 'Details'}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex gap-2 mt-2">
              <div className="space-y-2 flex-1">
                <Label htmlFor="loginNumber">Platform</Label>
                <Select
                  value={configuration.platform}
                  onValueChange={(value) => setConfiguration({ ...configuration, platform: value })}
                  disabled={isLoading || modalType === 'Details'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">-</SelectItem>
                    <SelectItem value="mt4">MetaTrader 4</SelectItem>
                    <SelectItem value="mt5">MetaTrader 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1">
                <Label htmlFor="loginNumber">Magic number</Label>
                <Input
                  id="magic"
                  placeholder="Enter the magic number"
                  value={configuration.magic}
                  onChange={(e) => setConfiguration({ ...configuration, magic: e.target.value })}
                  disabled={isLoading || modalType === 'Details'}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loginNumber">Login Number</Label>
            <Input
              id="loginNumber"
              placeholder="Enter your login number"
              value={configuration.login}
              onChange={(e) => setConfiguration({ ...configuration, login: e.target.value })}
              disabled={isLoading || modalType === 'Details'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={configuration.password}
              onChange={(e) => setConfiguration({ ...configuration, password: e.target.value })}
              disabled={isLoading || modalType === 'Details'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brokerage">Brokerage</Label>
            <Input
              id="brokerage"
              placeholder="Enter brokerage name"
              value={configuration.brokerage}
              onChange={(e) => setConfiguration({ ...configuration, brokerage: e.target.value })}
              disabled={isLoading || modalType === 'Details'}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            {modalType === 'Connect' && (
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect Account
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
