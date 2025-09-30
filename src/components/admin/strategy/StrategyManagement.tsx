import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Shield,
  Power,
  AlertTriangle,
  TrendingUp,
  Lock,
  Unlock,
  Activity,
  DollarSign,
  Users,
  Pause,
  Play,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAdmin } from '@/providers/AdminProvider';
import Api from '@/services/Api';
import { useToast } from '@/hooks/use-toast';
import { AddStrategyModal } from './AddStrategyModal';
import { useState } from 'react';
import { StrategyInterface } from '@/lib/types';
import { ConfirmDeletionModal } from './ConfirmDeletionModal';

export default function StrategyManagement() {
  const { strategies, setStrategies } = useAdmin();
  const { toast } = useToast();
  const [open, setOpen] = useState<'Add' | 'Edit' | 'Delete' | ''>('');
  const [strategy, setStrategy] = useState<StrategyInterface>();
  const [isLoading, setIsLoading] = useState(false);

  function openChange() {
    setOpen('');
    setStrategy(undefined);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return <Badge className="bg-profit/20 text-profit">{status}</Badge>;
      case 'Paused':
        return <Badge className="bg-gold/20 text-gold">{status}</Badge>;
      case 'Development':
        return <Badge className="bg-primary/20 text-primary">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  async function enablingStrategy(strategyId: string, value: boolean) {
    try {
      const data = await Api.post('/strategy/enable', { strategyId, value });
      console.log('data to enable the strategy:', data);

      setStrategies((prev) =>
        prev.map((s) => {
          return s._id === data.strategy._id ? data.strategy : s;
        })
      );
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
    try {
      setIsLoading(true);
      const data = await Api.delete(`/strategy/${strategyId}`);
      console.log('data:', data);

      setStrategies(strategies.filter((s) => s._id !== strategyId));

      toast({
        title: 'Success',
        description: 'Successfully deleted',
      });
      setOpen('');
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
    <div>
      <Navbar />
      <div className="pt-16">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Strategy Management</h1>
              <p className="text-muted-foreground">
                Global risk controls, strategy management, and emergency overrides
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                <Activity className="h-3 w-3 mr-1" />
                Real-time Monitoring
              </Badge>
            </div>
          </div>

          {/* Emergency Controls */}
          {/* <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Emergency Risk Controls
              </CardTitle>
              <CardDescription>Immediate system-wide risk management and position controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {!!globalSetting?.isPausedAllTrading ? (
                    <Button className="w-full h-16 bg-green-600" onClick={() => manageAllTrading('start')}>
                      <div className="flex items-center gap-3">
                        <Play className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-bold"> START GLOBAL TRADING</div>
                          <div className="text-xs opacity-90">Start all trading immediately</div>
                        </div>
                      </div>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full h-16 bg-destructive/70 shadow-danger hover:bg-destructive/80"
                      onClick={() => manageAllTrading('stop')}
                    >
                      <div className="flex items-center gap-3">
                        <Power className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-bold">GLOBAL KILL SWITCH & CLOSE ALL POSITIONS</div>
                          <div className="text-xs opacity-90">
                            Stop all trading immediately and close all open positions
                          </div>
                        </div>
                      </div>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-16 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-bold">CLOSE ALL POSITIONS</div>
                        <div className="text-xs opacity-70">Emergency position closure</div>
                      </div>
                    </div>
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Global Trading Status</span>
                      <Switch checked={globalSetting?.isPausedAllTrading} />
                    </div>
                    <p className="text-sm text-muted-foreground">Enable/disable all trading operations platform-wide</p>
                  </div>

                  <div className="p-4 rounded-lg bg-card border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">New Position Creation</span>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow new positions while keeping existing ones active
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Exposure</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45.2M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-warning">+5.2%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">Across all users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">6.2</div>
                <p className="text-xs text-muted-foreground">Medium risk level</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Margin Usage</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-success">Safe levels</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Strategy Controls */}
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>Strategy Risk Management</CardTitle>
                <CardDescription>Control and monitor individual trading strategies across the platform</CardDescription>
              </div>
              <Button
                onClick={() => {
                  setOpen('Add');
                  setStrategy(undefined);
                }}
              >
                <Plus />
                Add New Strategy
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Status</TableHead>
                      {/* <TableHead>Risk Level</TableHead> */}
                      <TableHead>Active Users</TableHead>
                      {/* <TableHead>Total Volume</TableHead> */}
                      <TableHead>Enabled</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategies.map((strategy) => (
                      <TableRow key={strategy._id}>
                        <TableCell>
                          <div className="font-medium">{strategy.title}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(strategy.status)}</TableCell>
                        {/* <TableCell>{getRiskBadge(strategy.star.toString())}</TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            {strategy.subscribers.length}
                          </div>
                        </TableCell>
                        {/* <TableCell className="font-mono">{strategy.avgProfit}</TableCell> */}

                        {/* Enabled */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={strategy.enabled}
                              onCheckedChange={(value) => enablingStrategy(strategy._id, value)}
                            />
                            <span className="text-xs text-muted-foreground">
                              {strategy.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* <Button variant="ghost" size="sm">
                              {strategy.status !== 'Paused' ? (
                                <Pause className="h-3 w-3" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                            </Button> */}
                            <Edit
                              size={20}
                              className="hover:cursor-pointer hover:text-blue-400 transition-all"
                              onClick={() => {
                                setOpen('Edit');
                                setStrategy(strategy);
                              }}
                            />
                            <Trash2
                              size={20}
                              className="hover:cursor-pointer text-red-600 hover:text-red-700 transition-all"
                              onClick={() => {
                                setOpen('Delete');
                                setStrategy(strategy);
                              }}
                            />
                            {/* {strategy.status === 'Live' && (
                              <Button size="sm" className="p-2">
                                <Pause className="h-3 w-3" /> Pause
                              </Button>
                            )}
                            {strategy.status === 'Paused' && (
                              <Button size="sm" className="p-2">
                                <Play className="h-3 w-3" /> Start
                              </Button>
                            )}
                            {strategy.status === 'Development' && (
                              <Button size="sm" className="p-2">
                                <Play className="h-3 w-3" /> Go to Live
                              </Button>
                            )} */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddStrategyModal open={open} onOpenChange={openChange} selectedStrategy={strategy} />
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
