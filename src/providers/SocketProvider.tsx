import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BACKEND_ENDPOINT } from '@/config/config';
import { Announcement } from '@/lib/types';

interface StatsInterface {
  balance: any;
  openPositions: any[];
  closedPositions: any[];
  accountInformation: any[];
}

interface SocketContextInterface {
  socket: Socket;
  connected: boolean;
  portfolio: any;
  initializeSocket: (id: string, email: string, accountIds: string[]) => void;
  deinitializeSocket: (id: string, accountIds: string[]) => void;
  signOutSocket: (id: string, email: string) => void;
  stats: StatsInterface;
  notifications: Announcement[];
  setNotifications: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

const SocketContext = createContext<SocketContextInterface>(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef<Socket>(null);
  const [connected, setConnected] = useState(false);
  const [portfolio, setPortfolio] = useState();
  const [googleId, setGoogleId] = useState(localStorage.getItem('googleId'));
  const [stats, setStats] = useState({
    balance: {},
    openPositions: [],
    closedPositions: [],
    accountInformation: [],
  });
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    accounts: [],
  });
  const [notifications, setNotifications] = useState<Announcement[]>([]);

  useEffect(() => {
    let temp = localStorage.getItem('googleId');
    if (!temp) {
      temp = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('googleId', temp);
    }
    setGoogleId(temp);

    // Connect once when provider mounts
    socketRef.current = io(BACKEND_ENDPOINT);

    socketRef.current.on('connect', () => {
      setConnected(true);
      if (userData.email) {
        initializeSocket(userData.id, userData.email, userData.accounts);
      }
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from socket');

      const isSignedIn = localStorage.getItem('isSignedIn');
      if (isSignedIn && userData.id && userData.email && userData.accounts.length > 0) {
        initializeSocket(userData.id, userData.email, userData.accounts);
      }
    });

    socketRef.current.on('stats', (data) => {
      // console.log('Received from socket connection!', data);
      processStatsData(data);
    });

    socketRef.current.on('announcements', (data) => {
      console.log('Received from socket for notifications:', data);
      console.log('notifications:', notifications);
      setNotifications((prevNotifications) => [data, ...prevNotifications]);
    });

    socketRef.current.on('portfolio', (data) => {
      setPortfolio(data.portfolio);
    });

    return () => {
      // Cleanup on unmount
      console.log('Socket is disconnected');
      socketRef.current.disconnect();
    };
  }, []);

  function initializeSocket(id: string, email: string, accounts: string[]) {
    socketRef.current.emit('initialize', {
      userId: id,
      email,
      accounts,
      googleId,
    });
    setUserData({ id, email, accounts });
  }

  function deinitializeSocket(id: string, accountIds: string[]) {
    socketRef.current.emit('deinitialize', { userId: id, accountIds });
  }

  function signOutSocket(id: string, email: string) {
    console.log('signOutSocket is called');
    socketRef.current.emit('signOut', { userId: id, email, googleId });
  }

  function processStatsData(data: any) {
    const balance: { mt4: number; mt5: number } = data.accountInfos.reduce(
      (bal, info) => {
        if (info?.platform === 'mt4') {
          return { ...bal, mt4: bal.mt4 + info.balance };
        } else if (info?.platform === 'mt5') {
          return { ...bal, mt5: bal.mt5 + info.balance };
        }
      },
      { mt4: 0, mt5: 0 }
    );

    const deals = data.deals;
    const positions = data.positions;

    const closedPositions = [];
    deals.map((deal) => {
      if (deals.filter((d) => d.positionId && d.positionId === deal.positionId).length === 2) {
        const temp = {
          accountId: '',
          login: '',
          brokerTime: '',
          openPrice: 0,
          profit: 0,
          currentPrice: 0,
          type: 'buy',
          symbol: '',
          platform: '',
          volume: 0,
          magic: 0,
          positionId: deal.positionId,
          entryType: '',
          closedTime: '',
        };

        if (!closedPositions.find((cp) => cp.positionId === deal.positionId)) {
          closedPositions.push(temp);
        }
        const pos = closedPositions.find((cp) => cp.positionId === deal.positionId);
        if (deal.entryType === 'DEAL_ENTRY_IN') {
          pos.accountId = deal.accountId;
          pos.login = deal.login;
          pos.brokerTime = deal.brokerTime;
          pos.openPrice = deal.price;
          pos.type = deal.type;
          pos.symbol = deal.symbol;
          pos.platform = deal.platform;
          pos.volume = deal.volume;
          pos.magic = deal.magic;
        } else if (deal.entryType === 'DEAL_ENTRY_OUT') {
          pos.profit = deal.profit;
          pos.currentPrice = deal.price;
          pos.status = 'Closed';
          pos.closedTime = deal.brokerTime;
        }
      }
    });

    setStats({
      openPositions: positions,
      closedPositions,
      balance,
      accountInformation: data.accountInfos,
    });
  }

  // Provide socket and connection status to consumers
  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        portfolio,
        initializeSocket,
        deinitializeSocket,
        signOutSocket,
        stats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
