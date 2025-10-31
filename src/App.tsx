import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Strategies from './pages/Strategies';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { AuthContextProvider } from './providers/AuthProvider';
import { SocketProvider } from './providers/SocketProvider';
import { AdminContextProvider } from './providers/AdminProvider';
import UserProfile from './components/admin/user/UserProfile';
import StrategyManagement from './components/admin/strategy/StrategyManagement';
import TwoFactorAuth from './components/auth/TwoFactorAuth';
import './App.css';
import ResetPassword from './pages/ResetPassword';
import Logs from './components/admin/Logs';
import AdminDashboard from './pages/AdminDashboard';
import Announce from './pages/Announce';
import Tutorials from './pages/Tutorials';
import TutorialsManagement from './pages/TutorialsManagement';
import TutorialDetail from './pages/TutorialDetail';
import ImageUpload from './pages/ImageUpload';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SocketProvider>
            <AdminContextProvider>
              <AuthContextProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/2fa" element={<TwoFactorAuth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  <Route path="/user-management" element={<Admin />} />
                  <Route path="/strategy-management" element={<StrategyManagement />} />
                  <Route path="/users/:userId" element={<UserProfile />} />
                  <Route path="/control" element={<AdminDashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/strategies" element={<Strategies />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/announcement" element={<Announce />} />
                  <Route path="/tutorials" element={<Tutorials />} />
                  <Route path="/tutorial-management" element={<TutorialsManagement />} />
                  <Route path="/tutorials/:tutorialId" element={<TutorialDetail />} />
                  <Route path="/image-upload" element={<ImageUpload />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthContextProvider>
            </AdminContextProvider>
          </SocketProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
