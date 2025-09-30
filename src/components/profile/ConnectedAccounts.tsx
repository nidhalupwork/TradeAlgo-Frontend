import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit3, Eye, EyeOff, Plus, Save, Settings, TrendingUp, X, Zap } from 'lucide-react';
import { AccountConfigModal } from './AccountConfigModal';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { ConnectAccount } from '@/lib/types';
import Api from '@/services/Api';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';

export const ConnectedAccounts = () => {
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [accounts, setAccounts] = useState<ConnectAccount[]>();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'Details' | 'Connect'>('Details');
  const [metaToken, setMetaToken] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setAccounts(user?.accounts);
    setMetaToken(user?.metaApiToken ?? '');
  }, [user]);

  const handleConfigure = (account: ConnectAccount, type: 'Details' | 'Connect') => {
    setSelectedAccount(account);
    setModalType(type);
    setModalOpen(true);
  };

  async function handleActiveClick(accountId: string) {
    try {
      const data = await Api.post('/users/account/active', { accountId });
      setUser(data.user);
    } catch (error) {
      console.error('Error while activating:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Unexpected Error',
        variant: 'destructive',
      });
    }
  }

  async function handleSaveToken() {
    try {
      const data = await Api.post('/users/meta-token', { token: metaToken });
      setUser(data.user);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Successfully updated meta API token',
        variant: 'profit',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Unexpected Error',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Connected Accounts
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Manage your trading platform connections</p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() =>
            handleConfigure(
              {
                accountId: '',
                active: false,
                brokerage: '',
                login: '',
                magic: '',
                name: '',
                platform: 'mt4',
                subscribedStrategies: [],
              },
              'Connect'
            )
          }
        >
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {accounts?.map((account, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-lg border bg-gradient-subtle">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold">{account.name}</h4>
                <span className="text-sm text-muted-foreground">{account.platform.toUpperCase()}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{account.brokerage}</span>
                  {/* <Badge
                    variant={account.status === 'connected' ? 'default' : 'destructive'}
                    className={account.status === 'connected' ? 'bg-success/10 text-success border-success/20' : ''}
                  >
                    {account.status}
                  </Badge> */}
                </div>
                {/* <p className="text-sm font-medium">Balance: {account.balance}</p> */}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch checked={account.active} onClick={() => handleActiveClick(account.accountId)} />
                <span className="text-sm text-muted-foreground">{account.active ? 'Active' : 'Inactive'}</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleConfigure(account, 'Details')}>
                <Settings className="h-4 w-4" />
                Details
              </Button>
            </div>
          </div>
        ))}
        <div className="space-y-2 border-t-2 pt-2">
          <div className="flex justify-between items-center">
            <Label>Meta API token</Label>
            <Button
              variant={isEditing ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={metaToken}
              disabled={!isEditing}
              className="pr-8"
              onChange={(e) => setMetaToken(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute  right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <Button className="gap-2" onClick={() => handleSaveToken()}>
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>

      <AccountConfigModal
        account={selectedAccount}
        open={modalOpen}
        onOpenChange={setModalOpen}
        modalType={modalType}
      />
    </Card>
  );
};
