import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Settings, CalendarDays, Verified, AlertCircle, OctagonX } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export const ProfileHeader = () => {
  const { user } = useAuth();
  return (
    <Card className="shadow-card bg-gradient-subtle border-0">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-elegant">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback className="text-2xl font-semibold bg-gradient-primary text-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-background"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex gap-2 items-center">
                <h1 className="text-3xl font-bold tracking-tight">{user?.fullName || ''}</h1>
                {user?.status === 'active' && <Verified className="text-primary" size={25} strokeWidth={2.5} />}
                {user?.status === 'pending' && <AlertCircle className="text-gold" size={25} strokeWidth={2.5} />}
                {user?.status === 'suspended' && <OctagonX className="text-destructive" size={25} strokeWidth={2.5} />}
              </div>
              <p className="text-muted-foreground">
                {user?.role ? user?.role[0].toUpperCase() + user?.role.slice(1) : ''}
              </p>
              <div className="flex gap-2 items-center">
                <CalendarDays className="text-muted-foreground" size={20} />
                <p className="text-muted-foreground">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) ?? ''}
                </p>
              </div>
            </div>

            {/* Badges */}
            {/* <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Pro Trader
              </Badge>
              <Badge variant="outline">Member since 2023</Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20">API Connected</Badge>
            </div> */}

            {/* Stats */}
            {/* <div className="flex flex-wrap gap-3 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">+$24,580</p>
                <p className="text-sm text-muted-foreground">Total P&L</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Active Signals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">89.2%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
            </div> */}
          </div>

          {/* <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};
