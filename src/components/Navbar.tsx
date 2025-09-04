import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  LayoutDashboard, 
  Activity, 
  Settings, 
  ShieldCheck,
  Users,
  Bell
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: TrendingUp },
    // { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    // { path: "/strategies", label: "Strategies", icon: Activity },
    { path: "/risk-management", label: "Risk", icon: ShieldCheck },
    // { path: "/admin", label: "Admin", icon: Users },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TradeAlgo Pro
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={isActive ? "shadow-glow-primary" : ""}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="gold" size="sm">
              Connect Broker
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;