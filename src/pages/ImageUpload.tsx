import ImageManagement from '@/components/admin/media/ImageManagement';
import Navbar from '@/components/Navbar';

const ImageUpload = () => {
  return (
    <div className="min-h-screen bg-background main">
      <Navbar />
      <div className="pt-16">
        <ImageManagement />
      </div>
    </div>
  );
};

export default ImageUpload;

