import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StrategyInterface } from '@/lib/types';
import apiClient from '@/services/Api';
import { useAuth } from '@/providers/AuthProvider';
import Api from '@/services/Api';
import { useAdmin } from '@/providers/AdminProvider';

interface AddStrategyModalProps {
  selectedStrategy: StrategyInterface;
  open: 'Edit' | 'Add' | 'Delete' | '';
  onOpenChange: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddStrategyModal = ({
  open,
  onOpenChange,
  selectedStrategy,
  isLoading,
  setIsLoading,
}: AddStrategyModalProps) => {
  const { setStrategies, strategies } = useAdmin();
  const [strategy, setStrategy] = useState({
    id: '',
    title: '',
    description: '',
    status: 'Live',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (selectedStrategy) {
      setStrategy({
        id: selectedStrategy._id,
        title: selectedStrategy.title,
        description: selectedStrategy.description,
        status: selectedStrategy.status,
      });
    } else {
      setStrategy({
        id: '',
        title: '',
        description: '',
        status: 'Live',
      });
    }
  }, [selectedStrategy]);

  async function handleSubmit(type: 'Add' | 'Edit' | 'Delete' | '') {
    try {
      if (strategy.title === '' || strategy.description === '') {
        return;
      }

      if (type === 'Add') {
        setIsLoading(true);
        const data = await Api.post('/strategy/add-strategy', strategy);
        console.log('strategy add:', data);
        if (data?.success) {
          setStrategies([...strategies, data.strategy]);
        }
      } else if (type === 'Edit') {
        if (
          strategy.title == selectedStrategy.title &&
          strategy.description == selectedStrategy.description &&
          strategy.status == selectedStrategy.status
        ) {
          onOpenChange();
          return;
        }
        setIsLoading(true);
        const data = await Api.post('/strategy/update-strategy', strategy);
        console.log('strategy add:', data);
        if (data?.success) {
          setStrategies((prev) =>
            prev.map((s) => {
              return s._id === data.strategy._id ? data.strategy : s;
            })
          );
        }
      }
      setIsLoading(false);
      onOpenChange();
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Unexpected Error',
      });
    }
  }

  return (
    <Dialog open={open === 'Add' || open === 'Edit'} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="Strategy Management">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            {open} Strategy
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loginNumber">Title</Label>
            <Input
              id="name"
              placeholder="Enter the title of strategy"
              value={strategy.title}
              onChange={(e) => setStrategy({ ...strategy, title: e.target.value })}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loginNumber">Description</Label>
            <Input
              id="name"
              placeholder="Enter the description of strategy"
              value={strategy.description}
              onChange={(e) => setStrategy({ ...strategy, description: e.target.value })}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="loginNumber">Status</Label>
            <Select value={strategy.status} onValueChange={(value) => setStrategy({ ...strategy, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="flex-1"
              onClick={() => onOpenChange()}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} className="flex-1" onClick={() => handleSubmit(open)}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {open === 'Add' ? 'Add New Strategy' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
