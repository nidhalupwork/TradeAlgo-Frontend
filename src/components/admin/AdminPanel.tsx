import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Shield,
  Activity,
  Ban,
  CheckCircle,
  AlertTriangle,
  Search,
  Settings,
  Eye,
  MoreHorizontal,
  Loader,
  UserCheck,
} from 'lucide-react';
import { useAdmin } from '@/providers/AdminProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import Api from '@/services/Api';
import { Link } from 'react-router-dom';
import { roundUp } from '@/lib/utils';

const AdminPanel = () => {
  const { toast } = useToast();
  const { users, setUsers } = useAdmin();
  // const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);
  // const [showButton, setShowButton] = useState(false);

  const userStatusCounts = users?.reduce(
    (acc, u) => {
      if (u.status === 'active') acc.active += 1;
      else if (u.status === 'pending') acc.pending += 1;
      else if (u.status === 'suspended') acc.suspended += 1;
      return acc;
    },
    { active: 0, pending: 0, suspended: 0 }
  ) ?? { active: 0, pending: 0, suspended: 0 };

  const { active: activeUsers, pending: pendingUsers, suspended: suspendedUsers } = userStatusCounts;

  async function manageAccount(id: string, type: 'Approve' | 'Suspend' | 'Activate') {
    try {
      const data = await Api.post('/admin/manage-user', { id, type });
      console.log('user management data:', data);
      if (data?.success) {
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === data.user._id ? data.user : user)));
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

  // async function manageBatchAccounts(type: 'Approve' | 'Suspend' | 'Activate') {
  //   try {
  //     const batchUsers = selectedUsers.reduce((ra, cur) => {
  //       return [...ra, cur._id];
  //     }, []);
  //     const data = await Api.post('/admin/manage-users', { users: batchUsers, type });
  //     console.log('user management data:', data);

  //     setUsers((prevUsers) => prevUsers.map((user) => (user._id === data.user._id ? data.user : user)));
  //     toast({
  //       title: type + ' succeeded',
  //       description: '',
  //       variant: 'default',
  //       duration: 2000,
  //     });
  //   } catch (error) {
  //     toast({
  //       title: type + ' failed',
  //       description: '',
  //       variant: 'destructive',
  //       duration: 2000,
  //     });
  //   }
  // }

  // function onCheckedChange(value: CheckedState, user: UserInterface) {
  //   let temp = [];
  //   if (value) {
  //     temp = [...selectedUsers, user];
  //     setSelectedUsers(temp);
  //   } else {
  //     temp = selectedUsers.filter((su) => su._id !== user._id);
  //     setSelectedUsers(temp);
  //   }
  //   if (temp.length === 0) {
  //     setShowButton(false);
  //   } else {
  //     setShowButton(!temp.some((t) => t.status !== temp[0].status));
  //   }
  // }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Control Center</h1>
          <p className="text-muted-foreground">Manage users and monitor system-wide trading activity</p>
        </div>
        <div className="flex gap-2"></div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users?.length}</p>
              {/* <p className="text-xs text-profit">+12% this month</p> */}
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Now</p>
              <p className="text-2xl font-bold">{activeUsers}</p>
              <p className="text-xs text-muted-foreground">{roundUp((activeUsers / users.length) * 100, 2)}%</p>
            </div>
            <Activity className="h-8 w-8 text-profit" />
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Users</p>
              <p className="text-2xl font-bold">{pendingUsers}</p>
              <p className="text-xs text-gold">{roundUp((pendingUsers / users.length) * 100, 2)}%</p>
            </div>
            <Shield className="h-8 w-8 text-gold" />
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Suspended Users</p>
              <p className="text-2xl font-bold">{suspendedUsers}</p>
              <p className="text-xs text-loss">{roundUp((suspendedUsers / users.length) * 100, 2)}%</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-loss" />
          </div>
        </Card>
      </div>

      {/* User Management */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">User Management</h2>
            <div className="flex items-center gap-3">
              {/* {showButton && selectedUsers[0]?.status === 'active' && (
                <Button
                  className="text-success"
                  size="sm"
                  variant="destructive"
                  onClick={() => manageBatchAccounts('Suspend')}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Suspend
                </Button>
              )}
              {showButton && selectedUsers[0]?.status === 'pending' && (
                <Button
                  className="text-success"
                  size="sm"
                  variant="profit"
                  onClick={() => manageBatchAccounts('Approve')}
                >
                  <UserCheck className="h-4 w-4" />
                  Approve
                </Button>
              )}
              {showButton && selectedUsers[0]?.status === 'suspended' && (
                <Button
                  className="text-success"
                  size="sm"
                  variant="default"
                  onClick={() => manageBatchAccounts('Activate')}
                >
                  <UserCheck className="h-4 w-4" />
                  Activate
                </Button>
              )}
              {selectedUsers.length > 0 && (
                <Button size="sm">
                  <RotateCcw className="h-4 w-4" />
                  Reset Risk
                </Button>
              )} */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {/* <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground"></th> */}
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                  {/* <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Balance</th> */}
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Positions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Brokers</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Registration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Login</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                    {/* <td className="py-3 px-4">
                      <Checkbox
                        checked={selectedUsers.some((su) => su._id === user._id)}
                        onCheckedChange={(value) => onCheckedChange(value, user)}
                      />
                    </td> */}
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.status === 'active' && (
                        <Badge className="bg-profit/20 text-profit">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      {user.status === 'suspended' && (
                        <Badge className="bg-loss/20 text-loss">
                          <Ban className="h-3 w-3 mr-1" />
                          Suspended
                        </Badge>
                      )}
                      {user.status === 'pending' && (
                        <Badge className="bg-gold/20 text-gold">
                          <Loader className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={user.plan === 'premium' ? 'default' : 'outline'}
                        className={user.plan === 'premium' ? 'bg-gradient-gold text-background' : ''}
                      >
                        {user.plan}
                      </Badge>
                    </td>
                    {/* <td className="py-3 px-4">
                      <p className="font-medium">${user.balance.toLocaleString()}</p>
                    </td> */}
                    <td className="py-3 px-4">
                      <p className="font-medium">{user?.trades?.length}</p>
                    </td>
                    <td className="py-3 px-4">
                      {/* <p className={`font-medium ${user.dailyPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                        ${user.dailyPnL >= 0 ? '+' : ''}
                        {user.dailyPnL}
                      </p> */}
                      <p className="font-medium">{user?.accounts?.length}</p>
                    </td>
                    <td className="py-3 px-4">
                      {/* {user.riskStatus === 'healthy' && <Badge className="bg-profit/20 text-profit">Healthy</Badge>}
                      {user.riskStatus === 'warning' && <Badge className="bg-warning/20 text-warning">Warning</Badge>}
                      {user.riskStatus === 'critical' && <Badge className="bg-loss/20 text-loss">Critical</Badge>}
                      {user.riskStatus === 'paused' && <Badge variant="outline">Paused</Badge>} */}
                      <p className="text-sm text-muted-foreground">{user?.createdAt?.toString().slice(0, 10) ?? ''}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground">{user?.lastLogin?.toString().slice(0, 10) ?? ''}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {/* <DropdownMenuItem> */}
                            <Link
                              className="flex items-center py-1.5 px-2 w-full hover:text-blue-700 hover:underline transition-all text-sm"
                              to={`http://localhost:8080/users/${user._id}`}
                              target="_blank"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                            {/* </DropdownMenuItem> */}
                            {/* <DropdownMenuItem
                              className="hover:cursor-pointer"
                              onClick={() => onResetRiskClick(user._id)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reset Risk
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            {user.status === 'pending' && (
                              <DropdownMenuItem
                                className="text-success hover:cursor-pointer"
                                onClick={() => manageAccount(user._id, 'Approve')}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Approve Account
                              </DropdownMenuItem>
                            )}
                            {user.status === 'active' && (
                              <DropdownMenuItem
                                className="text-warning hover:cursor-pointer"
                                onClick={() => manageAccount(user._id, 'Suspend')}
                              >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Suspend Account
                              </DropdownMenuItem>
                            )}
                            {user.status === 'suspended' && (
                              <DropdownMenuItem
                                className="text-success hover:cursor-pointer"
                                onClick={() => manageAccount(user._id, 'Activate')}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Controls</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium">Trading Enabled</p>
                  <p className="text-xs text-muted-foreground">Allow new positions globally</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium">Auto Risk Management</p>
                  <p className="text-xs text-muted-foreground">Enforce risk limits automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium">Alert Notifications</p>
                  <p className="text-xs text-muted-foreground">Send system-wide alerts</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Risk Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Users at Risk Limit</span>
                <span className="text-sm font-medium text-loss">3 users</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Open Risk</span>
                <span className="text-sm font-medium">$45,250</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">System Exposure</span>
                <span className="text-sm font-medium text-warning">68%</span>
              </div>
              <div className="pt-3 border-t border-border">
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Risk Report
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div> */}
    </div>
  );
};

export default AdminPanel;
