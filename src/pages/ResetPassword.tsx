import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Shield, ArrowLeft, RefreshCcw, Lock, EyeOff, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Api from '@/services/Api';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { user, urlAccess, setUser, setUrlAccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    if (password.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Password is required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await Api.post('/auth/reset-password', { password, email: user.email });
      if (data?.success) {
        navigate('/auth');
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
            <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
            <CardDescription className='mt-2'>Enter the strong password</CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='signup-password' className='text-sm font-medium'>
                Password
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='signup-password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Create a password'
                  className='pl-10 pr-10 bg-auth-bg/50 border-auth-border focus:border-primary transition-colors text-secondary'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-muted-foreground/50 transition-colors'
                >
                  {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
            </div>

            <Button type='submit' className='w-full' disabled={isLoading || password.length === 0}>
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>

          <div className='flex flex-col space-y-4'>
            <Button variant='ghost' onClick={() => navigate('/auth')} className='w-full'>
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

export default ResetPassword;
