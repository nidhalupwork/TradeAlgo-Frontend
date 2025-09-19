import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ConnectAccount } from '@/lib/types';

interface AccountSelectorProps {
  accounts: ConnectAccount[];
  selectedAccounts: string[];
  onAccountToggle: (accountId: string) => void;
}

export const AccountSelector = ({ accounts, selectedAccounts, onAccountToggle }: AccountSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Trading Accounts</CardTitle>
        <p className="text-sm text-muted-foreground">Select accounts to display on the chart</p>
      </CardHeader>
      <CardContent>
        <div className="h-56 space-y-2 scroll-smooth overflow-auto">
          {accounts.map((account) => (
            <div
              key={account.accountId}
              className="flex items-center justify-between p-3 rounded-lg border bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={account.accountId}
                  checked={selectedAccounts.includes(account.accountId)}
                  onCheckedChange={() => onAccountToggle(account.accountId)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div>
                  <label htmlFor={account.accountId} className="text-sm font-medium cursor-pointer">
                    {account.name}
                  </label>
                </div>
              </div>
              {/* <div className="text-right">
                <Badge
                  variant={account.change >= 0 ? 'default' : 'destructive'}
                  className={`${account.change >= 0 ? 'bg-profit text-profit-foreground' : ''}`}
                >
                  {account.change >= 0 ? '+' : ''}${account.change.toLocaleString()}(
                  {account.changePercent >= 0 ? '+' : ''}
                  {account.changePercent.toFixed(2)}%)
                </Badge>
              </div> */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
