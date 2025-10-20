import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, BarChart3, Clock, Users, Star, Info, Check, Settings, CircleAlert, Activity } from 'lucide-react';
import Api from '@/services/Api';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { RiskConfigModal } from './RiskConfigModal';
import { RiskSettingsInterface, StrategyInterface } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { RiskSettingModal } from './RiskSettingModal';
import Announcement from './Announcement';

const StrategyMarketplace = () => {
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [strategies, setStrategies] = useState<StrategyInterface[]>([]);
  const [strategy, setStrategy] = useState<StrategyInterface | null>(null);
  const [open, setOpen] = useState<'Global' | 'Strategy' | ''>('');
  const [stats, setStats] = useState({
    count: 0,
    avgMonthlyReturn: 0,
    activeUsersCount: 0,
    avgRating: 0,
  });

  useEffect(() => {
    fetchStrategies();
  }, []);

  async function fetchStrategies() {
    try {
      const data = await Api.get('/strategy');
      console.log('Data for fetching strategies:', data);

      if (data?.success && data?.strategy) {
        setStrategies(data.strategy);
        setStats({
          count: data.strategyStats.count,
          avgMonthlyReturn: data.strategyStats.avgMonthlyReturn,
          activeUsersCount: data.strategyStats.activeUsersCount,
          avgRating: data.strategyStats.avgRating,
        });
      }
    } catch (error) {
      console.error('Error while fetching strategies:', error);
    }
  }

  async function subscribeStrategy(strategyId: string, accountId: string, type: string) {
    try {
      const data = await Api.post('/strategy/subscribe', { strategyId, accountId, type });
      console.log('data for subscribing strategy', data);
      if (data?.success) {
        const temp = [...strategies];
        const index = temp.findIndex((stg) => stg._id === strategyId);
        if (index !== -1) {
          temp[index] = data.strategy;
        } else {
          temp.push(data.strategy);
        }
        setStrategies(temp);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error while subscribing strategy:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.response?.data?.error?.strategy ?? error?.response?.data?.message ?? 'Somethign went wrong',
      });
    }
  }

  function onConfigModalOpen(strat: any) {
    setOpen('Strategy');
    setStrategy(strat);
  }

  function onConfigModalClose() {
    setOpen('');
    setStrategy(null);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Strategy Marketplace</h1>
          <p className="text-muted-foreground">Select, connect and configure your automated trading strategies.</p>
        </div>

        <Button variant="gold" onClick={() => setOpen('Global')}>
          Update RiskSettings
        </Button>
      </div>
      {/* {user.status === 'pending' && <Announcement />} */}
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            {user.status === 'active' && (
              <div>
                <p className="text-2xl font-bold">{stats.count.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Available Strategies</p>
              </div>
            )}
            {user.status === 'pending' && (
              <div>
                <p className="text-2xl font-bold">Not Available</p>
                <p className="text-sm text-muted-foreground">Required account approval</p>
              </div>
            )}
          </div>
        </Card>

        {/* <Card className='p-4 bg-card/50 backdrop-blur-sm border-border/50'>
          <div className='flex items-center gap-3'>
            <Users className='h-8 w-8 text-profit' />
            <div>
              <p className='text-2xl font-bold'>{stats.activeUsersCount.toLocaleString()}</p>
              <p className='text-sm text-muted-foreground'>Available Markets</p>
            </div>
          </div>
        </Card> */}

        {/* <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-gold" />
            <div>
              <p className="text-2xl font-bold">{stats.avgMonthlyReturn.toLocaleString()}%</p>
              <p className="text-sm text-muted-foreground">Active Algorithms</p>
            </div>
          </div>
        </Card> */}
      </div>
      {/* Strategy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <Card
            key={strategy?.title}
            className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all ${
              strategy?.enabled ? 'ring-2 ring-profit/20' : ''
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className=" w-full">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{strategy?.title}</h3>
                      <Badge
                        className={
                          strategy?.status === 'Live'
                            ? 'bg-profit/20 text-profit'
                            : strategy?.status === 'Paused'
                            ? 'bg-gold/20 text-gold'
                            : 'bg-primary/20 text-primary'
                        }
                      >
                        {strategy?.status}
                      </Badge>
                    </div>
                    {user?.role === 'admin' && <Switch checked={strategy?.enabled} />}
                  </div>
                  <p className="text-sm text-muted-foreground">{strategy?.description}</p>
                </div>
              </div>

              {/* Stats Grid */}
              {/* <div className="grid grid-cols-2 gap-3 mb-4">
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
              </div> */}

              {/* Markets and Timeframe */}
              {/* <div className="flex flex-wrap gap-2 mb-4">
                {strategy.tags.map((market) => (
                  <Badge key={market} variant="outline" className="text-xs">
                    {market}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {strategy.timeframe}
                </Badge>
              </div> */}

              {/* Footer */}
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">Select the account to subscribe this strategy.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    {user?.accounts.map((acc) => {
                      return (
                        <div key={acc.accountId} className="flex gap-2 items-center mt-1">
                          <Checkbox
                            checked={acc.strategySettings.find((ss) => ss.strategyId === strategy._id)?.subscribed}
                            onClick={() => {
                              subscribeStrategy(strategy._id, acc.accountId, '');
                            }}
                          />
                          {acc.name}
                        </div>
                      );
                    })}
                    {user?.accounts?.length > 1 && (
                      <div className="flex gap-2 items-center mt-1">
                        <Checkbox
                          checked={user.accounts.every(
                            (account) =>
                              account?.strategySettings?.find((ss) => ss.strategyId === strategy._id)?.subscribed
                          )}
                          onClick={() => {
                            subscribeStrategy(strategy._id, '', 'All');
                          }}
                        />{' '}
                        All
                      </div>
                    )}
                    {user?.accounts?.length === 0 && (
                      <div className="flex gap-2 items-center mt-1">
                        <CircleAlert color="gold" size={20} />
                        <p className="text-muted-foreground text-sm">You have no account</p>
                      </div>
                    )}
                  </div>
                  {user?.status === 'active' && user?.accounts?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onConfigModalOpen(strategy)}>
                        <Settings />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* For each account */}
      <RiskConfigModal open={open} onConfigModalClose={onConfigModalClose} strategy={strategy} />

      {/* For whole accounts */}
      <RiskSettingModal open={open} onModalClose={() => setOpen('')} />
    </div>
  );
};

export default StrategyMarketplace;
