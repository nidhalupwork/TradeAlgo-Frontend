import Navbar from "@/components/Navbar";
import RiskManagement from "@/components/RiskManagement";

const RiskManagementPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <RiskManagement />
      </div>
    </div>
  );
};

export default RiskManagementPage;