import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  Shield, 
  Activity,
  Ban,
  CheckCircle,
  AlertTriangle,
  Search,
  Settings,
  Power
} from "lucide-react";

const AdminPanel = () => {
  const users = [
    {
      id: 1,
      name: "John Trader",
      email: "john@example.com",
      status: "active",
      plan: "Premium",
      balance: 25000,
      openPositions: 3,
      dailyPnL: 450,
      riskStatus: "healthy",
      lastActive: "2 min ago"
    },
    {
      id: 2,
      name: "Sarah Markets",
      email: "sarah@example.com",
      status: "active",
      plan: "Basic",
      balance: 10000,
      openPositions: 1,
      dailyPnL: -120,
      riskStatus: "warning",
      lastActive: "15 min ago"
    },
    {
      id: 3,
      name: "Mike Investor",
      email: "mike@example.com",
      status: "suspended",
      plan: "Premium",
      balance: 50000,
      openPositions: 0,
      dailyPnL: 0,
      riskStatus: "paused",
      lastActive: "2 hours ago"
    },
    {
      id: 4,
      name: "Emma Forex",
      email: "emma@example.com",
      status: "active",
      plan: "Premium",
      balance: 35000,
      openPositions: 5,
      dailyPnL: 1250,
      riskStatus: "healthy",
      lastActive: "Just now"
    },
    {
      id: 5,
      name: "Alex Crypto",
      email: "alex@example.com",
      status: "active",
      plan: "Basic",
      balance: 8500,
      openPositions: 2,
      dailyPnL: -350,
      riskStatus: "critical",
      lastActive: "30 min ago"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Control Center</h1>
          <p className="text-muted-foreground">Manage users and monitor system-wide trading activity</p>
        </div>
        <Button variant="destructive" size="lg">
          <Power className="h-4 w-4 mr-2" />
          Global Kill Switch
        </Button>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">48</p>
              <p className="text-xs text-profit">+12% this month</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Now</p>
              <p className="text-2xl font-bold">23</p>
              <p className="text-xs text-muted-foreground">47.9% online</p>
            </div>
            <Activity className="h-8 w-8 text-profit" />
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Positions</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-gold">$2.4M volume</p>
            </div>
            <Shield className="h-8 w-8 text-gold" />
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Risk Alerts</p>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-loss">2 critical</p>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-10 w-64"
                />
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Balance</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Positions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Daily P&L</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Risk</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.status === 'active' ? (
                        <Badge className="bg-profit/20 text-profit">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-loss/20 text-loss">
                          <Ban className="h-3 w-3 mr-1" />
                          Suspended
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.plan === 'Premium' ? 'default' : 'outline'} 
                             className={user.plan === 'Premium' ? 'bg-gradient-gold text-background' : ''}>
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">${user.balance.toLocaleString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{user.openPositions}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className={`font-medium ${user.dailyPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                        ${user.dailyPnL >= 0 ? '+' : ''}{user.dailyPnL}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {user.riskStatus === 'healthy' && (
                        <Badge className="bg-profit/20 text-profit">Healthy</Badge>
                      )}
                      {user.riskStatus === 'warning' && (
                        <Badge className="bg-warning/20 text-warning">Warning</Badge>
                      )}
                      {user.riskStatus === 'critical' && (
                        <Badge className="bg-loss/20 text-loss">Critical</Badge>
                      )}
                      {user.riskStatus === 'paused' && (
                        <Badge variant="outline">Paused</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground">{user.lastActive}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default AdminPanel;