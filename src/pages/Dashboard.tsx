import Navbar from "@/components/Navbar";
import TradingDashboard from "@/components/TradingDashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <TradingDashboard />
      </div>
    </div>
  );
};

export default Dashboard;