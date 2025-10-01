import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  AlertTriangle,
  Clock,
  Target,
  Shield,
  ArrowDownNarrowWide,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSocket } from '@/providers/SocketProvider';
import { useAuth } from '@/providers/AuthProvider';
import { Badge } from '../ui/badge';
import { AccountSelector } from './AccountSelector';
import { TradingChart } from './Chart';
import Api from '@/services/Api';
import { transformData } from '@/utils/utils';

const TradingDashboard = () => {
  const { user } = useAuth();
  const { stats } = useSocket();
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'Open' | 'Close' | 'All'>('All');
  const [filterPrefix, setFilterPrefix] = useState(1);
  const [positions, setPositions] = useState([]);
  const [positionCount, setPositionCount] = useState({
    all: 0,
    open: 0,
    closed: 0,
  });
  const [unrealizedPnl, setUnrealizedPnl] = useState(0);
  const [unrealizedPnlPercentage, setUnrealizedPnlPercentage] = useState(0);
  const [pnl, setPnl] = useState(0);
  const [pnlPercentage, setPnlPercentage] = useState(0);
  const [balance, setBalance] = useState({
    total: 0,
    mt4: 0,
    mt5: 0,
  });
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    if (stats) {
      let temps = [];
      if (activeTab === 'Open') {
        temps = [...stats?.openPositions];
      } else if (activeTab === 'Close') {
        temps = [...stats?.closedPositions];
      } else {
        temps = [...stats?.openPositions, ...stats?.closedPositions];
      }

      setPositions(
        temps.sort((a, b) => {
          if (typeof a[filter] === 'number' && typeof b[filter] === 'number') {
            return (a[filter] - b[filter]) * filterPrefix;
          }
          return (a[filter] as string)?.localeCompare(b[filter] as string) * filterPrefix;
        })
      );
      setPositionCount({
        all: [...stats?.openPositions, ...stats?.closedPositions].length,
        open: stats?.openPositions.length,
        closed: stats?.closedPositions.length,
      });
      setBalance({
        mt4: stats?.balance?.mt4 || 0,
        mt5: stats?.balance?.mt5 || 0,
        total: stats?.balance?.mt4 + stats?.balance?.mt5 || 0,
      });
      setUnrealizedPnl(stats.unrealizedPnl);
      setUnrealizedPnlPercentage(stats.unrealizedPnlPercentage);
      setPnl(stats.pnl);
      setPnlPercentage(stats.pnlPercentage);

      console.log('Positions updated');
    }
  }, [stats, filter, filterPrefix]);

  useEffect(() => {
    fetchPortfolio();
    return () => {
      console.log('Component unmounted');
    };
  }, []);

  function sortPositions(filt: string) {
    let pref = filterPrefix;
    if (filt === filter) {
      setFilterPrefix(filterPrefix * -1);
      pref *= -1;
    } else {
      setFilterPrefix(1);
      setFilter(filt);
      pref = 1;
    }
  }

  async function fetchPortfolio() {
    try {
      const data = await Api.get('/users/portfolio');
      console.log('data for portfolio:', data);
      if (data?.success) {
        const result = transformData(data.data.sort((a, b) => a.accountId.localeCompare(b.accountId)));
        setCharts(result);
      }
    } catch (error) {}
  }

  const handleAccountToggle = (accountId: string, name: string) => {
    setSelectedAccounts((prev) =>
      prev.some((p) => p.accountId === accountId)
        ? prev.filter((p) => p.accountId !== accountId)
        : [...prev, { accountId, name }]
    );
  };

  const ths = [
    { name: 'Symbol', key: 'symbol' },
    { name: 'Type', key: 'type' },
    { name: 'Open Date', key: 'brokerTime' },
    { name: 'Open', key: 'openPrice' },
    { name: 'Size', key: 'volume' },
    { name: 'Close Date', key: 'closedTime' },
    { name: 'Current/Close', key: 'currentPrice' },
    { name: 'Profit', key: 'profit' },
    { name: 'Platform', key: 'platform' },
    // { name: 'Strategy', key: 'strategy' },
    { name: 'Status', key: 'status' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="p-6 space-y-6 scroll-smooth">
      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Account Balance</p>
              <p className="text-2xl font-bold">${balance.total.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                MetaTrader 5: <span className="text-white">${balance.mt5.toLocaleString()}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                MetaTrader 4: <span className="text-white">${balance.mt4.toLocaleString()}</span>
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        {/* PNL */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">P&L</p>
              <p className={`text-2xl font-bold ${pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                ${pnl >= 0 ? '+' : ''}
                {pnl.toFixed(2)}
              </p>
              <p className={`text-sm ${pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                {pnl >= 0 ? '+' : ''}
                {pnlPercentage}%
              </p>
            </div>
            {pnl >= 0 ? <TrendingUp className="h-8 w-8 text-profit" /> : <TrendingDown className="h-8 w-8 text-loss" />}
          </div>
        </Card>

        {/* Open Positions Count */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">All Positions</p>
              <p className="text-2xl font-bold">{positionCount.all}</p>
              <p className="text-sm text-muted-foreground">3 strategies active</p>
            </div>
            <Activity className="h-8 w-8 text-gold" />
          </div>
        </Card>

        {/* Daily Risk Used */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unrealized PNL</p>
              <p className={`text-2xl font-bold ${unrealizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                ${unrealizedPnl >= 0 ? '+' : ''}
                {unrealizedPnl.toFixed(2)}
              </p>
              <p className={`text-sm ${unrealizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                {unrealizedPnl >= 0 ? '+' : ''}
                {unrealizedPnlPercentage}%
              </p>
            </div>
            {unrealizedPnl >= 0 ? (
              <TrendingUp className="h-8 w-8 text-profit" />
            ) : (
              <TrendingDown className="h-8 w-8 text-loss" />
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <AccountSelector
            accounts={user.accounts}
            selectedAccounts={selectedAccounts}
            onAccountToggle={handleAccountToggle}
          />
        </div>

        <div className="lg:col-span-3">
          <TradingChart data={charts} selectedAccounts={selectedAccounts} accounts={user.accounts} />
        </div>
      </div>

      {/* Open Positions Table */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <div className="overflow-x-auto">
            <Tabs value={activeTab} onValueChange={(value: 'Open' | 'Close' | 'All') => setActiveTab(value)}>
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="All">All Positions ({positionCount.all})</TabsTrigger>
                <TabsTrigger value="Open">Open ({positionCount.open})</TabsTrigger>
                <TabsTrigger value="Close">Closed ({positionCount.closed})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <table className="w-full border border-border rounded-[5px]">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border">
                      {ths.map((t) => (
                        <th
                          className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hover:cursor-pointer"
                          onClick={() => sortPositions(t.key)}
                          key={t.key}
                        >
                          <div className="flex gap-1 items-center">
                            <p>{t.name}</p>
                            {filter === t.key && filterPrefix === 1 && <ChevronUp size={20} />}
                            {filter === t.key && filterPrefix === -1 && <ChevronDown size={20} />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position, index) => (
                      <tr
                        key={index}
                        className="border-b border-border/50 hover:bg-card/50 transition-colors even:bg-muted/20"
                      >
                        <td className="py-3 px-4 font-medium">{position.symbol}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              position.type.split('_')[2] === 'BUY'
                                ? 'bg-profit/20 text-profit'
                                : 'bg-loss/20 text-loss'
                            }`}
                          >
                            {position.type.split('_')[2]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{formatDate(position.brokerTime)}</td>
                        <td className="py-3 px-4 font-mono">{position.openPrice}</td>
                        <td className="py-3 px-4">{position.volume}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {position.closedTime ? formatDate(position.closedTime) : '-'}
                        </td>
                        <td className="py-3 px-4 font-mono">{position.currentPrice}</td>
                        <td className="py-3 px-4">
                          <div className={position.profit >= 0 ? 'text-profit' : 'text-loss'}>
                            <p className="font-semibold">
                              ${position.profit >= 0 ? '+' : ''}
                              {position?.profit?.toFixed(2)}
                            </p>
                            {/* <p className="text-xs">
                          {position.pnlPercent >= 0 ? '+' : ''}
                          {position.pnlPercent}%
                        </p> */}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">{position.platform.toUpperCase()}</span>
                        </td>
                        {/* <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">{position.strategy}</span>
                        </td> */}
                        <td className="py-3 px-4">
                          {position.status === 'Closed' ? (
                            <Badge variant="secondary">CLOSED</Badge>
                          ) : (
                            <Badge variant="profit">OPEN</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TradingDashboard;
