import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '../ui/button';

interface ChartData {
  date: string;
  account1: number;
  account2: number;
  account3: number;
  account4: number;
}

interface TradingChartProps {
  data: ChartData[];
  selectedAccounts: string[];
}

const accountColors = {
  account1: 'hsl(var(--chart-1))',
  account2: 'hsl(var(--chart-2))',
  account3: 'hsl(var(--chart-3))',
  account4: 'hsl(var(--chart-4))',
};

const accountNames = {
  account1: 'Growth Account',
  account2: 'Conservative Account',
  account3: 'Aggressive Account',
  account4: 'Balanced Account',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="text-sm font-medium text-card-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {accountNames[entry.dataKey as keyof typeof accountNames]}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const TradingChart = ({ data, selectedAccounts }: TradingChartProps) => {
  const [range, setRange] = useState<'1m' | '3m' | '1y'>('1m');
  // function PortfolioChart({ data, range }) {
  // `range` could be '1m', '3m', or '1y'

  // Filter data based on range
  const now = new Date();
  const filteredData = data.filter((d) => {
    const date = new Date(d.date);
    if (range === '1m') {
      return date >= new Date(now.setMonth(now.getMonth() - 1));
    } else if (range === '3m') {
      return date >= new Date(now.setMonth(now.getMonth() - 3));
    } else if (range === '1y') {
      return date >= new Date(now.setFullYear(now.getFullYear() - 1));
    }
    return true;
  });

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
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
                formatter={(value) => accountNames[value as keyof typeof accountNames]}
              />

              {selectedAccounts.includes('b664d005-f96a-4052-9a96-ee5124f84704') && (
                <Line
                  type="monotone"
                  dataKey="account1"
                  stroke={accountColors.account1}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, stroke: accountColors.account1, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
