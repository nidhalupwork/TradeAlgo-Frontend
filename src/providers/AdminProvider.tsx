import { GlobalSettingInterface, StrategyInterface, UserInterface } from '@/lib/types';
import { useContext, createContext, Dispatch, SetStateAction, ReactNode, useState, useEffect } from 'react';

interface AdminContextInterface {
  users: UserInterface[];
  setUsers: Dispatch<SetStateAction<UserInterface[]>>;
  strategies: StrategyInterface[] | null;
  setStrategies: Dispatch<SetStateAction<StrategyInterface[]>>;
  globalSetting: GlobalSettingInterface;
  setGlobalSetting: Dispatch<SetStateAction<GlobalSettingInterface>>;
}

export const AdminContext = createContext<AdminContextInterface | undefined>(undefined);

export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserInterface[] | undefined>(undefined);
  const [strategies, setStrategies] = useState(null);
  const [globalSetting, setGlobalSetting] = useState<GlobalSettingInterface>();

  useEffect(() => {
    console.log('admin users:', users);
  }, [users]);

  return (
    <AdminContext.Provider value={{ users, setUsers, strategies, setStrategies, globalSetting, setGlobalSetting }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthContextProvider');
  }

  return context;
};
