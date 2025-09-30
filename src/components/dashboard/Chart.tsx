import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ConnectAccount } from '@/lib/types';

interface TradingChartProps {
  data: any[];
  selectedAccounts: { accountId: string; name: string }[];
  accounts: ConnectAccount[];
}

const accountColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
  'hsl(var(--chart-9))',
  'hsl(var(--chart-10))',
  'hsl(var(--chart-11))',
  'hsl(var(--chart-12))',
  'hsl(var(--chart-13))',
  'hsl(var(--chart-14))',
  'hsl(var(--chart-15))',
  'hsl(var(--chart-16))',
  'hsl(var(--chart-17))',
  'hsl(var(--chart-18))',
  'hsl(var(--chart-19))',
  'hsl(var(--chart-20))',
];

const CustomTooltip = ({ active, payload, label, accounts }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="text-sm font-medium text-card-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {accounts.find((a) => a.accountId === entry.dataKey).name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const TradingChart = ({ data, selectedAccounts, accounts }: TradingChartProps) => {
  const [range, setRange] = useState<'1m' | '3m' | '1y'>('1m');

  // Choose XAxis tick formatter and ticks interval based on range
  let tickFormatter;
  let interval;
  if (range === '1m') {
    tickFormatter = (val) => {
      return new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };
    interval = 2; // show all or every tick
  } else if (range === '3m') {
    tickFormatter = (val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    interval = 3; // show every 3rd tick
  } else if (range === '1y') {
    tickFormatter = (val) =>
      new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    interval = 5; // show every 6th tick
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-xl font-semibold">Account Growth Performance</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setRange('1m')}>
            1m
          </Button>
          <Button variant="outline" size="sm" onClick={() => setRange('3m')}>
            3m
          </Button>
          <Button variant="outline" size="sm" onClick={() => setRange('1y')}>
            1y
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[248px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={true}
                axisLine={true}
                tickFormatter={tickFormatter}
                interval={interval}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={true}
                axisLine={true}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip accounts={selectedAccounts} />} />
              {/* <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
                formatter={(value) => accountNames[value as keyof typeof accountNames]}
              /> */}

              {selectedAccounts.map((a, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={a.accountId}
                  stroke={accountColors[index]}
                  // hide={!selectedAccounts.some((sa) => sa.accountId === a.accountId)}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, stroke: accountColors[index], strokeWidth: 2, fill: 'hsl(var(--background))' }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
