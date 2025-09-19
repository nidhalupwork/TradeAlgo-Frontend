import { UserInterface } from '@/lib/types';
import { useContext, createContext, Dispatch, SetStateAction, ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '@/services/Api';
import { useSocket } from './SocketProvider';

interface AuthContextInterface {
  user: UserInterface;
  setUser: Dispatch<SetStateAction<UserInterface>>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { initializeSocket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
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
    role: 'user',
    strategySetting: [],
    updatedAt: new Date(),
    username: '',
    lastLogin: new Date(),
    accounts: [],
    riskSettings: null,
  });

  useEffect(() => {
    checkExistingToken();
  }, []);

  async function checkExistingToken() {
    const isSignedIn = localStorage.getItem('isSignedIn');

    if (location.pathname !== '/') {
      if (isSignedIn) {
        const data = await apiClient.get('/auth/refresh');
        console.log('checkExistingToken -> data:', data);
        if (data.success) {
          setUser(data.user);

          const accountIds = data.user.accounts.reduce((acc, cur) => {
            return [...acc, cur.accountId];
          }, []);
          console.log('accountIds', accountIds);
          initializeSocket(data.user._id, accountIds);
        } else {
          navigate('/auth');
        }
      } else {
        navigate('/auth');
      }
    }
  }

  async function signOut() {
    console.log('Sign out buttong is clicked');
    localStorage.removeItem('isSignedIn');
    navigate('/auth');
  }

  return <AuthContext.Provider value={{ user, setUser, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthContextProvider');
  }

  return context;
};
