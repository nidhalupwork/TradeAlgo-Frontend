import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Activity,
  Settings,
  Users,
  SquareUser,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect } from 'react';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isSignedIn = localStorage.getItem('isSignedIn');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn !== 'true' && location.pathname !== '/') {
      navigate('/auth');
    }
  }, [location.pathname]);

  const navItems = [
    // user page
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'all' },
    { path: '/strategies', label: 'Strategies', icon: Activity, role: 'user' },
    { path: '/profile', label: 'Profile', icon: SquareUser, role: 'user' },

    // admin page
    { path: '/user-management', label: 'Users', icon: Users, role: 'admin' },
    { path: '/strategy-management', label: 'Strategy', icon: Activity, role: 'admin' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} className="h-8 w-8 text-primary" alt="TradeAlgo logo" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-700 via-gray-600 to-gray-200">TradeAlgorithm</span>
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
                        <Link key={item.path} to={item.path}>
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
            {isSignedIn === 'true' && (
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            )}
            {isSignedIn === 'true' && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )}
            {isSignedIn ? (
              <Button variant="destructive" size="sm" onClick={() => signOut()}>
                <LogOut />
                Sign Out
              </Button>
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
