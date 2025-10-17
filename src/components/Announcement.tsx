import { useAuth } from '@/providers/AuthProvider';

const Announcement = () => {
  const { user } = useAuth();
  return (
    <div className='w-full z-50'>
      {user?.status === 'pending' && (
        <p className='bg-yellow-500 py-1 text-white font-semibold text-base text-center rounded-lg'>
          Your account is not approved yet. Please contact support to activate your account. Any data is currently for
          example purposes.
        </p>
      )}
    </div>
  );
};

export default Announcement;
