import AnnouncementManagement from '@/components/admin/announce/Announcement';
import Navbar from '@/components/Navbar';

const Announce = () => {
  return (
    <div className="min-h-screen bg-background main">
      <Navbar />
      <div className="pt-16">
        <AnnouncementManagement />
      </div>
    </div>
  );
};

export default Announce;
