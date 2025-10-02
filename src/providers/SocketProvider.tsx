import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';
import { roundUp } from '@/lib/utils';
import { BACKEND_ENDPOINT } from '@/config/config';

interface StatsInterface {
  balance: any;
  openPositions: any[];
  closedPositions: any[];
  accountInformation: any[];
  unrealizedPnl: number;
  unrealizedPnlPercentage: number;
  pnl: number;
  pnlPercentage: number;
}

interface SocketContextInterface {
  socket: Socket;
  connected: boolean;
  initializeSocket: (id: string, accountIds: string[]) => void;
  deinitializeSocket: (id: string, accountIds: string[]) => void;
  stats: StatsInterface;
}

const SocketContext = createContext<SocketContextInterface>(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef<Socket>(null);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({
    balance: {},
    openPositions: [],
    closedPositions: [],
    accountInformation: [],
    unrealizedPnl: 0,
    unrealizedPnlPercentage: 0,
    pnl: 0,
    pnlPercentage: 0,
  });

  useEffect(() => {
    // Connect once when provider mounts
    socketRef.current = io(BACKEND_ENDPOINT);

    socketRef.current.on('connect', () => {
      setConnected(true);
      console.log('Connected to socket:', socketRef.current.id);
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from socket');
    });

    socketRef.current.on('stats', (data) => {
      // console.log('Received from socket connection!');
      processStatsData(data);
    });

    return () => {
      // Cleanup on unmount
      socketRef.current.disconnect();
    };
  }, []);

  function initializeSocket(id: string, accountIds: string[]) {
    socketRef.current.emit('initialize', { userId: id, accountIds });
  }

  function deinitializeSocket(id: string, accountIds: string[]) {
    socketRef.current.emit('deinitialize', { userId: id, accountIds });
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

    // console.log('balance:', balance);

    const openSum = [...positions].reduce((sum, cur) => {
      return sum + cur.profit;
    }, 0);

    const closedSum = closedPositions.reduce((sum, cur) => {
      return sum + cur.profit;
    }, 0);

    setStats({
      openPositions: positions,
      closedPositions,
      balance,
      accountInformation: data.accountInfos,
      unrealizedPnl: openSum,
      unrealizedPnlPercentage: roundUp((openSum / (balance.mt4 + balance.mt5)) * 100, 2),
      pnl: closedSum,
      pnlPercentage: roundUp((closedSum / (balance.mt4 + balance.mt5)) * 100, 2),
    });
  }

  // Provide socket and connection status to consumers
  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connected, initializeSocket, deinitializeSocket, stats }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
