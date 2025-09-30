import { useEffect, useState } from 'react';
import axios from 'axios';
import { replace, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import apiClient from '@/services/Api';
import { useSocket } from '@/providers/SocketProvider';
import { useAdmin } from '@/providers/AdminProvider';
import { useToast } from '@/hooks/use-toast';

export const AuthForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, user } = useAuth();
  const { setUsers, setStrategies, setGlobalSetting } = useAdmin();
  const { initializeSocket } = useSocket();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  const [personalData, setPersonalData] = useState<{
    fullName?: string;
    email: string;
    password: string;
    phoneNumber: string;
  }>({
    fullName: 'Nidhal Nouma',
    email: 'jamesharuki@gmail.com',
    phoneNumber: '',
    password: '123123',
  });

  useEffect(() => {
    const isSignedIn = localStorage.getItem('isSignedIn');

    if (isSignedIn) {
      navigate(-1);
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent, type: 'signin' | 'signup') => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'signin') {
        const data = await apiClient.post('/auth/sign-in', personalData);

        if (data.twoFA) {
          setUser({ ...user, email: personalData.email });
          navigate('/2fa');
        } else {
          setUser(data.user);
          localStorage.setItem('isSignedIn', 'true');

          const accountIds = data?.user?.accounts?.reduce((acc, cur) => {
            return [...acc, cur.accountId];
          }, []);

          if (data.user.role === 'user') {
            initializeSocket(data.user._id, accountIds);
            navigate('/dashboard');
          } else {
            setUsers(data.users);
            setStrategies(data.strategies);
            setGlobalSetting(data.setting);
            navigate('/user-management');
          }
        }
      } else {
        const data = await apiClient.post('/auth/register', personalData);
        if (data?.success) {
          setUser(data.user);
          navigate('/2fa');
        }
      }
    } catch (error) {
      console.error(`Error while ${type}:`, error);

      if (error?.status === 503) {
        toast({
          variant: 'destructive',
          title: 'Maintanence',
          description: error?.response?.data?.message ?? 'Unexpected error',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: error?.response?.data?.error?.email ?? 'Unexpected error',
        });
      }
    }
    setIsLoading(false);
  };

  function onPersonalDataChange(value: string, key: string) {
    setPersonalData({ ...personalData, [key]: value });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-auth-card/50 backdrop-blur-xl border-auth-border shadow-2xl">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as 'signin' | 'signup');
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="text-sm">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit(e, 'signin')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={personalData.email}
                      onChange={(e) => {
                        onPersonalDataChange(e.target.value, 'email');
                      }}
                      className="pl-10 bg-auth-bg/50 border-auth-border focus:border-primary transition-colors text-secondary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-auth-bg/50 border-auth-border focus:border-primary transition-colors text-secondary"
                      value={personalData.password}
                      onChange={(e) => onPersonalDataChange(e.target.value, 'password')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 font-medium"
                  onClick={(e) => handleSubmit(e, 'signin')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 bg-auth-bg/50 border-auth-border focus:border-primary transition-colors text-secondary"
                      value={personalData.fullName}
                      onChange={(e) => onPersonalDataChange(e.target.value, 'fullName')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-auth-bg/50 border-auth-border focus:border-primary transition-colors text-secondary"
                      value={personalData.email}
                      onChange={(e) => onPersonalDataChange(e.target.value, 'email')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-phone"
                      type="text"
                      placeholder="Enter your phone number"
                      className="pl-10 bg-auth-bg/50 border-auth-border focus:border-primary transition-colors text-secondary"
                      value={personalData.phoneNumber}
                      onChange={(e) => onPersonalDataChange(e.target.value, 'phoneNumber')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="pl-10 pr-10 bg-auth-bg/50 border-auth-border focus:border-primary transition-colors text-secondary"
                      value={personalData.password}
                      onChange={(e) => onPersonalDataChange(e.target.value, 'password')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 font-medium"
                  disabled={isLoading}
                  onClick={(e) => handleSubmit(e, 'signup')}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">Protected by enterprise-grade security</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
