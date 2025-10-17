import { UserInterface } from '@/lib/types';
import { useContext, createContext, Dispatch, SetStateAction, ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '@/services/Api';
import { useSocket } from './SocketProvider';
import { useAdmin } from './AdminProvider';
import Api from '@/services/Api';

interface AuthContextInterface {
  user: UserInterface;
  setUser: Dispatch<SetStateAction<UserInterface>>;
  urlAccess: boolean;
  setUrlAccess: Dispatch<SetStateAction<boolean>>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { initializeSocket, deinitializeSocket, signOutSocket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { setUsers, setStrategies, setGlobalSetting } = useAdmin();
  const [urlAccess, setUrlAccess] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface>({
    _id: '',
    createdAt: new Date(),
    email: '',
    fullName: '',
    isActive: false,
    isPausedTradingForDay: false,
    metaApiToken: '',
    mt5AccountId: '',
    phoneNumber: '',
    role: '',
    strategySetting: [],
    updatedAt: new Date(),
    username: '',
    lastLogin: new Date(),
    accounts: [],
    riskSettings: null,
    plan: '',
    status: '',
    twoFA: false,
    emailVerified: false,
    globalSetting: {
      dailyLossCurrency: 'amount',
      dailyLossLimit: 0,
      maxLossCurrency: 'amount',
      maxLossLimit: 0,
    },
  });

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const isSignedIn = localStorage.getItem('isSignedIn');

    if (isSignedIn) {
      try {
        const data = await apiClient.get('/auth/refresh');
        if (data.success) {
          setUser(data.user);
          setUsers(data.users);
          setStrategies(data.strategies);
          setGlobalSetting(data.setting);

          if (data.user.role === 'user') {
            const accountIds = data.user.accounts.reduce((acc, cur) => {
              return [...acc, cur.accountId];
            }, []);
            initializeSocket(data.user._id, data.user.email, accountIds);
          }

          if (location.pathname === '/auth') {
            navigate('/dashboard');
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('error in refresh:', error);
      }
    } else {
      const allowedPaths = ['/', '/2fa', '/auth', '/reset-password'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/auth');
      }
    }
  }

  async function signOut() {
    try {
      const data = await Api.post('/auth/sign-out');
      console.log('sign-out data:', data);
      if (data?.success) {
        console.log('Sign out buttong is clicked');
        const accountIds = user?.accounts.reduce((acc, cur) => {
          return [...acc, cur.accountId];
        }, []);
        signOutSocket(user._id, user.email);
        localStorage.removeItem('isSignedIn');
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error in sign-out:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, urlAccess, setUser, setUrlAccess, signOut }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthContextProvider');
  }

  return context;
};
