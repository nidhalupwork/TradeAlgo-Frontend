import Navbar from '@/components/Navbar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TradingDashboard from '@/components/dashboard/TradingDashboard';
import { useAuth } from '@/providers/AuthProvider';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">{user.role === 'user' ? <TradingDashboard /> : <AdminDashboard />}</div>
    </div>
  );
};

export default Dashboard;
