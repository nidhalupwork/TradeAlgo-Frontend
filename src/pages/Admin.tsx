import Navbar from "@/components/Navbar";
import AdminPanel from "@/components/AdminPanel";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <AdminPanel />
      </div>
    </div>
  );
};

export default Admin;