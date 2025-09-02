import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  TrendingUp, 
  BarChart3, 
  Clock,
  Users,
  Star,
  Info,
  Check
} from "lucide-react";

const StrategyMarketplace = () => {
  const strategies = [
    {
      id: 1,
      name: "Momentum Pro",
      description: "Advanced momentum-based strategy for trending markets",
      category: "Trend Following",
      winRate: 68,
      avgProfit: 2.5,
      avgLoss: 1.2,
      monthlyReturn: 12.5,
      subscribers: 234,
      rating: 4.8,
      markets: ["Forex", "Crypto"],
      timeframe: "15M, 1H",
      enabled: true,
      premium: false
    },
    {
      id: 2,
      name: "Range Breaker",
      description: "Breakout strategy for range-bound markets with high accuracy",
      category: "Breakout",
      winRate: 72,
      avgProfit: 1.8,
      avgLoss: 0.9,
      monthlyReturn: 15.2,
      subscribers: 189,
      rating: 4.9,
      markets: ["Forex", "Indices"],
      timeframe: "30M, 4H",
      enabled: true,
      premium: true
    },
    {
      id: 3,
      name: "Crypto Trend",
      description: "Specialized cryptocurrency trend following system",
      category: "Crypto",
      winRate: 65,
      avgProfit: 3.2,
      avgLoss: 1.5,
      monthlyReturn: 18.7,
      subscribers: 412,
      rating: 4.6,
      markets: ["Crypto"],
      timeframe: "1H, 1D",
      enabled: false,
      premium: true
    },
    {
      id: 4,
      name: "Scalper Elite",
      description: "High-frequency scalping strategy for quick profits",
      category: "Scalping",
      winRate: 78,
      avgProfit: 0.5,
      avgLoss: 0.3,
      monthlyReturn: 8.3,
      subscribers: 156,
      rating: 4.7,
      markets: ["Forex"],
      timeframe: "1M, 5M",
      enabled: false,
      premium: false
    },
    {
      id: 5,
      name: "Smart Grid",
      description: "Intelligent grid trading system with dynamic adjustments",
      category: "Grid Trading",
      winRate: 70,
      avgProfit: 1.2,
      avgLoss: 0.6,
      monthlyReturn: 10.5,
      subscribers: 298,
      rating: 4.5,
      markets: ["Forex", "Commodities"],
      timeframe: "Any",
      enabled: true,
      premium: true
    },
    {
      id: 6,
      name: "News Trader",
      description: "Event-driven strategy based on economic news releases",
      category: "News Trading",
      winRate: 62,
      avgProfit: 2.8,
      avgLoss: 1.4,
      monthlyReturn: 11.2,
      subscribers: 167,
      rating: 4.4,
      markets: ["Forex", "Indices"],
      timeframe: "5M, 15M",
      enabled: false,
      premium: false
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Strategy Marketplace</h1>
          <p className="text-muted-foreground">Choose from proven trading strategies or create your own</p>
        </div>
        <Button variant="gold">
          Create Custom Strategy
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Available Strategies</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-profit" />
            <div>
              <p className="text-2xl font-bold">1,456</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-gold" />
            <div>
              <p className="text-2xl font-bold">14.3%</p>
              <p className="text-sm text-muted-foreground">Avg Monthly Return</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-warning" />
            <div>
              <p className="text-2xl font-bold">4.7</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <Card 
            key={strategy.id} 
            className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all ${
              strategy.enabled ? 'ring-2 ring-profit/20' : ''
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{strategy.name}</h3>
                    {strategy.premium && (
                      <Badge className="bg-gradient-gold text-background">Premium</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
                <Switch 
                  checked={strategy.enabled}
                  className="data-[state=checked]:bg-profit"
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-background/50 rounded p-2">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="text-lg font-semibold text-profit">{strategy.winRate}%</p>
                </div>
                <div className="bg-background/50 rounded p-2">
                  <p className="text-xs text-muted-foreground">Monthly Return</p>
                  <p className="text-lg font-semibold text-primary">+{strategy.monthlyReturn}%</p>
                </div>
                <div className="bg-background/50 rounded p-2">
                  <p className="text-xs text-muted-foreground">Avg Profit</p>
                  <p className="text-lg font-semibold">+{strategy.avgProfit}%</p>
                </div>
                <div className="bg-background/50 rounded p-2">
                  <p className="text-xs text-muted-foreground">Avg Loss</p>
                  <p className="text-lg font-semibold">-{strategy.avgLoss}%</p>
                </div>
              </div>

              {/* Markets and Timeframe */}
              <div className="flex flex-wrap gap-2 mb-4">
                {strategy.markets.map((market) => (
                  <Badge key={market} variant="outline" className="text-xs">
                    {market}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {strategy.timeframe}
                </Badge>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="text-sm font-medium">{strategy.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{strategy.subscribers}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {strategy.enabled && (
                    <Check className="h-4 w-4 text-profit" />
                  )}
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategyMarketplace;