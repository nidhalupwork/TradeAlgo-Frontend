import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  TrendingUp,
  Shield,
  AlertCircle,
  Activity,
  DollarSign,
  Power,
  Pause,
  CheckCircle,
  XCircle,
  Play,
  TvMinimalPlay,
} from 'lucide-react';
import { useAdmin } from '@/providers/AdminProvider';
import Api from '@/services/Api';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { users, strategies, globalSetting, setGlobalSetting, setStrategies } = useAdmin();
  const { toast } = useToast();

  async function manageAllTrading(type: string) {
    try {
      const data = await Api.post('/admin/manage-trading', { type });
      console.log('stop-trading:', data);
      if (data?.success) {
        setGlobalSetting(data.setting);
        toast({
          title: 'Global setting',
          description: `Successfully ${type === 'stop' ? 'paused' : 'started'} all trading`,
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error while pausing all trading:', error);
      toast({
        title: 'Global setting',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  }

  async function changeMode(type: 'maintain' | 'live') {
    try {
      const data = await Api.post('/admin/change-mode', { type });
      console.log('change mode data:', data);
      if (data?.success) {
        setGlobalSetting(data.setting);
        toast({
          title: 'Global setting',
          description: `Successfully moved to ${type} mode`,
          variant: 'profit',
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: 'Global setting',
        description: `Failed moving to ${type} mode`,
        variant: 'destructive',
        duration: 2000,
      });
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Trading platform control center and system overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Real-time
          </Badge>
        </div>
      </div>

      {/* Critical Controls */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Critical Risk Controls
          </CardTitle>
          <CardDescription>Emergency controls for immediate system-wide actions</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!!!globalSetting?.isPausedAllTrading ? (
            <Button
              variant="destructive"
              size="lg"
              className="h-20 bg-destructive/70 shadow-danger hover:bg-destructive/80"
              onClick={() => manageAllTrading('stop')}
            >
              <div className="flex flex-col items-center gap-1">
                <Power className="h-6 w-6" />
                <span className="font-bold">GLOBAL KILL SWITCH</span>
                <span className="text-xs opacity-90">Stop All Trading</span>
              </div>
            </Button>
          ) : (
            <Button
              className="w-full h-20 bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={() => manageAllTrading('start')}
            >
              <div className="flex flex-col items-center gap-1">
                <Play className="h-6 w-6" />
                <div className="font-bold">START GLOBAL TRADING</div>
                <div className="text-xs opacity-90">Start all trading immediately</div>
              </div>
            </Button>
          )}

          {!!globalSetting?.isMaintaining ? (
            <Button
              variant="outline"
              size="lg"
              className="h-20 border-profit text-profit hover:bg-profit/10"
              onClick={() => changeMode('live')}
            >
              <div className="flex flex-col items-center gap-1">
                <TvMinimalPlay className="h-6 w-6" />
                <span className="font-bold">GO TO LIVE MODE</span>
                <span className="text-xs opacity-70">Allow New Logins</span>
              </div>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="h-20 border-warning text-warning hover:bg-warning/10"
              onClick={() => changeMode('maintain')}
            >
              <div className="flex flex-col items-center gap-1">
                <Pause className="h-6 w-6" />
                <span className="font-bold">GO TO MAINTENANCE MODE</span>
                <span className="text-xs opacity-70">Block New Logins</span>
              </div>
            </Button>
          )}

          {/* <Button variant="outline" size="lg" className="h-20">
            <div className="flex flex-col items-center gap-1">
              <AlertCircle className="h-6 w-6" />
              <span className="font-bold">EMERGENCY ALERT</span>
              <span className="text-xs opacity-70">Notify All Admins</span>
            </div>
          </Button> */}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {/* <span className="text-success">+12.3%</span> from last month */}
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.4M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+8.7%</span> from yesterday
            </p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategies.length}</div>
            <p className="text-xs text-muted-foreground">
              {/* <span className="text-warning">-2</span> disabled today */}
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">99.8%</div>
            <p className="text-xs text-muted-foreground">Uptime last 30 days</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Recent Activity & System Status */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Critical Actions</CardTitle>
            <CardDescription>Latest admin interventions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <XCircle className="h-4 w-4 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium">User Account Suspended</p>
                  <p className="text-xs text-muted-foreground">user@example.com - Suspicious activity detected</p>
                </div>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle className="h-4 w-4 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Strategy Approved</p>
                  <p className="text-xs text-muted-foreground">Advanced Scalping v2.1 - Live deployment authorized</p>
                </div>
                <span className="text-xs text-muted-foreground">15 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="h-4 w-4 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium">High Error Rate Alert</p>
                  <p className="text-xs text-muted-foreground">MT5 Broker API - 12% error rate detected</p>
                </div>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Broker Connection Status</CardTitle>
            <CardDescription>Real-time connectivity and health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <div>
                    <p className="text-sm font-medium">MetaTrader 5</p>
                    <p className="text-xs text-muted-foreground">Connected - 45ms latency</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Online
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <div>
                    <p className="text-sm font-medium">cTrader</p>
                    <p className="text-xs text-muted-foreground">Connected - 38ms latency</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Online
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                  <div>
                    <p className="text-sm font-medium">DxTrade</p>
                    <p className="text-xs text-muted-foreground">High latency - 450ms response</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-warning text-warning">
                  Warning
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <div>
                    <p className="text-sm font-medium">Tradovate</p>
                    <p className="text-xs text-muted-foreground">Connection timeout - Offline</p>
                  </div>
                </div>
                <Badge variant="destructive">Offline</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
