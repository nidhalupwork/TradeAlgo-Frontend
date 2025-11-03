import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { roundUp } from '@/lib/utils';
import { AdminStrategyStatsInterface } from '@/lib/types';
import { Activity, Users, Pause, Code } from 'lucide-react';

export const AdminStrategyStats = ({ stats }: { stats: AdminStrategyStatsInterface }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Strategies</CardTitle>
          <Activity className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.totalStrategies}</div>
          <p className='text-xs text-muted-foreground'>
            <span className='text-profit'>
              Enabled: {stats.enabeldStrategies} {stats.enabeldStrategies > 1 ? 'strategies' : 'strategy'}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Subscribers</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.activeUsers}</div>
          <p className='text-xs text-muted-foreground'>Across all users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Paused Strategies</CardTitle>
          <Pause className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-warning'>{stats.pausedStrategies}</div>
          <p className='text-xs text-warning'>{roundUp((stats.pausedStrategies / stats.totalStrategies) * 100, 2)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>In Development</CardTitle>
          <Code className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-primary'>{stats.devStrategies}</div>
          <p className='text-xs text-primary'>{roundUp((stats.devStrategies / stats.totalStrategies) * 100, 2)}%</p>
        </CardContent>
      </Card>
    </div>
  );
};
