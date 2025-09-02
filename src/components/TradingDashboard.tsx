import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign,
  AlertTriangle,
  Clock,
  Target,
  Shield
} from "lucide-react";

const TradingDashboard = () => {
  // Mock data for demonstration
  const accountBalance = 25000;
  const dailyPnL = 450.25;
  const dailyPnLPercent = 1.8;
  const openPositions = 3;
  const dailyRiskUsed = 45;

  const positions = [
    {
      id: 1,
      symbol: "EUR/USD",
      type: "BUY",
      entry: 1.0856,
      current: 1.0872,
      size: 0.5,
      pnl: 80.00,
      pnlPercent: 0.32,
      stopLoss: 1.0836,
      takeProfit: 1.0896,
      strategy: "Momentum Pro"
    },
    {
      id: 2,
      symbol: "GBP/JPY",
      type: "SELL",
      entry: 188.45,
      current: 188.20,
      size: 0.3,
      pnl: 75.00,
      pnlPercent: 0.30,
      stopLoss: 188.75,
      takeProfit: 187.95,
      strategy: "Range Breaker"
    },
    {
      id: 3,
      symbol: "BTC/USD",
      type: "BUY",
      entry: 42150,
      current: 41950,
      size: 0.01,
      pnl: -20.00,
      pnlPercent: -0.08,
      stopLoss: 41500,
      takeProfit: 43000,
      strategy: "Crypto Trend"
    }
  ];

  const recentAlerts = [
    { time: "14:32", symbol: "EUR/USD", action: "BUY", strategy: "Momentum Pro" },
    { time: "14:15", symbol: "GBP/JPY", action: "SELL", strategy: "Range Breaker" },
    { time: "13:45", symbol: "BTC/USD", action: "BUY", strategy: "Crypto Trend" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Account Balance</p>
              <p className="text-2xl font-bold">${accountBalance.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Daily P&L</p>
              <p className={`text-2xl font-bold ${dailyPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                ${dailyPnL >= 0 ? '+' : ''}{dailyPnL.toFixed(2)}
              </p>
              <p className={`text-sm ${dailyPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                {dailyPnL >= 0 ? '+' : ''}{dailyPnLPercent}%
              </p>
            </div>
            {dailyPnL >= 0 ? (
              <TrendingUp className="h-8 w-8 text-profit" />
            ) : (
              <TrendingDown className="h-8 w-8 text-loss" />
            )}
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Positions</p>
              <p className="text-2xl font-bold">{openPositions}</p>
              <p className="text-sm text-muted-foreground">3 strategies active</p>
            </div>
            <Activity className="h-8 w-8 text-gold" />
          </div>
        </Card>

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

      {/* Open Positions Table */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Open Positions</h2>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Symbol</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Entry</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Current</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">P&L</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Strategy</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{position.symbol}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        position.type === 'BUY' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                      }`}>
                        {position.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{position.entry}</td>
                    <td className="py-3 px-4">{position.current}</td>
                    <td className="py-3 px-4">{position.size}</td>
                    <td className="py-3 px-4">
                      <div className={position.pnl >= 0 ? 'text-profit' : 'text-loss'}>
                        <p className="font-semibold">
                          ${position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                        </p>
                        <p className="text-xs">
                          {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent}%
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{position.strategy}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Close</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      alert.action === 'BUY' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                    }`}>
                      {alert.action}
                    </span>
                    <span className="text-xs text-muted-foreground">{alert.strategy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Risk Metrics */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
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
                <span className="px-2 py-1 rounded text-xs font-semibold bg-profit/20 text-profit">
                  HEALTHY
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TradingDashboard;