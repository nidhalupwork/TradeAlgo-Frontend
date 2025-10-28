import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ConnectAccount } from '@/lib/types';
import { RadioGroupItem } from '../ui/radio-group';

interface AccountSelectorProps {
  accounts: ConnectAccount[];
  selectedAccount: { login: string; name: string };
  onAccountToggle: (login: string, name: string) => void;
}

const accountColors = [
  'border-[hsl(var(--chart-1))] bg-[hsl(var(--chart-1))]',
  'border-[hsl(var(--chart-2))] bg-[hsl(var(--chart-2))]',
  'border-[hsl(var(--chart-3))] bg-[hsl(var(--chart-3))]',
  'border-[hsl(var(--chart-4))] bg-[hsl(var(--chart-4))]',
  'border-[hsl(var(--chart-5))] bg-[hsl(var(--chart-5))]',
  'border-[hsl(var(--chart-6))] bg-[hsl(var(--chart-6))]',
  'border-[hsl(var(--chart-7))] bg-[hsl(var(--chart-7))]',
  'border-[hsl(var(--chart-8))] bg-[hsl(var(--chart-8))]',
  'border-[hsl(var(--chart-9))] bg-[hsl(var(--chart-9))]',
  'border-[hsl(var(--chart-10))] bg-[hsl(var(--chart-10))]',
  'border-[hsl(var(--chart-11))] bg-[hsl(var(--chart-11))]',
  'border-[hsl(var(--chart-12))] bg-[hsl(var(--chart-12))]',
  'border-[hsl(var(--chart-13))] bg-[hsl(var(--chart-13))]',
  'border-[hsl(var(--chart-14))] bg-[hsl(var(--chart-14))]',
  'border-[hsl(var(--chart-15))] bg-[hsl(var(--chart-15))]',
  'border-[hsl(var(--chart-16))] bg-[hsl(var(--chart-16))]',
  'border-[hsl(var(--chart-17))] bg-[hsl(var(--chart-17))]',
  'border-[hsl(var(--chart-18))] bg-[hsl(var(--chart-18))]',
  'border-[hsl(var(--chart-19))] bg-[hsl(var(--chart-19))]',
  'border-[hsl(var(--chart-20))] bg-[hsl(var(--chart-20))]',
];

export const AccountSelector = ({
  accounts,
  selectedAccount,
  onAccountToggle,
}: AccountSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Trading Accounts</CardTitle>
        <p className="text-sm text-muted-foreground">Select accounts to display on the chart</p>
      </CardHeader>
      <CardContent>
        <div className="h-56 space-y-2 scroll-smooth overflow-auto">
          {accounts
            .sort((a, b) => a.login.localeCompare(b.login))
            .map((account, index) => (
              <div
                key={account.login}
                className="flex items-center justify-between p-3 rounded-lg border bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                onClick={() => onAccountToggle(account.login, account.name)}
              >
                <div className="flex items-center space-x-3 w-full">
                  {/* <Checkbox
                    id={account.accountId}
                    checked={selectedAccounts.some((s) => s.accountId === account.accountId)}
                    // onCheckedChange={() => onAccountToggle(account.accountId, account.name)}
                    className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                  /> */}
                  {/* <input
                    type='radio'
                    value='test'
                    checked={selectedAccount?.accountId === account?.accountId}
                  /> */}
                  <div className="flex justify-between items-center w-full">
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
                    {/* <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        accountColors[selectedAccounts.findIndex((s) => s.accountId === account.accountId)]
                      }`}
                    /> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
