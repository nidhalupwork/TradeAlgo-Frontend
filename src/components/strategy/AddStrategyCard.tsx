import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddStrategyCardProps {
  onClick: () => void;
  disabled?: boolean;
}

export const AddStrategyCard = ({ onClick, disabled = false }: AddStrategyCardProps) => {
  return (
    <Card
      onClick={disabled ? undefined : onClick}
      className={`group transition-[var(--transition-smooth)] border-dashed border-2 ${
        disabled
          ? 'border-border bg-muted/20 cursor-not-allowed opacity-60'
          : 'border-border hover:border-primary cursor-pointer bg-muted/30 hover:bg-muted/50 hover:shadow-[var(--shadow-card-hover)]'
      }`}
    >
      <CardContent className="flex flex-col items-center justify-center h-full min-h-[189px] p-6">
        <div
          className={`rounded-full p-4 mb-4 transition-[var(--transition-smooth)] ${
            disabled ? 'bg-muted/50' : 'bg-primary/10 group-hover:bg-primary/20'
          }`}
        >
          <Plus className={`h-8 w-8 ${disabled ? 'text-muted-foreground' : 'text-primary'}`} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Add Strategy</h3>
        <p className="text-sm text-muted-foreground text-center">
          {disabled ? 'Upgrade to Premium to add custom strategies' : 'Create a new custom trading strategy'}
        </p>
      </CardContent>
    </Card>
  );
};
