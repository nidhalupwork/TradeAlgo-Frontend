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
  ImagePlus,
  Eye,
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { notifications, setNotifications } = useSocket();
  const isSignedIn = localStorage.getItem('isSignedIn');
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
    { path: '/image-upload', minRole: 3 },

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
        { path: '/image-upload', label: 'Images', icon: ImagePlus, role: ['owner', 'admin'], minRole: 3 },

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

  function openNotificationDetail(notification: any) {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
  }

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border'>
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center gap-2'>
            {/* Logo */}
            <Link to='/' className='flex items-center space-x-2'>
              <img src={logo} className='h-8 w-8 text-primary' alt='TradeAlgo logo' />
              <span className='text-sm md:text-xl font-bold text-gray-200 hidden xs:flex'>TradeAlgorithm</span>
            </Link>
            {/* Admin Navigations */}
            {isSignedIn === 'true' && ['owner', 'admin', 'support'].includes(user.role) && (
              <div className='flex items-center space-x-1'>
                {nestedNavs
                  .filter((nn) => nn.items.filter((item) => item.role.includes(user.role)).length > 0)
                  .map((nav, index) => {
                    const Icon = nav.icon;
                    return (
                      <DropdownMenu key={index}>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline' size='sm' className='!border-0 !outline-none'>
                            <Icon className='h-4 w-4 mr-2 hidden md:flex' />
                            <span>{nav.label}</span>
                            <ChevronDown className='h-4 w-4 ml-2' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-48'>
                          {nav.items
                            .filter((item) => item.role.includes(user.role))
                            .map((item, idx) => {
                              const ItemIcon = item.icon;
                              return (
                                <DropdownMenuItem key={idx} asChild>
                                  <Link to={item.path} className='flex items-center hover:cursor-pointer'>
                                    <ItemIcon className='h-4 w-4 mr-2' />
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

            {/* User Navigations */}
            {isSignedIn === 'true' && user.role === 'user' && (
              <>
                {/* Mobile: Dropdown Navigation */}
                <div className='flex md:hidden items-center space-x-1'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm' className='!border-0 !outline-none'>
                        <User className='h-4 w-4 mr-2' />
                        <span>Menu</span>
                        <ChevronDown className='h-4 w-4 ml-2' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-48'>
                      {nestedNavs[1].items.map((item, idx) => {
                        const ItemIcon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <DropdownMenuItem key={idx} asChild>
                            <Link 
                              to={item.path} 
                              className={`flex items-center hover:cursor-pointer ${
                                isActive ? 'bg-primary text-primary-foreground' : ''
                              }`}
                            >
                              <ItemIcon className='h-4 w-4 mr-2' />
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Desktop: Flat Navigation */}
                <div className='hidden md:flex items-center space-x-1'>
                  {nestedNavs[1].items.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link key={item.path} to={item.path}>
                        <Button
                          variant={isActive ? 'default' : 'ghost'}
                          size='sm'
                          className={isActive ? 'shadow-glow-primary !px-2' : '!px-2'}
                        >
                          <Icon className='h-4 w-4' />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className='flex items-center space-x-0 sm:space-x-2 md:space-x-4'>
            {/* Notification Bell */}
            {isSignedIn === 'true' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='ghost' size='icon' className='relative'>
                    <Bell className='h-5 w-5' />
                    {unreadCount > 0 && (
                      <Badge
                        variant='destructive'
                        className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs'
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-80 p-0' align='end'>
                  <div className='flex items-center justify-between p-4 border-b'>
                    <h3 className='font-semibold'>Notifications</h3>
                    {unreadCount > 0 && <Badge variant='secondary'>{unreadCount} new</Badge>}
                  </div>
                  <ScrollArea className='h-[400px]'>
                    {isLoading ? (
                      <div className='p-4 text-center text-muted-foreground'>Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div className='p-4 text-center text-muted-foreground'>No notifications</div>
                    ) : (
                      <div className='divide-y'>
                        {notifications?.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-4 hover:bg-muted/50 transition-colors ${
                              !notification.readers ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className='flex items-start gap-3'>
                              {/* Image Thumbnail */}
                              {notification.imageUrl && (
                                <img
                                  src={notification.imageUrl}
                                  alt={notification.title}
                                  className='w-16 h-16 object-cover rounded-md flex-shrink-0'
                                />
                              )}

                              {/* Content */}
                              <div className='flex-1 space-y-1 min-w-0'>
                                <p className='text-sm font-medium'>{notification.title}</p>
                                <p className='text-sm text-muted-foreground line-clamp-2'>{notification.message}</p>
                                <p className='text-xs text-muted-foreground'>
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className='flex flex-col gap-2 flex-shrink-0'>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='h-8 w-8'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openNotificationDetail(notification);
                                  }}
                                >
                                  <Eye className='w-4 h-4' />
                                </Button>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='h-8 w-8'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification._id);
                                  }}
                                >
                                  <Check className='w-4 h-4' />
                                </Button>
                              </div>
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
                  <Button variant='outline' size='sm'>
                    <SquareUser className='h-4 w-4 mr-2' />
                    <span className='hidden lg:flex'>{user.fullName}</span>
                    <span className='hidden md:flex lg:hidden'>{user.fullName.split(" ")[0]}</span>
                    {/* <ChevronDown className='h-4 w-4 md:ml-2' /> */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuItem asChild>
                    <Link to='/profile' className='flex items-center hover:cursor-pointer'>
                      <SquareUser className='h-4 w-4 mr-2' />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className='text-red-600 focus:text-red-600 hover:cursor-pointer '
                  >
                    <LogOut className='h-4 w-4 mr-2' />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Sign In Button */}
            {!isSignedIn && (
              <Link to='/auth'>
                <Button variant='default' size='sm' className='shadow-glow-primary'>
                  <Users className='h-4 w-4 mr-2' />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Notification Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>
              {selectedNotification?.createdAt &&
                formatDistanceToNow(new Date(selectedNotification.createdAt), {
                  addSuffix: true,
                })}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Full Image */}
            {selectedNotification?.imageUrl && (
              <img
                src={selectedNotification.imageUrl}
                alt={selectedNotification.title}
                className='w-full h-64 object-cover rounded-lg'
              />
            )}

            {/* Full Message */}
            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>Message</h4>
              <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{selectedNotification?.message}</p>
            </div>

            {/* Expiry Information */}
            {selectedNotification?.expireTime && (
              <div className='flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t'>
                <span>Expires: {new Date(selectedNotification.expireTime).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='outline' onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                markAsRead(selectedNotification._id);
                setIsDetailModalOpen(false);
              }}
            >
              <Check className='w-4 h-4 mr-2' />
              Mark as Read
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
