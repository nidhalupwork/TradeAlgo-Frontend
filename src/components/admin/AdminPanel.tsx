import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Ban,
  CheckCircle,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Loader,
  UserCheck,
  ShieldCheck,
  CircleCheck,
  CircleAlert,
  CircleCheckBig,
  Trash2,
  HandCoins,
  HandHelping,
  Shield,
  Headphones,
  User,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
import { FRONTEND_ENDPOINT } from '@/config/config';
import { DeleteModal } from './DeleteModal';
import { useEffect, useState } from 'react';
import { UserInterface, UserRole } from '@/lib/types';
import { UserFilters } from './user/UserFilters';
import { capitalizeFirstLetter } from '@/utils/utils';
import { RoleBadge, StatusBadge, TierBadge } from '../components/Badges';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@radix-ui/react-dropdown-menu';
import { useAuth } from '@/providers/AuthProvider';
import { PageDescription, PageHeader } from '../components/PageHeader';

const roleOptions = [
  { value: 'admin' as UserRole, label: 'Admin', icon: Shield },
  { value: 'support' as UserRole, label: 'Support', icon: Headphones },
  { value: 'user' as UserRole, label: 'User', icon: User },
];

const AdminPanel = () => {
  const { toast } = useToast();
  const { user: me } = useAuth();
  const { users, setUsers } = useAdmin();
  const [selectedUser, setSelectedUser] = useState<UserInterface>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleFilter, setRoleFilter] = useState<'user' | 'admin' | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'pending' | 'suspended' | 'deleted' | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<'premium' | 'basic' | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [brokersMin, setBrokersMin] = useState('');
  const [brokersMax, setBrokersMax] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
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

  useEffect(() => {
    fetchUsers();
  }, [name, email, roleFilter, statusFilter, planFilter, dateFrom, dateTo, brokersMin, brokersMax]);

  async function fetchUsers() {
    console.log('Fetching users...');
    setIsLoading(true);
    try {
      const data = await Api.post('/admin/users', {
        name,
        email,
        role: roleFilter,
        status: statusFilter,
        plan: planFilter,
        dateFrom,
        dateTo,
        brokersMax,
        brokersMin,
      });
      console.log('Data to fetch users by filter:', data);
      if (data?.success) {
        console.log('Setting users:', data.users);
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error while fetching users by filter');
    }
    setIsLoading(false);
  }

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

  async function deleteUser(id: string) {
    setIsLoading(true);
    try {
      const data = await Api.delete('/admin/' + id);
      console.log('Deleting user:', data);
      if (data?.success) {
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === data.user._id ? data.user : user)));
        toast({
          title: 'Success',
          description: 'Successfully deleted',
          variant: 'profit',
          duration: 2000,
        });
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message,
        variant: 'destructive',
        duration: 2000,
      });
    }
    setIsLoading(false);
  }

  async function changePlan(userId: string, plan: 'basic' | 'premium') {
    try {
      const data = await Api.post('/admin/change-plan', { userId, plan });
      console.log('Data for change plan:', data);
      if (data?.success) {
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === data.user._id ? data.user : user)));
        toast({
          title: 'Success',
          description: data.message,
          variant: 'profit',
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Unexpected error',
        variant: 'destructive',
        duration: 2000,
      });
    }
  }

  async function changeRole(userId: string, role: UserRole) {
    try {
      const data = await Api.post('/admin/change-role', { userId, role });
      console.log('Data for change role:', data);
      if (data?.success) {
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === data.user._id ? data.user : user)));
        toast({
          title: 'Success',
          description: data.message,
          variant: 'profit',
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Unexpected error',
        variant: 'destructive',
        duration: 2000,
      });
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className='h-4 w-4 ml-1 inline' />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className='h-4 w-4 ml-1 inline' />
    ) : (
      <ArrowDown className='h-4 w-4 ml-1 inline' />
    );
  };

  // Sort users based on sortColumn and sortDirection
  const sortedUsers = [...(users || [])].sort((a, b) => {
    if (!sortColumn) return 0;

    const direction = sortDirection === 'asc' ? 1 : -1;

    switch (sortColumn) {
      case 'user':
        return direction * a.fullName.localeCompare(b.fullName);
      case 'role':
        return direction * a.role.localeCompare(b.role);
      case 'status':
        return direction * a.status.localeCompare(b.status);
      case 'plan':
        return direction * a.plan.localeCompare(b.plan);
      case 'accounts':
        return direction * ((a.accounts?.length || 0) - (b.accounts?.length || 0));
      case 'registration':
        return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'lastLogin':
        const aLogin = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const bLogin = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        return direction * (aLogin - bLogin);
      default:
        return 0;
    }
  });

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <PageHeader>Admin Control Center</PageHeader>
          <PageDescription>Manage users and monitor system-wide trading activity</PageDescription>
        </div>
        <div className='flex gap-2'></div>
      </div>

      {/* System Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='p-4 bg-card/50 backdrop-blur-sm border-border/50'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>Total Users</p>
              <p className='text-2xl font-bold'>{users?.length}</p>
              {/* <p className="text-xs text-profit">+12% this month</p> */}
            </div>
            <Users className='h-8 w-8 text-primary' />
          </div>
        </Card>

        <Card className='p-4 bg-card/50 backdrop-blur-sm border-border/50'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>Active Now</p>
              <p className='text-2xl font-bold'>{activeUsers}</p>
              <p className='text-xs text-profit'>{roundUp((activeUsers / users?.length) * 100, 2)}%</p>
            </div>
            <CircleCheckBig className='h-8 w-8 text-profit' />
          </div>
        </Card>

        <Card className='p-4 bg-card/50 backdrop-blur-sm border-border/50'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>Pending Users</p>
              <p className='text-2xl font-bold'>{pendingUsers}</p>
              <p className='text-xs text-gold'>{roundUp((pendingUsers / users?.length) * 100, 2)}%</p>
            </div>
            <Loader className='h-8 w-8 text-gold' />
          </div>
        </Card>

        <Card className='p-4 bg-card/50 backdrop-blur-sm border-border/50'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>Suspended Users</p>
              <p className='text-2xl font-bold'>{suspendedUsers}</p>
              <p className='text-xs text-loss'>{roundUp((suspendedUsers / users?.length) * 100, 2)}%</p>
            </div>
            <Ban className='h-8 w-8 text-loss' />
          </div>
        </Card>
      </div>

      <div className='rounded-xl border bg-card p-6 shadow-sm'>
        <UserFilters
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          planFilter={planFilter}
          onPlanFilterChange={setPlanFilter}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
          brokersMin={brokersMin}
          onBrokersMinChange={setBrokersMin}
          brokersMax={brokersMax}
          onBrokersMaxChange={setBrokersMax}
        />
      </div>

      {/* User Management */}
      <Card className='bg-card/50 backdrop-blur-sm border-border/50'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold'>User Management</h2>
            <div className='flex items-center gap-3'></div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-border'>
                  {/* <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground"></th> */}
                  <th
                    className='text-left py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none'
                    onClick={() => handleSort('user')}
                  >
                    User
                    {getSortIcon('user')}
                  </th>
                  <th
                    className='text-left py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none'
                    onClick={() => handleSort('role')}
                  >
                    Role
                    {getSortIcon('role')}
                  </th>
                  <th
                    className='text-left py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none'
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {getSortIcon('status')}
                  </th>
                  <th
                    className='text-left py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none'
                    onClick={() => handleSort('plan')}
                  >
                    Account Tier
                    {getSortIcon('plan')}
                  </th>
                  {/* <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Balance</th> */}
                  {/* <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Positions</th> */}
                  <th
                    className='text-left py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none'
                    onClick={() => handleSort('accounts')}
                  >
                    Accounts
                    {getSortIcon('accounts')}
                  </th>
                  <th
                    className='text-left py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none'
                    onClick={() => handleSort('registration')}
                  >
                    Registration
                    {getSortIcon('registration')}
                  </th>
                  <th
                    className='text-left py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none'
                    onClick={() => handleSort('lastLogin')}
                  >
                    Last Login
                    {getSortIcon('lastLogin')}
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-muted-foreground'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || !users ? (
                  <tr>
                    <td colSpan={8} className='py-12'>
                      <div className='flex flex-col items-center justify-center gap-3'>
                        <Loader className='h-8 w-8 animate-spin text-primary' />
                        <p className='text-sm text-muted-foreground'>Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : users?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className='py-12'>
                      <div className='flex flex-col items-center justify-center gap-3'>
                        <Users className='h-12 w-12 text-muted-foreground' />
                        <p className='text-sm text-muted-foreground'>No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => (
                    <tr key={user._id} className='border-b border-border/50 hover:bg-card/50 transition-colors'>
                      <td className='py-3 px-4'>
                        <div>
                          <p className='font-medium'>{user.fullName}</p>
                          <div className='flex gap-1 items-center'>
                            <span className='text-xs pt-0 text-muted-foreground'>{user.email}</span>
                            {user.emailVerified && <CircleCheck size={12} className='text-primary' />}
                            {!user.emailVerified && <CircleAlert size={12} className='text-destructive' />}
                          </div>
                        </div>
                      </td>
                      <td className='py-3 px-4'>
                        <RoleBadge role={user?.role} />
                      </td>
                      <td className='py-3 px-4'>
                        <StatusBadge variant={user?.status} />
                      </td>
                      <td className='py-3 px-4'>
                        <TierBadge variant={user?.plan} />
                      </td>
                      <td className='py-3 px-4'>
                        <p className='font-medium'>{user?.accounts?.length}</p>
                      </td>
                      <td className='py-3 px-4'>
                        <p className='text-sm text-muted-foreground'>
                          {user?.createdAt?.toString().slice(0, 10) ?? ''}
                        </p>
                      </td>
                      <td className='py-3 px-4'>
                        <p className='text-sm text-muted-foreground'>
                          {user?.lastLogin?.toString().slice(0, 10) ?? ''}
                        </p>
                      </td>
                      <td className='py-3 px-4'>
                        <div className='flex items-center gap-2'>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              className='hover:!bg-transparent hover:!text-muted-foreground/50'
                            >
                              <Button variant='ghost' className='h-8 w-8 p-0'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <Link
                                className='flex items-center py-1.5 px-2 w-full hover:text-blue-700 hover:underline transition-all text-sm'
                                to={`${FRONTEND_ENDPOINT}/users/${user._id}`}
                                target='_blank'
                              >
                                <Eye className='mr-2 h-4 w-4' />
                                View Profile
                              </Link>
                              {['owner', 'admin'].includes(me.role) && (
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className='flex items-center text-sm cursor-pointer px-2 py-1.5 hover:'>
                                    <Shield className='mr-2 h-4 w-4' />
                                    Change Role
                                    <ChevronRight className='h-4 w-4 ml-4' />
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent className='bg-card border border-card-elevated rounded-sm p-1'>
                                    {roleOptions
                                      .filter((role) => role.value !== me.role)
                                      .map((role, index) => {
                                        const Icon = role.icon;
                                        return (
                                          <DropdownMenuItem
                                            key={index}
                                            disabled={user.role === role.value}
                                            onClick={() => changeRole(user._id, role.value)}
                                            className='cursor-pointer'
                                          >
                                            <Icon className='mr-2 h-4 w-4' />
                                            {role.label}
                                          </DropdownMenuItem>
                                        );
                                      })}
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                              )}
                              {user.plan === 'basic' && (
                                <DropdownMenuItem
                                  className='text-profit hover:cursor-pointer hover:!bg-profit'
                                  onClick={() => changePlan(user._id, 'premium')}
                                >
                                  <HandCoins className='mr-2 h-4 w-4' />
                                  Premium
                                </DropdownMenuItem>
                              )}
                              {user.plan === 'premium' && (
                                <DropdownMenuItem
                                  className='text-gold hover:cursor-pointer hover:!bg-gold'
                                  onClick={() => changePlan(user._id, 'basic')}
                                >
                                  <HandHelping className='mr-2 h-4 w-4' />
                                  Basic
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {user.status === 'pending' && (
                                <DropdownMenuItem
                                  className='text-success hover:cursor-pointer'
                                  onClick={() => manageAccount(user._id, 'Approve')}
                                >
                                  <UserCheck className='mr-2 h-4 w-4' />
                                  Approve Account
                                </DropdownMenuItem>
                              )}
                              {user.status === 'active' && (
                                <DropdownMenuItem
                                  className='text-warning hover:cursor-pointer'
                                  onClick={() => manageAccount(user._id, 'Suspend')}
                                >
                                  <AlertTriangle className='mr-2 h-4 w-4' />
                                  Suspend Account
                                </DropdownMenuItem>
                              )}
                              {user.status === 'suspended' && (
                                <DropdownMenuItem
                                  className='text-profit hover:cursor-pointer hover:!bg-profit'
                                  onClick={() => manageAccount(user._id, 'Activate')}
                                >
                                  <UserCheck className='mr-2 h-4 w-4' />
                                  Activate Account
                                </DropdownMenuItem>
                              )}
                              {user.status !== 'deleted' && (
                                <DropdownMenuItem
                                  className='text-destructive hover:cursor-pointer hover:!bg-destructive'
                                  onClick={() => {
                                    setOpen(true);
                                    setSelectedUser(user);
                                  }}
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Delete Account
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <DeleteModal
        open={open}
        confirmDelete={() => deleteUser(selectedUser._id)}
        onOpenChange={setOpen}
        isLoading={isLoading}
      />

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
