import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Search,
  Activity,
  AlertCircle,
  TrendingUp,
  User,
  Mail,
  Hash,
  CircleCheck,
  CircleAlert,
  ShieldCheck,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '../Navbar';
import Api from '@/services/Api';

const Logs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activities, setActivities] = useState([]);

  const getLevelBadge = (level: string) => {
    const variants: Record<string, { className: string; text: string }> = {
      Activity: { className: 'bg-profit text-profit-foreground', text: 'Success' },
      Error: { className: 'bg-destructive text-destructive-foreground', text: 'Error' },
      Warn: { className: 'bg-warning text-warning-foreground', text: 'Warning' },
      info: { className: 'bg-info text-info-foreground', text: 'Info' },
    };

    const variant = variants[level] || variants.info;
    return <Badge className={variant.className}>{variant.text}</Badge>;
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const data = await Api.get('/admin/logs?skip=0&limit=100');
      console.log('Data for fetching logs:', data);
      if (data?.success) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Error while fetching logs:', error);
    }
  }

  return (
    <div className="main">
      <Navbar />
      <div className="space-y-6 pt-[88px] px-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Monitor user activities and troubleshoot errors across the trading platform
          </p>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">+12% from last hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Error Count</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">-5% from last hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">8 new in last hour</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Main Logs Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Log Explorer</CardTitle>
                <CardDescription>Search and filter logs by user, email, or MT account</CardDescription>
              </div>

              {/* Search and Filter Controls */}
              {/* <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, MT ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Logs</SelectItem>
                    <SelectItem value="user">By User</SelectItem>
                    <SelectItem value="email">By Email</SelectItem>
                    <SelectItem value="mt">By MT Account</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </CardHeader>

          <CardContent>
            {/* Activity Logs Tab */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>MT Account</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell className="font-mono text-sm">{log.time}</TableCell>
                      <TableCell>
                        {log.userType === 'user' && (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 font-medium">
                              <User className="h-3.5 w-3.5 text-muted-foreground" />
                              {log.userId?.fullName}
                              {log.userId?.status === 'active' && (
                                <span className="text-profit text-[10px]">Active</span>
                              )}
                              {log.userId?.status === 'suspended' && <span className="text-loss">Suspended</span>}
                              {log.userId?.status === 'pending' && (
                                <span className="text-gold text-[10px]">Pending</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {log.userId?.email}
                              {log.userId?.emailVerified && <CircleCheck size={12} className="text-primary" />}
                              {!log.userId?.emailVerified && <CircleAlert size={12} className="text-destructive" />}
                            </div>
                          </div>
                        )}
                        {log.userType === 'admin' && (
                          <div className="flex items-center gap-1.5 font-medium">
                            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                            admin
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-mono text-sm">
                          {log?.mtAccountId && <Hash className="h-3.5 w-3.5 text-muted-foreground" />}
                          {log?.mtAccountId ?? '-'}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.type === 'Activity' ? (
                          log.action
                        ) : (
                          <code className="rounded bg-muted px-2 py-1 text-sm font-semibold text-destructive">
                            {log.action}
                          </code>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md font-mono text-sm text-muted-foreground">
                        {log.description}
                      </TableCell>
                      <TableCell>{getLevelBadge(log.type)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;
