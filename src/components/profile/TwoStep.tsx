import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Smartphone } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Api from '@/services/Api';
import { useToast } from '@/hooks/use-toast';

export const TwoStep = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  async function change2FA() {
    try {
      const data = await Api.post('/users/2fa');
      console.log('data:', data);
      if (data?.success) {
        setUser(data.user);
        toast({
          title: 'Success',
          description: 'Successfully updated 2fa configuration',
          variant: 'profit',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Failed to update 2fa configuration',
        variant: 'destructive',
      });
    }
  }
  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>Add an extra layer of security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable 2FA</Label>
            <p className="text-sm text-muted-foreground">Will send the OTP to your email connected to platform</p>
          </div>
          <Switch checked={user?.twoFA || false} onCheckedChange={() => change2FA()} />
        </div>
        {/* <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">SMS Backup</Label>
            <p className="text-sm text-muted-foreground">Backup 2FA via SMS</p>
          </div>
          <Switch />
        </div>
        <Button variant="outline" className="w-full">
          Setup Authenticator
        </Button> */}
      </CardContent>
    </Card>
  );
};
