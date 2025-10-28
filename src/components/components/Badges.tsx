import { Ban, CheckCircle, Circle, Crown, Headphones, Loader, Shield, ShieldCheck, Trash2, User } from 'lucide-react';
import { Badge } from '../ui/badge';
import { UserRole } from '@/lib/types';

export const StatusBadge = ({ variant }: { variant: 'active' | 'pending' | 'suspended' | 'deleted' | '' }) => {
  switch (variant) {
    case 'active':
      return (
        <Badge className="bg-profit/20 text-profit border-profit/40">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-gold/20 text-gold border-gold/40">
          <Loader className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case 'suspended':
      return (
        <Badge className="bg-loss/20 text-loss border-loss/40">
          <Ban className="h-3 w-3 mr-1" />
          Suspended
        </Badge>
      );
    case 'deleted':
      return (
        <Badge className="bg-destructive/20 text-destructive border-destructive/40">
          <Trash2 className="h-3 w-3 mr-1" />
          Deleted
        </Badge>
      );
    default:
      return <Badge variant="secondary">{variant}</Badge>;
  }
};

export const TierBadge = ({ variant }: { variant: 'basic' | 'premium' | '' }) => {
  switch (variant) {
    case 'premium':
      return (
        <Badge className="bg-profit/20 text-profit border-profit/40">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      );
    case 'basic':
      return (
        <Badge className="bg-gold/20 text-gold border-gold/40">
          <Circle className="h-3 w-3 mr-1" />
          Basic
        </Badge>
      );
    default:
      return <Badge variant="secondary">{variant}</Badge>;
  }
};

export const RoleBadge = ({ role }: { role: UserRole }) => {
  switch (role) {
    case 'owner':
      return (
        <Badge className="bg-purple-600/20 text-purple-600 border-purple-600/40">
          <ShieldCheck className="h-3 w-3 mr-1" />
          Owner
        </Badge>
      );
    case 'admin':
      return (
        <Badge className="bg-primary/20 text-primary border-primary/40">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    case 'support':
      return (
        <Badge className="bg-profit/20 text-profit border-profit/40">
          <Headphones className="h-3 w-3 mr-1" />
          Support
        </Badge>
      );
    case 'user':
      return (
        <Badge className="bg-muted text-muted-foreground border-border">
          <User className="h-3 w-3 mr-1" />
          User
        </Badge>
      );
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
};
