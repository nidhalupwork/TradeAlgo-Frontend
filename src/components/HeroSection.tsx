import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-profit/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Zap className="h-4 w-4 text-gold" />
            <span className="text-sm text-gold font-medium">Advanced Trading Automation Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Bridge Your TradingView
            <br />
            <span className="bg-gradient-profit bg-clip-text">Signals to Success</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Seamlessly connect TradingView alerts to MetaTrader, cTrader, dxTrade, and Tradovate. Advanced risk
            management, automated position sizing, and real-time monitoring.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/dashboard">
              <Button size="xl" variant="gold" className="group">
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/strategies">
              <Button size="xl" variant="outline">
                <BarChart3 className="mr-2 h-5 w-5" />
                Explore Strategies
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors">
              <Shield className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Advanced Risk Controls</h3>
              <p className="text-sm text-muted-foreground">
                Automated position sizing, max loss limits, and daily drawdown protection
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:border-profit/50 transition-colors">
              <TrendingUp className="h-10 w-10 text-profit mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Multiple Strategies</h3>
              <p className="text-sm text-muted-foreground">
                Choose from proven setups or create your own custom trading strategies
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:border-gold/50 transition-colors">
              <Zap className="h-10 w-10 text-gold mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Real-Time Execution</h3>
              <p className="text-sm text-muted-foreground">
                Lightning-fast order execution across multiple broker platforms
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
