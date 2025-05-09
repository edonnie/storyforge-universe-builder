
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Try to fetch user data or use local data as fallback
    const loadUserData = async () => {
      try {
        // Get username from localStorage if available
        const storedUsername = localStorage.getItem('fateUsername') || '';
        const storedEmail = localStorage.getItem('fateEmail') || '';
        
        // Try getting from backend if we have a token
        const token = localStorage.getItem('fateToken');
        if (token) {
          try {
            const response = await fetch('https://fateengine-server.onrender.com/user', {
              headers: {
                'Authorization': token
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUsername(userData.username || storedUsername);
              setEmail(userData.email || storedEmail);
              
              // Update localStorage
              if (userData.username) localStorage.setItem('fateUsername', userData.username);
              if (userData.email) localStorage.setItem('fateEmail', userData.email);
            } else {
              setUsername(storedUsername);
              setEmail(storedEmail);
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error);
            setUsername(storedUsername);
            setEmail(storedEmail);
          }
        } else {
          setUsername(storedUsername);
          setEmail(storedEmail);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved."
      });
      
      // Store locally
      localStorage.setItem('fateUsername', username);
      localStorage.setItem('fateEmail', email);
      
      // Try to update on backend if we have a token
      const token = localStorage.getItem('fateToken');
      if (token) {
        try {
          const response = await fetch('https://fateengine-server.onrender.com/user', {
            method: 'PUT',
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username,
              email
            })
          });
          
          if (!response.ok) {
            console.log('API update failed, data saved locally only');
          }
        } catch (error) {
          console.error('API update error:', error);
        }
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not save your profile. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8">Your Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading your profile information...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full">
                Notification Settings
              </Button>
              
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
