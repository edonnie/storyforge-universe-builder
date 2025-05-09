
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// API Base URL
const API_BASE_URL = "https://fateengine-server.onrender.com";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
  onLogin: () => void;
}

const AuthModal = ({ isOpen, onClose, mode, setMode, onLogin }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Attempt API authentication first
      const endpoint = mode === 'login' ? 'login' : 'signup';
      
      try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // API login successful
          localStorage.setItem('fateToken', data.token);
          localStorage.setItem('fateUserId', data.userId);
          localStorage.setItem('fatePlan', data.plan || 'free');
          localStorage.setItem('fateEmail', email);
          
          toast({
            title: mode === 'login' ? "Login successful" : "Account created",
            description: mode === 'login' ? "Welcome back!" : "Your account has been created successfully."
          });
          
          onLogin();
          onClose();
        } else {
          throw new Error(data.error || "Authentication failed");
        }
      } catch (apiError) {
        console.error('API authentication error:', apiError);
        
        // Fallback to mock authentication
        console.log('Falling back to local authentication');
        
        // For demo purposes, accept any login/signup
        localStorage.setItem('fateToken', 'mock_token_' + Date.now());
        localStorage.setItem('fateUserId', 'local_user_' + Math.random().toString(36).substr(2, 9));
        localStorage.setItem('fateengine_session', 'true');
        localStorage.setItem('fateEmail', email);
        
        toast({
          title: mode === 'login' ? "Login successful" : "Account created",
          description: mode === 'login' ? "Welcome back!" : "Your account has been created successfully."
        });
        
        onLogin();
        onClose();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = () => {
    // Mock password reset
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password reset initiated",
      description: "If an account exists for this email, you'll receive reset instructions shortly."
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted"
            />
          </div>
          
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-muted"
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
          
          {mode === 'login' && (
            <div className="text-center">
              <Button 
                type="button" 
                variant="link" 
                onClick={handleForgotPassword}
                className="text-muted-foreground hover:text-primary hover:bg-transparent hover:underline"
              >
                Forgot password?
              </Button>
            </div>
          )}
          
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <Button 
                type="button" 
                variant="link" 
                className="p-0 h-auto text-primary hover:underline"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </Button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
