import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleAlert, KeyRound, Loader2, Trash2 } from 'lucide-react';
import { MarketplaceOpen, StrategyInterface } from '@/lib/types';

interface AddStrategyModalProps {
  open: MarketplaceOpen;
  onOpenChange: () => void;
  confirmDelete: () => void;
  isLoading: boolean;
}

export const DeleteModal = ({ open, onOpenChange, confirmDelete, isLoading }: AddStrategyModalProps) => {
  return (
    <Dialog open={open === 'Delete'} onOpenChange={() => onOpenChange()}>
      <DialogContent className="sm:max-w-md" aria-describedby="Strategy Management">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-destructive" />
            Are you sure you want to delete?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="flex-1"
              onClick={() => onOpenChange()}
            >
              No
            </Button>

            <Button
              type="button"
              disabled={isLoading}
              className={`flex-1 bg-destructive text-white hover:bg-destructive/80`}
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
