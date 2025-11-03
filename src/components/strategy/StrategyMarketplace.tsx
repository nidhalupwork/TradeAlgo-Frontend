import Api from '@/services/Api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { RiskConfigModal } from './RiskConfigModal';
import { MarketplaceOpen, StrategyInterface } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { RiskSettingModal } from './AccountRiskSettingModal';
import { TradingTimeModal } from './TradingTimeModal';
import { Spinner } from '../ui/Spinner';
import { PageDescription, PageHeader } from '../components/PageHeader';
import { AddStrategyCard } from './AddStrategyCard';
import { StrategyCard } from './StrategyCard';
import { AddCustomStrategyModal } from './AddCustomStrategyModal';
import { DeleteModal } from './DeleteModal';
import { toast } from 'sonner';

const StrategyMarketplace = () => {
  const { user, setUser } = useAuth();
  const [strategies, setStrategies] = useState<StrategyInterface[]>([]);
  const [strategy, setStrategy] = useState<StrategyInterface | null>(null);
  const [open, setOpen] = useState<MarketplaceOpen>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);
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
    setIsLoading(false);
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
      toast.error(error?.response?.data?.error?.strategy ?? error?.response?.data?.message ?? 'Somethign went wrong');
    }
  }

  async function confirmDelete() {
    setIsLoading(true);
    try {
      const data = await Api.delete(`/strategy/${strategy._id}`);
      console.log('data:', data);
      if (data?.success) {
        setStrategies(strategies.filter((s) => s._id !== strategy._id));
        toast.success('Successfully deleted');
        setStrategy(null);
        setOpen('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unexpected Error');
    }
    setIsLoading(false);
  }

  function onConfigModalOpen(strat: any) {
    setOpen('Strategy');
    setStrategy(strat);
  }

  function onModalClose() {
    if (isLoading) {
      return;
    }
    setOpen('');
    setStrategy(null);
  }

  return open === '' && isLoading === true ? (
    <div className='w-full h-[calc(100vh-64px)] flex items-center justify-center'>
      <Spinner className='w-12 h-12' />
    </div>
  ) : (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <PageHeader>Strategy Marketplace</PageHeader>
          <PageDescription>Select, connect and configure your automated trading strategies.</PageDescription>
        </div>

        {user.status === 'active' && (
          <div className='flex flex-col lg:flex-row gap-2'>
            <Button
              variant='gold'
              className='md:text-sm text-xs px-2 md:px-4 py-0.5 h-6 sm:h-8 md:h-9'
              onClick={() => setOpen('Global')}
            >
              <span className='hidden sm:flex'>Account Risk Settings</span>
              <span className='sm:hidden'>Account Settings</span>
            </Button>
            <Button
              variant='gold'
              className='md:text-sm text-xs px-2 md:px-4 py-0.5 h-6 sm:h-8 md:h-9'
              onClick={() => setOpen('Time')}
            >
              <span className='hidden sm:flex'>Trading Time Settings</span>
              <span className='sm:hidden'>Time Settings</span>
            </Button>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='p-4 bg-card/50 backdrop-blur-sm border-border/50'>
          <div className='flex items-center gap-3'>
            <Activity className='h-8 w-8 text-primary' />
            {user.status === 'active' && (
              <div>
                <p className='text-2xl font-bold'>{stats.count.toLocaleString()}</p>
                <p className='text-sm text-muted-foreground'>Available Strategies</p>
              </div>
            )}
            {user.status !== 'active' && (
              <div>
                <p className='text-2xl font-bold'>Not Available</p>
                <p className='text-sm text-muted-foreground'>Required account approval</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Plastform Strategies */}
      <section>
        <h2 className='text-xl font-semibold text-foreground mb-2'>Platform Strategies</h2>

        {/* Strategy Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {user.status === 'active' &&
            strategies
              .filter((s) => s.type === 'default')
              .map((stra) => (
                <StrategyCard
                  key={stra._id}
                  strategy={stra}
                  onConfigModalOpen={onConfigModalOpen}
                  subscribeStrategy={subscribeStrategy}
                  setOpen={setOpen}
                />
              ))}
        </div>
      </section>

      {/* Custom Strategies */}
      <section>
        <h2 className='text-xl font-semibold text-foreground mb-2'>My Strategies</h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {strategies
            .filter((s) => s.type === 'custom')
            .map((stra) => (
              <StrategyCard
                key={stra._id}
                strategy={stra}
                onConfigModalOpen={onConfigModalOpen}
                subscribeStrategy={subscribeStrategy}
                setOpen={setOpen}
                setStrategy={setStrategy}
              />
            ))}
          <AddStrategyCard
            onClick={() => {
              setStrategy(null);
              setOpen('Add');
            }}
            disabled={user.plan === 'basic' || user.status !== 'active'}
          />
        </div>
      </section>

      {/* For each account */}
      <RiskConfigModal
        open={open}
        onModalClose={onModalClose}
        strategy={strategy}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* For whole accounts */}
      <RiskSettingModal open={open} onModalClose={onModalClose} isLoading={isLoading} setIsLoading={setIsLoading} />

      {/* For each account */}
      <TradingTimeModal open={open} onModalClose={onModalClose} isLoading={isLoading} setIsLoading={setIsLoading} />

      {/* Add Strategy Modal */}
      <AddCustomStrategyModal
        open={open}
        onOpenChange={onModalClose}
        selectedStrategy={strategy}
        setStrategies={setStrategies}
      />

      {/* Delete Modal */}
      <DeleteModal open={open} onOpenChange={onModalClose} isLoading={isLoading} confirmDelete={confirmDelete} />
    </div>
  );
};

export default StrategyMarketplace;
