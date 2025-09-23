import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, DollarSign, AlertTriangle, Clock, Target, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import Api from '@/services/Api';
import { useSocket } from '@/providers/SocketProvider';
import { useAuth } from '@/providers/AuthProvider';
import { Badge } from '../ui/badge';
import { AccountSelector } from './AccountSelector';
import { TradingChart } from './Chart';
import { chartData } from '@/data/mockData';

const TradingDashboard = () => {
  const { user } = useAuth();
  const { stats } = useSocket();
  const [filter, setFilter] = useState<'Open' | 'Close' | 'All'>('All');
  const [positions, setPositions] = useState([]);
  const [positionCount, setPositionCount] = useState(0);
  const [pnl, setPnl] = useState(0);
  const [pnlPercentage, setPnlPercentage] = useState(0);
  const [balance, setBalance] = useState({
    total: 0,
    mt4: 0,
    mt5: 0,
  });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  useEffect(() => {
    if (stats) {
      if (filter === 'Open') {
        setPositions([...stats?.openPositions]);
      } else if (filter === 'Close') {
        setPositions([...stats?.closedPositions]);
      } else {
        setPositions([...stats?.closedPositions, ...stats?.openPositions]);
      }
      setPositionCount([...stats?.closedPositions, stats?.openPositions].length);
      setBalance({
        mt4: stats?.balance?.mt4 || 0,
        mt5: stats?.balance?.mt5 || 0,
        total: stats?.balance?.mt4 + stats?.balance?.mt5 || 0,
      });
      setPnl(stats.pnl);
      setPnlPercentage(stats.pnlPercentage);
    }
  }, [stats]);

  useEffect(() => {
    console.log('Component mounted');
    return () => {
      console.log('Component unmounted');
    };
  }, []);

  // Mock data for demonstration
  const dailyRiskUsed = 45;

  function handleOpenCloseClick(type: 'Open' | 'Close' | 'All') {
    if (type === 'Open') {
      setPositions([...stats?.openPositions]);
    } else if (type === 'Close') {
      setPositions([...stats?.closedPositions]);
    } else {
      setPositions([...stats?.closedPositions, ...stats?.openPositions]);
    }
    setFilter(type);
  }

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId]
    );
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
              <p className="text-sm text-muted-foreground">Open Positions</p>
              <p className="text-2xl font-bold">{positionCount}</p>
              <p className="text-sm text-muted-foreground">3 strategies active</p>
            </div>
            <Activity className="h-8 w-8 text-gold" />
          </div>
        </Card>

        {/* Daily Risk Used */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Daily Risk Used</p>
              <p className="text-2xl font-bold">{dailyRiskUsed}%</p>
              <Progress value={dailyRiskUsed} className="mt-2 h-2" />
            </div>
            <Shield className="h-8 w-8 text-primary" />
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
          <TradingChart data={chartData} selectedAccounts={selectedAccounts} />
        </div>
      </div>

      {/* Open Positions Table */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Order History</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleOpenCloseClick('Open')}>
                Open Trades
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenCloseClick('Close')}>
                Closed Trades
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenCloseClick('All')}>
                View All
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Symbol</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Open Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Open</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Close Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Current/Close</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Profit</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Platform</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Strategy</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{position.symbol}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          position.type.split('_')[2] === 'BUY' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                        }`}
                      >
                        {position.type.split('_')[2]}
                      </span>
                    </td>
                    <td className="py-3 px-4">{position.brokerTime.slice(0, 19)}</td>
                    <td className="py-3 px-4">{position.openPrice}</td>
                    <td className="py-3 px-4">{position.volume}</td>
                    <td className="py-3 px-4 text-center">
                      {position.closedTime ? position.closedTime.slice(0, 19) : '-'}
                    </td>
                    <td className="py-3 px-4">{position.currentPrice}</td>
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
                      <span className="text-sm text-muted-foreground">{position.platform}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{position.strategy}</span>
                    </td>
                    <td className="py-3 px-4">
                      {position.status === 'Closed' ? (
                        <Badge className="bg-loss/20 text-loss">Closed</Badge>
                      ) : (
                        <Badge className="bg-profit/20 text-profit">Open</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Recent Alerts */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Alerts</h2>
              <AlertTriangle className="h-5 w-5 text-gold" />
            </div>

            <div className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{alert.time}</span>
                    <span className="font-medium">{alert.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        alert.action === 'BUY' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                      }`}
                    >
                      {alert.action}
                    </span>
                    <span className="text-xs text-muted-foreground">{alert.strategy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card> */}

      {/* Risk Metrics */}
      {/* <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Risk Metrics</h2>
              <Shield className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Max Daily Loss</span>
                  <span className="text-sm font-medium">$500 / $1,000</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Drawdown</span>
                  <span className="text-sm font-medium">$750 / $2,500</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Active Positions</span>
                  <span className="text-sm font-medium">3 / 5</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-medium">Risk Status</span>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-profit/20 text-profit">HEALTHY</span>
              </div>
            </div>
          </div>
        </Card>
      </div> */}
    </div>
  );
};

export default TradingDashboard;
