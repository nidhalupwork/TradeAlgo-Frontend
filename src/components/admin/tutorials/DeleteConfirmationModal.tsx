import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
              <AlertTriangle className='h-5 w-5 text-destructive' />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className='pt-3'>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

