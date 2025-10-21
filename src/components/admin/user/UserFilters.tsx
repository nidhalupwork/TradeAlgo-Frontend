import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserFiltersProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  roleFilter: 'user' | 'admin' | 'all';
  onRoleFilterChange: (value: 'user' | 'admin' | 'all') => void;
  statusFilter: 'active' | 'pending' | 'suspended' | 'deleted' | 'all';
  onStatusFilterChange: (value: 'active' | 'pending' | 'suspended' | 'deleted' | 'all') => void;
  planFilter: 'premium' | 'basic' | 'all';
  onPlanFilterChange: (value: 'premium' | 'basic' | 'all') => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  brokersMin: string;
  onBrokersMinChange: (value: string) => void;
  brokersMax: string;
  onBrokersMaxChange: (value: string) => void;
}

export const UserFilters = ({
  name,
  setName,
  email,
  setEmail,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  planFilter,
  onPlanFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  brokersMin,
  onBrokersMinChange,
  brokersMax,
  onBrokersMaxChange,
}: UserFiltersProps) => {
  const [tempName, setTempName] = useState<string>('');
  const [tempEmail, setTempEmail] = useState<string>('');

  useEffect(() => {
    setTempName(name);
    setTempEmail(email);
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={tempName}
            onChange={(e) => {
              setTempName(e.target.value);
              if (e.target.value === '') {
                setName('');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                console.log('Enter pressed, current name:', tempName);
                setName(tempName);
              }
            }}
            className="pl-10"
          />
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={tempEmail}
            onChange={(e) => {
              setTempEmail(e.target.value);
              if (e.target.value === '') {
                setEmail('');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                console.log('Enter pressed, current email:', tempEmail);
                setEmail(tempEmail);
              }
            }}
            className="pl-10"
          />
        </div>

        <div className="relative flex-1">
          <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Min accounts"
            value={brokersMin}
            onChange={(e) => onBrokersMinChange(e.target.value)}
            className="pl-10"
            min="0"
          />
        </div>

        <div className="relative flex-1">
          <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Max accounts"
            value={brokersMax}
            onChange={(e) => onBrokersMaxChange(e.target.value)}
            className="pl-10"
            min="0"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="date"
            placeholder="From date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="date"
            placeholder="To date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>

        <Select value={planFilter} onValueChange={onPlanFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
