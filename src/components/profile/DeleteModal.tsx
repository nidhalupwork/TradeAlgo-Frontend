import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { StrategyInterface } from '@/lib/types';

interface AddStrategyModalProps {
  accountId: string;
  open: 'Delete' | 'Account' | '';
  onOpenChange: (open: 'Delete' | 'Account' | '') => void;
  confirmDelete: (accountId: string) => void;
  isLoading: boolean;
}

export const DeleteModal = ({ open, onOpenChange, accountId, confirmDelete, isLoading }: AddStrategyModalProps) => {
  return (
    <Dialog open={open === 'Delete'} onOpenChange={() => onOpenChange('')}>
      <DialogContent className="sm:max-w-md" aria-describedby="Strategy Management">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-destructive" />
            Are you sure you want to delete?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="flex-1"
              onClick={() => onOpenChange('')}
            >
              No
            </Button>
            <Button disabled={isLoading} className="flex-1" onClick={() => confirmDelete(accountId)}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
