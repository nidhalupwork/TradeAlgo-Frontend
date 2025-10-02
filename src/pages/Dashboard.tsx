import Navbar from '@/components/Navbar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TradingDashboard from '@/components/dashboard/TradingDashboard';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/providers/AuthProvider';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background main">
      <Navbar />
      <div className="pt-16">
        {!user.role && (
          <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
            <Spinner className="w-12 h-12" />
          </div>
        )}
        {user.role === 'user' && <TradingDashboard />}
        {user.role === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
