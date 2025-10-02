import { AuthForm } from '@/components/auth/AuthForm';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import authHeroImage from '@/assets/auth-hero.jpg';
import Navbar from '@/components/Navbar';

const Auth = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${authHeroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm w-screen"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Branding */}
            <div className="hidden lg:block space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Welcome to
                  </span>
                  <br />
                  <span className="text-foreground">TradeAlgo Pro</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                  Join thousands of users who trust us with their digital experience.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Secure & Private</h3>
                    <p className="text-muted-foreground text-sm">
                      Your data is protected with enterprise-grade security
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Easy to Use</h3>
                    <p className="text-muted-foreground text-sm">
                      Intuitive interface designed for seamless user experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">24/7 Support</h3>
                    <p className="text-muted-foreground text-sm">
                      Our team is here to help you whenever you need assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="flex items-center justify-center">
              <AuthForm />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-sm text-muted-foreground">© 2024 Your App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
