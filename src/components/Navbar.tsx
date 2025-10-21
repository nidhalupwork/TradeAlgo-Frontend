import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Activity, Settings, Users, SquareUser, Bell, LogOut, ChevronDown, Logs, UserCog } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect } from 'react';
import logo from '@/assets/logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isSignedIn = localStorage.getItem('isSignedIn');
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn !== 'true' && location.pathname !== '/' && location.pathname !== '/2fa') {
      navigate('/auth');
    }
    if (isSignedIn === 'true' && location.pathname === '/auth') {
      navigate('/dashboard');
    }
  }, [location.pathname, isSignedIn]);

  const navItems = [
    // user and admin page
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'all' },
    { path: '/strategies', label: 'Strategies', icon: Activity, role: 'all' },
    
    // admin only page
    { path: '/control', label: 'Admin Control', icon: UserCog, role: 'admin' },
    { path: '/user-management', label: 'Users', icon: Users, role: 'admin' },
    { path: '/strategy-management', label: 'Strategy', icon: Activity, role: 'admin' },
    { path: '/logs', label: 'Logs', icon: Logs, role: 'admin' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} className="h-8 w-8 text-primary" alt="TradeAlgo logo" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-700 via-gray-600 to-gray-200">
                TradeAlgorithm
              </span>
            </Link>

            {isSignedIn === 'true' && (
              <div className="hidden md:flex items-center space-x-1">
                {navItems
                  .filter((ni) => ni?.role === user?.role || ni?.role === 'all')
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    if (user?.role !== 'admin' && item.label === 'Admin') {
                      return <div key={item.path}></div>;
                    } else {
                      return (
                        <Link key={item.path} to={item.path} className="hover:cursor-pointer">
                          <Button
                            variant={isActive ? 'default' : 'ghost'}
                            size="sm"
                            className={isActive ? 'shadow-glow-primary' : ''}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    }
                  })}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* {isSignedIn === 'true' && (
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            )} */}
            {/* {isSignedIn === 'true' && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )} */}
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SquareUser className="h-4 w-4 mr-2" />
                    {user.fullName}
                    <ChevronDown className="h-4 w-4 ml-2" />
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
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 hover:cursor-pointer ">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
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
