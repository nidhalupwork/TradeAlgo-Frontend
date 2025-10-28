import Navbar from '@/components/Navbar';
import Tutorial from '@/components/tutorials/Tutorial';

const Tutorials = () => {
  return (
    <div className="min-h-screen bg-background main">
      <Navbar />
      <div className="pt-16">
        <Tutorial />
      </div>
    </div>
  );
};

export default Tutorials;
