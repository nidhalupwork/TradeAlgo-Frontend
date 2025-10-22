import Navbar from "@/components/Navbar";
import StrategyMarketplace from "@/components/strategy/StrategyMarketplace";

const Strategies = () => {
  return (
    <div className="min-h-screen bg-background main">
      <Navbar />
      <div className="pt-16">
        <StrategyMarketplace />
      </div>
    </div>
  );
};

export default Strategies;