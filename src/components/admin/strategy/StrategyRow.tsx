import { StrategyStatusBadge } from '@/components/components/Badges';
import { Switch } from '@/components/ui/switch';
import { TableRow, TableCell } from '@/components/ui/table';
import { StrategyInterface } from '@/lib/types';
import { Edit, Trash2, Users } from 'lucide-react';

interface StrategyRowProps {
  strategy: StrategyInterface;
  type: 'default' | 'custom';
  enablingStrategy: (strategyId: string, value: boolean) => void;
  setOpen: (open: 'Edit' | 'Delete' | '') => void;
  setStrategy: (strategy: StrategyInterface) => void;
}

export const StrategyRow = ({ strategy, type, enablingStrategy, setOpen, setStrategy }: StrategyRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className='font-medium'>{strategy.title}</div>
      </TableCell>
      {type === 'custom' && (
        <TableCell>
          <div className='flex flex-col'>
            <p className='font-medium'>{strategy?.userId?.fullName}</p>
            <p className='text-xs text-muted-foreground'>{strategy?.userId?.email}</p>
          </div>
        </TableCell>
      )}
      <TableCell className='flex gap-2 items-center'>
        {strategy.images.map((image, index) => (
          <img key={index} src={image} alt={strategy.symbol} className='w-8 h-8 object-cover rounded-full' />
        ))}
      </TableCell>
      <TableCell>{strategy.symbol}</TableCell>
      <TableCell>
        <StrategyStatusBadge status={strategy.status} />
      </TableCell>
      <TableCell>
        <div className='flex items-center gap-1'>
          <Users className='h-3 w-3 text-muted-foreground' />
          {strategy.subscribers.length}
        </div>
      </TableCell>
      <TableCell>
        <div className='flex items-center gap-2'>
          <Switch checked={strategy.enabled} onCheckedChange={(value) => enablingStrategy(strategy._id, value)} />
          <span className='text-xs text-muted-foreground'>{strategy.enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className='flex items-center gap-2'>
          <Edit
            size={20}
            className='hover:cursor-pointer hover:text-blue-400 transition-all'
            onClick={() => {
              setOpen('Edit');
              setStrategy(strategy);
            }}
          />
          <Trash2
            size={20}
            className='hover:cursor-pointer text-red-600 hover:text-red-700 transition-all'
            onClick={() => {
              setOpen('Delete');
              setStrategy(strategy);
            }}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
