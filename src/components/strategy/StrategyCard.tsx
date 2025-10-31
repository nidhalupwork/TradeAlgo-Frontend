import { CircleAlert, EditIcon, Settings, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { useAuth } from '@/providers/AuthProvider';
import { MarketplaceOpen, StrategyInterface } from '@/lib/types';

export const StrategyCard = ({
  strategy,
  onConfigModalOpen,
  subscribeStrategy,
  setStrategy,
  setOpen,
}: {
  strategy: StrategyInterface;
  onConfigModalOpen: (strat: any) => void;
  subscribeStrategy: (strategyId: string, accountId: string, type: string) => Promise<void>;
  setStrategy?: React.Dispatch<React.SetStateAction<StrategyInterface>>;
  setOpen: React.Dispatch<React.SetStateAction<MarketplaceOpen>>;
}) => {
  const { user, setUser } = useAuth();
  return (
    <Card
      key={strategy?.title}
      className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all ${
        strategy?.enabled ? 'ring-2 ring-profit/20' : ''
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className=" w-full">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{strategy?.title}</h3>
                {strategy.images.map((image, index) => (
                  <img key={index} src={image} alt={strategy.symbol} className="w-8 h-8 object-cover rounded-full" />
                ))}
                <Badge
                  className={
                    strategy?.status === 'Live'
                      ? 'bg-profit/20 text-profit'
                      : strategy?.status === 'Paused'
                      ? 'bg-gold/20 text-gold'
                      : 'bg-primary/20 text-primary'
                  }
                >
                  {strategy?.status}
                </Badge>
              </div>
              {user?.role === 'admin' && <Switch checked={strategy?.enabled} />}
            </div>
            <p className="text-sm text-muted-foreground">{strategy?.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">Select the account to subscribe this strategy.</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              {user?.accounts.map((acc) => {
                return (
                  <div key={acc.accountId} className="flex gap-2 items-center mt-1">
                    <Checkbox
                      checked={acc.strategySettings.find((ss) => ss.strategyId === strategy._id)?.subscribed}
                      onClick={() => {
                        subscribeStrategy(strategy._id, acc.accountId, '');
                      }}
                    />
                    {acc.name}
                  </div>
                );
              })}
              {user?.accounts?.length > 1 && (
                <div className="flex gap-2 items-center mt-1">
                  <Checkbox
                    checked={user.accounts.every(
                      (account) => account?.strategySettings?.find((ss) => ss.strategyId === strategy._id)?.subscribed
                    )}
                    onClick={() => {
                      subscribeStrategy(strategy._id, '', 'All');
                    }}
                  />{' '}
                  All
                </div>
              )}
              {user?.accounts?.length === 0 && (
                <div className="flex gap-2 items-center mt-1">
                  <CircleAlert color="gold" size={20} />
                  <p className="text-muted-foreground text-sm">You have no account</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {user?.status === 'active' && user?.accounts?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Settings
                    className="h-4 w-4 cursor-pointer hover:text-muted-foreground transition-all"
                    onClick={() => onConfigModalOpen(strategy)}
                  />
                </div>
              )}
              {user?.status === 'active' && strategy?.type === 'custom' && (
                <div className="flex items-center gap-2">
                  <EditIcon
                    className="h-4 w-4 cursor-pointer hover:text-muted-foreground transition-all"
                    onClick={() => {
                      setOpen('Edit');
                      setStrategy(strategy);
                    }}
                  />
                </div>
              )}
              {user?.status === 'active' && strategy?.type === 'custom' && (
                <div className="flex items-center gap-2">
                  <Trash2
                    className="h-4 w-4 cursor-pointer text-destructive hover:text-destructive/60 transition-all"
                    onClick={() => {
                      setOpen('Delete');
                      setStrategy(strategy);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
