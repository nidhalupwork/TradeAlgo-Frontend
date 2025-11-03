import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAdmin } from '@/providers/AdminProvider';
import Api from '@/services/Api';
import { useToast } from '@/hooks/use-toast';
import { AddStrategyModal } from './AddStrategyModal';
import { useEffect, useState } from 'react';
import { AdminStrategyStatsInterface, StrategyInterface } from '@/lib/types';
import { ConfirmDeletionModal } from './ConfirmDeletionModal';
import { Spinner } from '@/components/ui/Spinner';
import { PageDescription, PageHeader } from '@/components/components/PageHeader';
import { StrategyRow } from './StrategyRow';
import { AdminStrategyStats } from './AdminStrategyStats';

export default function StrategyManagement() {
  const { strategies, setStrategies } = useAdmin();
  const { toast } = useToast();
  const [open, setOpen] = useState<'Add' | 'Edit' | 'Delete' | ''>('');
  const [strategy, setStrategy] = useState<StrategyInterface>();
  const [isLoading, setIsLoading] = useState(false);
  const [tabs, setTabs] = useState<'default' | 'custom'>('default');
  const [stats, setStats] = useState<AdminStrategyStatsInterface>({
    activeUsers: 0,
    totalStrategies: 0,
    enabeldStrategies: 0,
    pausedStrategies: 0,
    devStrategies: 0,
  });

  useEffect(() => {
    if (strategies) {
      const subscribers = new Set();
      let enabled = 0;
      let paused = 0;
      let development = 0;
      strategies.map((s) => {
        s.subscribers.map((ss) => {
          subscribers.add(ss);
        });
        if (s.enabled) enabled += 1;
        if (s.status === 'Paused') paused += 1;
        if (s.status === 'Development') development += 1;
      });

      setStats({
        activeUsers: subscribers.size,
        totalStrategies: strategies.length,
        enabeldStrategies: enabled,
        pausedStrategies: paused,
        devStrategies: development,
      });
    }
  }, [strategies]);

  function openChange() {
    if (isLoading) return;
    setOpen('');
    setStrategy(undefined);
  }

  async function enablingStrategy(strategyId: string, value: boolean) {
    try {
      const data = await Api.post('/strategy/enable', { strategyId, value });
      console.log('data to enable the strategy:', data);
      if (data?.success) {
        setStrategies((prev) =>
          prev.map((s) => {
            return s._id === data.strategy._id ? data.strategy : s;
          })
        );
      }
    } catch (error) {
      console.error('Error while enabling strategy:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Unexpected Error',
        variant: 'destructive',
      });
    }
  }

  async function deleteStrategy(strategyId: string) {
    setIsLoading(true);
    try {
      const data = await Api.delete(`/strategy/${strategyId}`);
      console.log('data:', data);
      if (data?.success) {
        setStrategies(strategies.filter((s) => s._id !== strategyId));
        toast({
          title: 'Success',
          description: 'Successfully deleted',
        });
        setOpen('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Unexpected Error',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  }

  return (
    <div className='main'>
      <Navbar />
      <div className='pt-16'>
        <div className='p-6 space-y-6'>
          {/* Page Header */}
          <div className='flex items-center justify-between'>
            <div>
              <PageHeader>Strategy Management</PageHeader>
              <PageDescription>Global risk controls, strategy management, and emergency overrides</PageDescription>
            </div>
            <div className='flex items-center gap-3'>
              <Badge variant='outline' className='px-3 py-1'>
                <Activity className='h-3 w-3 mr-1' />
                Real-time Monitoring
              </Badge>
            </div>
          </div>

          {/* Strategy Metrics */}
          <AdminStrategyStats stats={stats} />

          {/* Strategy Controls */}
          <Card>
            <CardHeader className='flex flex-row justify-between'>
              <div>
                <CardTitle>Strategy Risk Management</CardTitle>
                <CardDescription>Control and monitor individual trading strategies across the platform</CardDescription>
              </div>
              {tabs === 'default' && (
                <Button
                  onClick={() => {
                    setOpen('Add');
                    setStrategy(undefined);
                  }}
                >
                  <Plus />
                  Add New Strategy
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Tabs className='w-full' value={tabs} onValueChange={(value) => setTabs(value as 'default' | 'custom')}>
                <TabsList className='grid w-full grid-cols-2 mb-4'>
                  <TabsTrigger value='default'>Default Strategies</TabsTrigger>
                  <TabsTrigger value='custom'>User Strategies</TabsTrigger>
                </TabsList>

                {['default', 'custom'].map((type, index) => (
                  <TabsContent key={index} value={type} className='space-y-4'>
                    <div className='rounded-md border'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Strategy</TableHead>
                            {type === 'custom' && <TableHead>User</TableHead>}
                            <TableHead>Flags</TableHead>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Active Users</TableHead>
                            <TableHead>Enabled</TableHead>
                            <TableHead className='w-[100px]'>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {strategies
                            ?.filter((s) => s?.type === type)
                            ?.map((strategy) => (
                              <StrategyRow
                                key={strategy._id}
                                strategy={strategy}
                                type={type as 'default' | 'custom'}
                                enablingStrategy={enablingStrategy}
                                setOpen={setOpen}
                                setStrategy={setStrategy}
                              />
                            ))}
                        </TableBody>
                      </Table>
                      {strategies === null && (
                        <div className='flex justify-center py-3'>
                          <Spinner className='w-6 h-6' />
                        </div>
                      )}
                      {strategies?.length === 0 && (
                        <div className='flex justify-center py-3 text-muted-foreground'>No strategies</div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddStrategyModal
        open={open}
        onOpenChange={openChange}
        selectedStrategy={strategy}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <ConfirmDeletionModal
        open={open}
        onOpenChange={openChange}
        selectedStrategy={strategy}
        deleteStrategy={deleteStrategy}
        isLoading={isLoading}
      />
    </div>
  );
}
