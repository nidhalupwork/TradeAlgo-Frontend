import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  Calendar,
  Activity,
  AlertTriangle,
  UserCheck,
  MoreHorizontal,
  Verified,
  RotateCcw,
  Users,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '../Navbar';
import { useAdmin } from '@/providers/AdminProvider';
import { UserInterface } from '@/lib/types';
import Api from '@/services/Api';
import { useToast } from '@/hooks/use-toast';

export default function UserProfile() {
  const { toast } = useToast();
  const { userId } = useParams();
  const { strategies, setUsers } = useAdmin();
  const [user, setUser] = useState<UserInterface>();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchUserAndRecentActivities();
  }, []);

  async function fetchUserAndRecentActivities() {
    try {
      const data = await Api.get(`/admin/activity/${userId}`);
      console.log('data for recent activities:', data);
      if (data?.success) {
        setActivities(data.activities);
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-profit/20 text-profit border-profit/30">Active</Badge>;
      case 'pending':
        return <Badge className="bg-gold/20 text-gold border-gold/30">Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'deleted':
        return <Badge variant="destructive">Deleted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <Badge className="bg-profit/20 text-profit border-profit/30">Premium</Badge>;
      case 'pro':
        return <Badge className="bg-accent/20 text-accent border-accent/30">Pro</Badge>;
      case 'basic':
        return <Badge className="bg-gold/20 text-gold border-gold/30">Basic</Badge>;
      default:
        return <Badge variant="secondary">{tier}</Badge>;
    }
  };

  const getBrokerStatusBadge = (status: boolean) => {
    if (status) {
      return <Badge className="bg-profit/20 text-success border-profit/30">Active</Badge>;
    } else {
      return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  const getStrategyStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return <Badge className="bg-profit/20 text-profit border-profit/30">{status}</Badge>;
      case 'Paused':
        return <Badge className="bg-gold/20 text-gold border-gold/30">{status}</Badge>;
      case 'Development':
        return <Badge className="bg-primary/20 text-primary border-primary/30">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  async function onResetRiskClick(userId: string, strategyId: string) {
    try {
      const data = await Api.post('/admin/reset-risk', { userId, strategyId });
      if (data?.success) {
        setUsers((prevUsers) => prevUsers.map((u) => (u?._id === data.user?._id ? data.user : u)));
        setUser(data.user);

        toast({
          title: 'Success',
          description: 'Successfully reset the risk setting',
          variant: 'default',
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset the risk setting',
        variant: 'destructive',
        duration: 2000,
      });
    }
  }

  async function manageAccount(id: string, type: 'Approve' | 'Suspend' | 'Activate') {
    try {
      const data = await Api.post('/admin/manage-user', { id, type });
      console.log('user management data:', data);
      if (data?.success) {
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === data.user._id ? data.user : user)));
        setUser(data.user);
        toast({
          title: 'Success',
          description: 'Successfully ' + type + 'ed',
          variant: 'profit',
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: type + ' failed',
        variant: 'destructive',
        duration: 2000,
      });
    }
  }

  return (
    <div className="main">
      <Navbar />
      {/* Header */}
      <div className="flex items-center justify-between pt-24 px-6">
        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="sm" onClick={() => navigate('/users')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button> */}
          {/* <Separator orientation="vertical" className="h-6" /> */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user?.fullName}</h1>
            <div className="flex gap-2 items-center">
              <p className="text-muted-foreground">{user?.email}</p>
              {user?.emailVerified && <Verified size={16} className="text-profit" />}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(user?.status)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Edit Settings
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              {user?.status === 'pending' && (
                <DropdownMenuItem
                  className="text-success hover:cursor-pointer"
                  onClick={() => manageAccount(user._id, 'Approve')}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Approve Account
                </DropdownMenuItem>
              )}
              {user?.status === 'active' && (
                <DropdownMenuItem
                  className="text-warning hover:cursor-pointer"
                  onClick={() => manageAccount(user._id, 'Suspend')}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Suspend Account
                </DropdownMenuItem>
              )}
              {user?.status === 'suspended' && (
                <DropdownMenuItem
                  className="text-profit hover:cursor-pointer hover:!bg-profit"
                  onClick={() => manageAccount(user._id, 'Activate')}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate Account
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column - User Info & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="">Phone</p>
                  <p className='text-foreground'>{user?.phoneNumber}</p>
                </div>
                {/* <div>
                  <p className="text-muted-foreground">Country</p>
                  <p>{user?.country}</p>
                </div> */}
                {/* <div>
                  <p className="text-muted-foreground">Timezone</p>
                  <p>{user?.timezone}</p>
                </div> */}
                <div>
                  <p>Role</p>
                  <div className="flex gap-1 items-center text-foreground">
                    {user?.role === 'user' ? <Users size={16} /> : <ShieldCheck size={16} />}
                    <p className="text-sm">{user?.role}</p>
                  </div>
                </div>
                <div>
                  <p>Account Tier</p>
                  <div>{getTierBadge(user?.plan)}</div>
                </div>
                <div>
                  <p>2FA Status</p>
                  <div className="flex items-center gap-2">
                    {user?.twoFA ? (
                      <Badge className="bg-profit/20 text-profit border-profit/30">Enabled</Badge>
                    ) : (
                      <Badge variant="destructive">Disabled</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p>Registered</p>
                  <p className="flex items-center gap-2 text-foreground">
                    <Calendar className="h-4 w-4" />
                    {user?.createdAt?.toString().slice(0, 10) ?? ''}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Login</p>
                  <p className="flex items-center gap-2 text-foreground">
                    <Calendar className="h-4 w-4" />
                    {user?.lastLogin?.toString().slice(0, 10) ?? user?.createdAt?.toString().slice(0, 10) ?? ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Stats */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trading Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Trades</p>
                  <p className="text-2xl font-bold">{user?.stats.totalTrades}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold text-success">{user?.stats.winRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total P&L</p>
                  <p
                    className={`text-2xl font-bold ${
                      user?.stats.totalProfit >= 0 ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    ${user?.stats.totalProfit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Trade</p>
                  <p className="text-2xl font-bold">${user?.stats.avgTrade}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Max Drawdown</p>
                  <p className="text-xl font-bold text-warning">{user?.stats.maxDrawdown}%</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Risk Settings */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Drawdown</span>
                  <span className="font-medium">{user?.riskSettings.maxDrawdown}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Loss Limit</span>
                  <span className="font-medium">${user?.riskSettings.dailyLossLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Position Size</span>
                  <span className="font-medium">${user?.riskSettings.maxPositionSize.toLocaleString()}</span>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Allowed Symbols</p>
                  <div className="flex flex-wrap gap-1">
                    {user?.riskSettings.allowedSymbols.map((symbol) => (
                      <Badge key={symbol} variant="outline" className="text-xs">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Right Column - Brokers, Strategies, Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connected Brokers */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Trading accounts connected to this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Login</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Broker</TableHead>
                      <TableHead>Status</TableHead>
                      {/* <TableHead className="w-[50px]"></TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user?.accounts.map((account) => (
                      <TableRow key={account.accountId}>
                        <TableCell className="text-sm">{account.name}</TableCell>
                        <TableCell className="font-mono text-sm">{account.login}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{account.platform}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{account.brokerage}</TableCell>
                        <TableCell>{getBrokerStatusBadge(account.active)}</TableCell>
                        {/* <TableCell>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Active Strategies */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Strategies</CardTitle>
              <CardDescription>User's active strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Strategy</TableHead>
                      <TableHead>MT Account</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Risk per trade</TableHead>
                      <TableHead>Daily Loss Limit</TableHead>
                      <TableHead>Max Loss Limit</TableHead>
                      {/* <TableHead>Actions</TableHead> */}
                      {/* <TableHead className="w-[50px]"></TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategies?.map((strategy, index) => {
                      return user?.accounts?.map((account) => {
                        const accSetting = account.strategySettings?.find((ss) => ss.strategyId === strategy?._id);
                        return (
                          <TableRow
                            key={strategy?._id + account.accountId}
                            className={index % 2 === 0 ? 'bg-card-elevated' : ''}
                          >
                            <TableCell className="font-medium">{strategy.title}</TableCell>
                            <TableCell>
                              {account.name} <span className="text-muted-foreground text-xs">({account.platform})</span>
                            </TableCell>
                            {/* <TableCell>{getStrategyStatusBadge(strategy.status)}</TableCell> */}
                            <TableCell>{accSetting?.subscribed ? 'Yes' : 'No'}</TableCell>
                            {/* <TableCell
                              className={`font-medium ${strategy.profit >= 0 ? 'text-success' : 'text-destructive'}`}
                            >
                              ${strategy.profit.toFixed(2)}
                            </TableCell>
                            <TableCell>{strategy.trades}</TableCell> */}
                            <TableCell>{accSetting?.riskPerTrade ?? 0}%</TableCell>
                            <TableCell>
                              {account?.dailyLossCurrency == 'amount' && '$'}
                              {account?.dailyLossLimit}
                              {account?.dailyLossCurrency == 'percentage' && '%'}
                            </TableCell>
                            <TableCell>
                              {account?.maxLossCurrency == 'amount' && '$'}
                              {account?.maxLossLimit}
                              {account?.maxLossCurrency == 'percentage' && '%'}
                            </TableCell>
                            {/* <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onResetRiskClick(user?._id, strategy?._id)}
                              >
                                <RotateCcw className="h-4 w-4" />
                                Reset Risk
                              </Button>
                            </TableCell> */}
                          </TableRow>
                        );
                      });
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest user actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities?.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{activity.type}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
