import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Shield, ArrowLeft, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Api from '@/services/Api';
import { useAuth } from '@/providers/AuthProvider';
import { useSocket } from '@/providers/SocketProvider';
import { useAdmin } from '@/providers/AdminProvider';
import { useNavigate } from 'react-router-dom';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const { user, urlAccess, setUser, setUrlAccess } = useAuth();
  const { initializeSocket } = useSocket();
  const { setGlobalSetting, setStrategies, setUsers } = useAdmin();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!urlAccess) {
      window.history.back();
    }
    () => {
      setUrlAccess(false);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a 6-digit verification code',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await Api.post('/auth/2fa', { code: otp, email: user.email });
      if (data?.success) {
        if (data?.type === 'Forgot') {
          navigate('/reset-password');
        } else if (data?.type === 'Update Email') {
          navigate('/profile');
        } else {
          setUser(data.user);
          localStorage.setItem('isSignedIn', 'true');

          if (data.user.role === 'user') {
            const accountIds = data?.user?.accounts?.reduce((acc, cur) => {
              return [...acc, cur.accountId];
            }, []);

            initializeSocket(data.user._id, data.user.email, accountIds);
            navigate('/dashboard');
          } else {
            setUsers(data.users);
            setStrategies(data.strategies);
            setGlobalSetting(data.setting);
            navigate('/user-management');
          }
        }
      }
    } catch (error) {
      console.error('error:', error);
      toast({
        title: 'Verification failed',
        description: 'Invalid code. Please input the correct code or resend.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const data = await Api.post('/auth/resend', { email: user.email });
      console.log('Data for resending:', data);
      if (data?.success) {
        toast({
          title: 'Success',
          description: 'Successfully resent the code. Please check your email',
          variant: 'profit',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Resend error',
        description: 'Something went wrong. Please try again',
        variant: 'destructive',
      });
    }
    setResendLoading(false);
  };

  const handleBack = () => {
    // Navigate back to login or previous page
    window.history.back();
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center space-y-4'>
          <div className='flex justify-center'>
            <div className='p-3 rounded-full bg-primary/10'>
              <Shield className='h-8 w-8 text-primary' />
            </div>
          </div>
          <div>
            <CardTitle className='text-2xl font-bold'>Two-Factor Authentication</CardTitle>
            <CardDescription className='mt-2'>
              Enter the 6-digit verification code from your email address
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='otp' className='text-center block'>
                Verification Code
              </Label>
              <div className='flex justify-center'>
                <InputOTP maxLength={6} value={otp} onChange={setOtp} className='gap-2'>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className='border border-gray-600 border-r-0' />
                    <InputOTPSlot index={1} className='border border-gray-600 border-r-0' />
                    <InputOTPSlot index={2} className='border border-gray-600' />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className='border border-gray-600 border-r-0' />
                    <InputOTPSlot index={4} className='border border-gray-600 border-r-0' />
                    <InputOTPSlot index={5} className='border border-gray-600' />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button type='submit' className='w-full' disabled={isLoading || otp.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>

          <div className='flex flex-col space-y-4'>
            <div className='text-center text-sm text-muted-foreground'>Didn't receive a code?</div>

            <Button variant='outline' onClick={handleResend} disabled={resendLoading} className='w-full'>
              <RefreshCcw className={`h-4 w-4 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </Button>

            <Button variant='ghost' onClick={handleBack} className='w-full'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Login
            </Button>
          </div>

          {/* <div className='text-xs text-center text-muted-foreground space-y-1'>
            <p>Enter the code from your authenticator app</p>
            <p>(Google Authenticator, Authy, etc.)</p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuth;
