import { useAuth } from '@/providers/AuthProvider';

const Announcement = () => {
  const { user } = useAuth();
  return (
    <div className="fixed mt-16 px-6 py-2 w-full z-50">
      {user?.status === 'pending' && (
        <p className="bg-yellow-500 py-1 text-black font-semibold text-base text-center rounded-lg">
          Your account is under review. Please check back later for updates on your account status.
        </p>
      )}
    </div>
  );
};

export default Announcement;
