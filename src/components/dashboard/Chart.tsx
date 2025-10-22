import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ConnectAccount } from '@/lib/types';
import { useMemo } from 'react';

interface TradingChartProps {
  data: any;
  selectedAccount: { accountId: string; name: string };
  accounts: ConnectAccount[];
  range: '1m' | '3m' | '1y';
  currency: string;
  setRange: React.Dispatch<React.SetStateAction<'3m' | '1y' | '1m'>>;
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

const CustomTooltip = ({ active, payload, label, account }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="text-sm font-medium text-card-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {/* {accounts.find((a) => a.accountId === entry.dataKey)?.name}: ${entry.value.toLocaleString()} */}
            {account?.name}: {entry.value.toLocaleString()}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomizedDot = ({ cx, cy, stroke, payload, value, index, data, accountId, interval }: any) => {
  const prevValue = index > 0 ? data[index - 1][accountId] : 0;
  // const fillColor = prevValue !== null && value[value.length - 1] < prevValue ? 'red' : 'hsl(var(--chart-3))';
  if (index % interval !== 0) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeWidth="2"
      strokeLinejoin="round"
      className="lucide lucide-dot-icon lucide-dot"
      x={cx - 10}
      y={cy - 10}
      width={20}
      height={20}
      fill="hsl(var(--chart-3))"
    >
      <circle cx="12" cy="12" r="5" />
    </svg>
  );
};

export const TradingChart = ({ data, selectedAccount, accounts, currency, range, setRange }: TradingChartProps) => {
  // Choose XAxis tick formatter and ticks interval based on range
  const { tickFormatter, interval } = useMemo(() => {
    if (range === '1m') {
      return {
        tickFormatter: (val: number) =>
          new Date(val).toLocaleString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
        interval: 1,
      };
    } else if (range === '3m') {
      return {
        tickFormatter: (val: number) =>
          new Date(val).toLocaleString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
        interval: 4,
      };
    } else if (range === '1y') {
      return {
        tickFormatter: (val: number) =>
          new Date(val).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }),
        interval: 31,
      };
    } else {
      return {
        tickFormatter: (val: number) => new Date(val).toLocaleString(),
        interval: 1,
      };
    }
  }, [range]);

  const { min, max } = useMemo(() => {
    const min = Math.min(...data.map((d) => d[selectedAccount?.accountId]));
    const max = Math.max(...data.map((d) => d[selectedAccount?.accountId]));
    const padding = (max - min) * 0.1;
    return { min: (min >= padding ? min : padding) - padding, max: max + padding };
  }, [data, selectedAccount]);

  // const [off, setOff] = useState(0);
  // useEffect(() => {
  //   if (data) {
  //     setOff(gradientOffset() ?? 0);
  //   }
  // }, [selectedAccount]);
  // const gradientOffset = () => {
  //   const dataMax = Math.max(...data.map((i) => i[selectedAccount.accountId]));
  //   const dataMin = Math.min(...data.map((i) => i[selectedAccount.accountId]));
  //   if (Number.isNaN(dataMax) || Number.isNaN(dataMin)) {
  //     return 1;
  //   }
  //   // if (dataMax <= 5000) {
  //   //   return 0;
  //   // }
  //   // if (dataMin >= 5000) {
  //   //   return 1;
  //   // }
  //   return dataMax / (dataMax - dataMin);
  // };

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
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
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
                tickFormatter={(value) => `${value}%`}
                domain={[min, max]}
              />
              <Tooltip content={<CustomTooltip account={selectedAccount} />} />
              {/* {data && ( */}
              {/* <defs>
                <linearGradient id="splitColor" x1="-1" y1="0" x2="1" y2="0">
                  <stop offset={off} stopColor="hsl(var(--chart-3))" stopOpacity={1} />
                  <stop offset={off} stopColor="hsl(var(--chart-1))" stopOpacity={1} />
                </linearGradient>
              </defs> */}
              {/* )} */}
              {selectedAccount && (
                <Area
                  type="monotone"
                  className="relative"
                  dataKey={selectedAccount.accountId}
                  stroke={accountColors[2]}
                  strokeWidth={1}
                  activeDot={{ r: 6, stroke: accountColors[2], strokeWidth: 2, fill: 'hsl(var(--background))' }}
                  fill={accountColors[2]}
                  // dot={<CustomizedDot data={data} accountId={selectedAccount.accountId} interval={interval} />}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
