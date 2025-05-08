
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    // This is a mock authentication function
    // In the future, this will be replaced with Supabase auth
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!email) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }
    
    // This is a mock password reset function
    // In the future, this will be replaced with Supabase auth
    setTimeout(() => {
      setIsLoading(false);
      setShowResetForm(false);
      setEmail('');
      // Show success message
      alert('Password reset email sent. Please check your inbox.');
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {showResetForm 
              ? 'Reset Password' 
              : mode === 'login' 
                ? 'Welcome Back' 
                : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/20 text-destructive p-3 rounded-md flex items-center space-x-2 mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        {showResetForm ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-muted"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowResetForm(false)}
              >
                Back to Login
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-muted"
              />
            </div>
            
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-muted"
                />
              </div>
            )}
            
            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === 'login' ? 'Logging In...' : 'Signing Up...'
                  : mode === 'login' ? 'Log In' : 'Sign Up'}
              </Button>
              
              {mode === 'login' && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowResetForm(true)}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </Button>
              )}
              
              <div className="text-center text-sm text-muted-foreground">
                {mode === 'login' 
                  ? "Don't have an account? " 
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary hover:underline"
                >
                  {mode === 'login' ? 'Sign Up' : 'Log In'}
                </button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
