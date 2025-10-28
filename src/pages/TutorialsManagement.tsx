import AdminTutorial from '@/components/admin/tutorials/AdminTutorial';
import Navbar from '@/components/Navbar';

const TutorialsManagement = () => {
  return (
    <div className="min-h-screen bg-background main">
      <Navbar />
      <div className="pt-16">
        <AdminTutorial />
      </div>
    </div>
  );
};

export default TutorialsManagement;
