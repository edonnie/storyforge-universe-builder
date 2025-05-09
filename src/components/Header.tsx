
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import AuthModal from './AuthModal';
import { useToast } from "@/hooks/use-toast";

// API Base URL
const API_BASE_URL = "https://fateengine-server.onrender.com";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'pro'>('free');
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const openLoginModal = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };
  
  const openSignupModal = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  // Check auth and subscription status
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('fateToken');
      const plan = localStorage.getItem('fatePlan');
      
      if (token) {
        setIsLoggedIn(true);
        setSubscriptionPlan(plan === 'pro' ? 'pro' : 'free');
        
        // Update localStorage for compatibility
        localStorage.setItem('fateengine_session', 'true');
        localStorage.setItem('fateengine_pro', plan === 'pro' ? 'true' : 'false');
      } else {
        setIsLoggedIn(false);
        setSubscriptionPlan('free');
      }
    };
    
    checkAuthStatus();
    
    // Set up interval to check auth status periodically
    const interval = setInterval(checkAuthStatus, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  // Login function with backend integration
  const handleLogin = () => {
    // This is just to acknowledge successful login
    // The actual token storage happens in AuthModal
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    
    // Check the plan from localStorage
    const plan = localStorage.getItem('fatePlan');
    setSubscriptionPlan(plan === 'pro' ? 'pro' : 'free');
    
    // Redirect to dashboard after successful login
    navigate('/dashboard');
    
    toast({
      title: "Login successful",
      description: "Welcome back to FateEngine!",
    });
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('fateToken');
    localStorage.removeItem('fatePlan');
    localStorage.removeItem('fateengine_session');
    localStorage.removeItem('fateengine_pro');
    
    setIsLoggedIn(false);
    setSubscriptionPlan('free');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    
    navigate('/');
  };

  return (
    <header className="w-full bg-background border-b border-muted sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gradient">FateEngine</span>
            {isLoggedIn && subscriptionPlan === 'pro' && (
              <Badge 
                className="ml-2 text-[0.7rem] font-bold px-2 py-0.5 bg-gradient-to-r from-[#00bbcc] to-[#007788] border-none"
              >
                PRO
              </Badge>
            )}
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/plans">
                <Button variant="ghost">Plans</Button>
              </Link>
              <Link to="/support">
                <Button variant="ghost">Support</Button>
              </Link>
              <div className="relative group">
                <Button variant="ghost" className="rounded-full p-2">
                  <User size={20} />
                </Button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-muted">
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-muted"
                  >
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={openLoginModal}>Log In</Button>
              <Button onClick={openSignupModal}>Sign Up</Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-foreground">
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-muted animate-fade-in">
          <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Link to="/plans" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">Plans</Button>
                </Link>
                <Link to="/support" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">Support</Button>
                </Link>
                <Link to="/profile" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">Profile</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    openLoginModal();
                    toggleMenu();
                  }}
                >
                  Log In
                </Button>
                <Button 
                  className="w-full justify-start"
                  onClick={() => {
                    openSignupModal();
                    toggleMenu();
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onLogin={handleLogin}
      />
    </header>
  );
};

export default Header;
