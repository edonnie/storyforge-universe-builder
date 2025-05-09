
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resetStepTwo, setResetStepTwo] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      if (mode === 'login') {
        // Login
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.status === 200 && data.token) {
          // Store token and plan
          localStorage.setItem('fateToken', data.token);
          localStorage.setItem('fatePlan', data.plan || 'free');
          localStorage.setItem('fateengine_session', 'true');
          localStorage.setItem('fateengine_pro', data.plan === 'pro' ? 'true' : 'false');
          
          // Reset form
          setEmail('');
          setPassword('');
          
          // Close modal and notify parent
          onLogin();
          
          toast({
            title: "Login successful",
            description: "Welcome to FateEngine!",
          });
        } else if (response.status === 403) {
          setError('Please verify your email before logging in.');
        } else if (response.status === 401) {
          setError('Invalid credentials.');
        } else {
          setError(data.error || 'An error occurred during login.');
        }
      } else {
        // Register
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.status === 200) {
          toast({
            title: "Registration successful",
            description: "A verification code has been sent to your email.",
          });
          setShowVerificationForm(true);
        } else {
          setError(data.error || 'An error occurred during registration.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!email) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      // Check if the response is valid JSON before parsing
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned an invalid response");
      }
      
      if (response.ok) {
        toast({
          title: "Reset code sent",
          description: "Check your email for the password reset code.",
        });
        // Show the code entry form
        setResetStepTwo(true);
      } else {
        setError(data?.error || 'Failed to send reset code. Please try again.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!email || !verificationCode) {
      setError('Please enter your email and verification code');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code: verificationCode })
      });
      
      // Handle possible non-JSON response
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned an invalid response");
      }
      
      if (response.ok) {
        toast({
          title: "Email verified",
          description: "Your account has been verified. You can now log in.",
        });
        setShowVerificationForm(false);
        setMode('login');
      } else {
        setError(data?.error || 'Invalid verification code.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!email || !resetCode || !newPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code: resetCode, newPassword })
      });
      
      // Handle possible non-JSON response
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned an invalid response");
      }
      
      if (response.ok) {
        toast({
          title: "Password updated",
          description: "Your password has been reset. You can now log in.",
        });
        setShowResetForm(false);
        setResetCode('');
        setNewPassword('');
        setResetStepTwo(false);
        setMode('login');
      } else {
        setError(data?.error || 'Invalid reset code or password.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setResetCode('');
    setNewPassword('');
    setError(null);
    setShowResetForm(false);
    setShowVerificationForm(false);
    setResetStepTwo(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
      }
      onClose();
    }}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {showResetForm 
              ? resetStepTwo ? 'Enter Reset Code' : 'Reset Password' 
              : showVerificationForm
                ? mode === 'signup' ? 'Verify Your Email' : 'Reset Your Password'
                : mode === 'login' 
                  ? 'Welcome Back' 
                  : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {showResetForm 
              ? resetStepTwo
                ? 'Enter the code sent to your email and your new password'
                : 'Enter your email to receive a password reset code'
              : showVerificationForm
                ? 'Enter the verification code sent to your email'
                : mode === 'login'
                  ? 'Log in to access your worlds and characters'
                  : 'Create a new account to start building your worlds'
            }
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/20 text-destructive p-3 rounded-md flex items-center space-x-2 mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        {showVerificationForm && mode === 'signup' ? (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verify-email">Email</Label>
              <Input
                id="verify-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code sent to your email"
                className="bg-muted"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowVerificationForm(false)}
              >
                Back to Sign Up
              </Button>
            </div>
          </form>
        ) : showResetForm && !resetStepTwo ? (
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
              <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? 'Sending...' : 'Send Reset Code'}
                <Mail size={16} />
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
        ) : showResetForm && resetStepTwo ? (
          <form onSubmit={handleResetWithCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-code">Reset Code</Label>
              <Input
                id="reset-code"
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Enter code sent to your email"
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-muted"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setResetStepTwo(false)}
              >
                Back to Previous Step
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
