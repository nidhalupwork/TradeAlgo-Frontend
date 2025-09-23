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
import RiskManagementPage from './pages/RiskManagementPage';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { AuthContextProvider } from './providers/AuthProvider';
import { io } from 'socket.io-client';
import { SocketProvider } from './providers/SocketProvider';
import { AdminContextProvider } from './providers/AdminProvider';
import UserProfile from './components/admin/UserProfile';
import StrategyManagement from './components/admin/strategy/StrategyManagement';

const queryClient = new QueryClient();

const App = () => (
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

                <Route path="/user-management" element={<Admin />} />
                <Route path="/strategy-management" element={<StrategyManagement />} />
                <Route path="/users/:userId" element={<UserProfile />} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/strategies" element={<Strategies />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthContextProvider>
          </AdminContextProvider>
        </SocketProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
