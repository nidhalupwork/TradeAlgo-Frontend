import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleAlert, KeyRound, Loader2, Trash2 } from 'lucide-react';
import { StrategyInterface } from '@/lib/types';

interface AddStrategyModalProps {
  open: 'Delete' | 'Account' | 'Token' | '';
  onOpenChange: (open: 'Delete' | 'Account' | '') => void;
  confirmDelete: () => void;
  isLoading: boolean;
}

export const DeleteModal = ({ open, onOpenChange, confirmDelete, isLoading }: AddStrategyModalProps) => {
  return (
    <Dialog open={['Delete', 'Token'].includes(open)} onOpenChange={() => onOpenChange('')}>
      <DialogContent className="sm:max-w-md" aria-describedby="Strategy Management">
        <DialogHeader>
          {open === 'Delete' && (
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-6 w-6 text-destructive" />
              Are you sure you want to delete?
            </DialogTitle>
          )}

          {open === 'Token' && (
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-profit" />
              Are you sure you want to update the token?
            </DialogTitle>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {open === 'Token' && (
            <div className="flex gap-2 bg-gold/20 border border-gold/60 rounded-lg p-2">
              <CircleAlert className="text-gold" size={20} />
              <p className="text-gold text-sm">It will take some time to sync all accounts with new token.</p>
            </div>
          )}

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
              className={`flex-1 ${open === 'Delete' ? 'bg-destructive text-white hover:bg-destructive/80' : ''}`}
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
