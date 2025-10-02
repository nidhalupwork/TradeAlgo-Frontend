import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Api from '@/services/Api';
import { useToast } from '@/hooks/use-toast';
// import { Switch } from '../ui/switch';

export const PersonalInfo = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [password, setPassword] = useState({
    last: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    const [first, last] = user ? user?.fullName.split(' ') : ['', ''];

    setPersonalInfo({
      firstName: first,
      lastName: last,
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
  }, [user]);

  async function updatePassword() {
    try {
      const data = await Api.post('/users/update-password', password);
      if (data?.success) {
        setPassword({ last: '', new: '', confirm: '' });
        toast({
          title: 'Password updated',
          description: `Account password has been successfully updated`,
          variant: 'profit',
        });
      }
    } catch (error) {
      console.error('Error in updating password:', error);
      toast({
        title: 'Password update failed',
        duration: 2000,
        variant: 'destructive',
        description: error.response.data.message ?? `Unexpected error`,
      });
    }
  }

  async function saveChanges() {
    try {
      const data = await Api.post('/users/update-profile', personalInfo);
      if (data?.success) {
        setUser({
          ...user,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
      }
    } catch (error) {
      console.error('Error in saving changes:', error);
      toast({
        title: 'Profile update failed',
        description: error?.response?.data?.message ?? 'Unexpected error',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Update Password</CardTitle>
        {/* <CardTitle className="text-xl">Personal Information</CardTitle> */}
        {/* <Button
          variant={isEditing ? 'outline' : 'ghost'}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4" />
              Edit
            </>
          )}
        </Button> */}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* First name and last name */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={personalInfo?.firstName || ''}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
              onChange={(e) => {
                setPersonalInfo({ ...personalInfo, firstName: e.target.value });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={personalInfo?.lastName || ''}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
              onChange={(e) => {
                setPersonalInfo({ ...personalInfo, lastName: e.target.value });
              }}
            />
          </div>
        </div> */}

        {/* Email and phone number */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
              onChange={(e) => {
                setPersonalInfo({ ...personalInfo, email: e.target.value });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Phone Number</Label>
            <Input
              id="phone"
              type="text"
              value={personalInfo.phoneNumber}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
              onChange={(e) => {
                setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value });
              }}
            />
          </div>
        </div> */}

        {/* Phone number and timezone */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              defaultValue="+1 (555) 123-4567"
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select disabled={!isEditing}>
              <SelectTrigger className={!isEditing ? 'bg-muted' : ''}>
                <SelectValue placeholder="UTC-5 (EST)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc-8">UTC-8 (PST)</SelectItem>
                <SelectItem value="utc-5">UTC-5 (EST)</SelectItem>
                <SelectItem value="utc+0">UTC+0 (GMT)</SelectItem>
                <SelectItem value="utc+1">UTC+1 (CET)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div> */}

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <Button className="gap-2" onClick={saveChanges}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Previous Password */}
        <div className="space-y-2 border-t-2 pt-2">
          <Label htmlFor="lastPassword">Last Password</Label>
          <Input
            id="past password"
            type="password"
            value={password.last}
            onChange={(e) => {
              setPassword({ ...password, last: e.target.value });
            }}
          />
        </div>

        {/* New and Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="new password"
              type="password"
              value={password.new}
              onChange={(e) => {
                setPassword({ ...password, new: e.target.value });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirm password"
              type="password"
              value={password.confirm}
              onChange={(e) => {
                setPassword({ ...password, confirm: e.target.value });
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button className="gap-2" onClick={() => updatePassword()}>
            <Save className="h-4 w-4" />
            Update Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
