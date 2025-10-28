import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import {
  LayoutDashboard,
  Activity,
  BellPlus,
  Users,
  SquareUser,
  Bell,
  LogOut,
  ChevronDown,
  Logs,
  UserCog,
  Check,
  Shield,
  User,
  BookOpenText,
  FileCog,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';
import logo from '@/assets/logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useSocket } from '@/providers/SocketProvider';
import Api from '@/services/Api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { notifications, setNotifications } = useSocket();
  const isSignedIn = localStorage.getItem('isSignedIn');
  const [unreadCount, setUnreadCount] = useState(0);
  const isLoading = false;

  const roleWeights = {
    user: 1,
    support: 2,
    admin: 3,
    owner: 4,
  };

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  useEffect(() => {
    if (isSignedIn !== 'true' && location.pathname !== '/' && location.pathname !== '/2fa') {
      navigate('/auth');
    }
    if (isSignedIn === 'true' && location.pathname === '/auth') {
      navigate('/dashboard');
    }

    const navItem = navItems.find((ni) => ni.path === location.pathname);
    if (roleWeights[user?.role] < navItem?.minRole) {
      navigate(-1);
    }
  }, [location.pathname, isSignedIn, user]);

  const navItems = [
    { path: '/dashboard', minRole: 1 },
    { path: '/strategies', minRole: 1 },
    { path: '/tutorials', minRole: 1 },

    { path: '/control', minRole: 3 },
    { path: '/strategy-management', minRole: 3 },
    { path: '/announcement', minRole: 3 },
    { path: '/tutorial-management', minRole: 3 },

    { path: '/user-management', minRole: 2 },
    { path: '/logs', minRole: 2 },
  ];

  const nestedNavs = [
    {
      label: 'Admin',
      icon: Shield,
      items: [
        { path: '/control', label: 'Admin Control', icon: UserCog, role: ['owner', 'admin'], minRole: 3 },
        { path: '/strategy-management', label: 'Strategy', icon: Activity, role: ['owner', 'admin'], minRole: 3 },
        { path: '/announcement', label: 'Announce', icon: BellPlus, role: ['owner', 'admin'], minRole: 3 },
        { path: '/tutorial-management', label: 'Tutorials', icon: FileCog, role: ['owner', 'admin'], minRole: 3 },

        { path: '/user-management', label: 'Users', icon: Users, role: ['owner', 'admin', 'support'], minRole: 2 },
        { path: '/logs', label: 'Logs', icon: Logs, role: ['owner', 'admin', 'support'], minRole: 2 },
      ],
    },
    {
      label: 'User',
      icon: User,
      items: [
        {
          path: '/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          role: ['owner', 'admin', 'support', 'user'],
          minRole: 1,
        },
        {
          path: '/strategies',
          label: 'Strategies',
          icon: Activity,
          role: ['owner', 'admin', 'support', 'user'],
          minRole: 1,
        },
        {
          path: '/tutorials',
          label: 'Tutorials',
          icon: BookOpenText,
          role: ['owner', 'admin', 'support', 'user'],
          minRole: 1,
        },
      ],
    },
  ];

  async function markAsRead(id: string) {
    try {
      const data = await Api.post(`/announcement/${id}/mark-read`, { userId: user._id });
      console.log('data to mark as read:', data);
      if (data.success) {
        setNotifications((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error('Error while marking as read:', error);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} className="h-8 w-8 text-primary" alt="TradeAlgo logo" />
              <span className="text-sm md:text-xl font-bold text-gray-200 ">TradeAlgorithm</span>
            </Link>

            {/* Admin & User Navigations */}
            {isSignedIn === 'true' && (
              <div className="flex items-center space-x-1">
                {nestedNavs
                  .filter((nn) => nn.items.filter((item) => item.role.includes(user.role)).length > 0)
                  .map((nav, index) => {
                    const Icon = nav.icon;
                    return (
                      <DropdownMenu key={index}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="!border-0 !outline-none">
                            <Icon className="h-4 w-4 mr-2 hidden md:flex" />
                            <span>{nav.label}</span>
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {nav.items
                            .filter((item) => item.role.includes(user.role))
                            .map((item, idx) => {
                              const ItemIcon = item.icon;
                              return (
                                <DropdownMenuItem key={idx} asChild>
                                  <Link to={item.path} className="flex items-center hover:cursor-pointer">
                                    <ItemIcon className="h-4 w-4 mr-2" />
                                    {item.label}
                                  </Link>
                                </DropdownMenuItem>
                              );
                            })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-0 sm:space-x-2 md:space-x-4">
            {/* Notification Bell */}
            {isSignedIn === 'true' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && <Badge variant="secondary">{unreadCount} new</Badge>}
                  </div>
                  <ScrollArea className="h-[400px]">
                    {isLoading ? (
                      <div className="p-4 text-center text-muted-foreground">Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No notifications</div>
                    ) : (
                      <div className="divide-y">
                        {notifications?.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                              !notification.readers ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <p className="text-sm text-muted-foreground pl-2">{notification.message}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                              {/* {!notification.read && (
                                <Check
                                  className="w-4 h-4 hover:text-muted-foreground transition-colors"
                                  onClick={() => markAsRead(notification.id)}
                                />
                              )} */}
                              <Check
                                className="w-4 h-4 hover:text-muted-foreground transition-colors"
                                onClick={() => markAsRead(notification._id)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}

            {/* Profile Button */}
            {isSignedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SquareUser className="h-4 w-4 mr-2" />
                    <span className="hidden md:flex">{user.fullName}</span>
                    <ChevronDown className="h-4 w-4 md:ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center hover:cursor-pointer">
                      <SquareUser className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600 focus:text-red-600 hover:cursor-pointer "
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Sign In Button */}
            {!isSignedIn && (
              <Link to="/auth">
                <Button variant="default" size="sm" className="shadow-glow-primary">
                  <Users className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
