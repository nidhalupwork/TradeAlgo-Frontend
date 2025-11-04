import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConnectAccount } from '@/lib/types';

interface AccountSelectorProps {
  accounts: ConnectAccount[];
  selectedAccount: { login: string; name: string };
  onAccountToggle: (login: string, name: string) => void;
}

export const AccountSelector = ({ accounts, selectedAccount, onAccountToggle }: AccountSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>Trading Accounts</CardTitle>
        <p className='text-sm text-muted-foreground'>Select accounts to display on the chart</p>
      </CardHeader>
      <CardContent>
        <div className='h-56 space-y-2 scroll-smooth overflow-auto'>
          {accounts
            .sort((a, b) => a.login.localeCompare(b.login))
            .map((account, index) => (
              <div
                key={account.login}
                className='flex items-center justify-between p-3 rounded-lg border bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer'
                onClick={() => onAccountToggle(account.login, account.name)}
              >
                <div className='flex items-center space-x-3 w-full'>
                  <div className='flex justify-between items-center w-full'>
                    <label htmlFor={account.login} className={`text-sm font-medium hover:cursor-pointer`}>
                      {account.name} - {account.login}
                    </label>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedAccount?.login === account?.login
                          ? 'border-[hsl(var(--chart-3))] bg-[hsl(var(--chart-3))]'
                          : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
