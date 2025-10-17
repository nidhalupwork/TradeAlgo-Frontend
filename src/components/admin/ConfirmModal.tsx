import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleAlert, KeyRound, Loader2, Pause, Play, Power, Trash2, TvMinimalPlay } from 'lucide-react';
import { StrategyInterface } from '@/lib/types';

interface AddStrategyModalProps {
  open: 'stop' | 'start' | 'live' | 'maintain' | '';
  onOpenChange: (open: 'stop' | 'start' | 'live' | 'maintain' | '') => void;
  confirmDelete: () => void;
  isLoading: boolean;
}

export const ConfirmModal = ({ open, onOpenChange, confirmDelete, isLoading }: AddStrategyModalProps) => {
  return (
    <Dialog open={['stop', 'start', 'live', 'maintain'].includes(open)} onOpenChange={() => onOpenChange('')}>
      <DialogContent className="sm:max-w-md" aria-describedby="Strategy Management">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {open === 'start' && <Play className="h-6 w-6 text-profit" />}
            {open === 'stop' && <Power className="h-6 w-6 text-destructive" />}
            {open === 'live' && <TvMinimalPlay className="h-6 w-6 text-profit" />}
            {open === 'maintain' && <Pause className="h-6 w-6 text-gold" />}

            {open === 'start' && <span className="text-profit">Are you sure?</span>}
            {open === 'stop' && <span className="text-destructive">Are you sure?</span>}
            {open === 'live' && <span className="text-profit">Are you sure?</span>}
            {open === 'maintain' && <span className="text-gold">Are you sure?</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="flex-1"
              onClick={() => onOpenChange('')}
            >
              No
            </Button>

            <Button
              type="button"
              disabled={isLoading}
              className={`flex-1 ${open === 'stop' ? 'bg-destructive text-white hover:bg-destructive/80' : ''}`}
              onClick={() => confirmDelete()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
