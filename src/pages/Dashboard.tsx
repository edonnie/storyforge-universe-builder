
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import WorldCard from '../components/WorldCard';
import CreateWorldModal from '../components/CreateWorldModal';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, FileText, Users, LayoutGrid } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { fetchWorlds } from "@/utils/worldUtils";

// API Base URL
const API_BASE_URL = "https://fateengine-server.onrender.com";

interface World {
  id: string;
  name: string;
  createdAt: string;
}

const Dashboard = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEntities, setTotalEntities] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'pro'>('free');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filter worlds based on search term
  const filteredWorlds = worlds.filter(world => 
    world.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Check authentication and load user data
  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('fateToken');
      
      if (!token) {
        // Redirect to landing page if not logged in
        navigate('/');
        return;
      }
      
      // Set subscription plan from localStorage
      const plan = localStorage.getItem('fatePlan');
      setSubscriptionPlan(plan === 'pro' ? 'pro' : 'free');
      
      try {
        setIsLoading(true);
        
        let worldsData: World[] = [];
        let entitiesCount = 0;
        
        try {
          // Try to load user data from backend first
          console.log('Attempting to load user data from API...');
          const response = await fetch(`${API_BASE_URL}/load`, {
            method: 'GET',
            headers: {
              'Authorization': token
            }
          });
          
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('fateToken');
            localStorage.removeItem('fatePlan');
            localStorage.removeItem('fateengine_session');
            localStorage.removeItem('fateengine_pro');
            navigate('/');
            return;
          }
          
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.content) {
            const content = JSON.parse(data.content);
            
            // Set worlds
            if (content.fateWorlds) {
              worldsData = content.fateWorlds;
            }
            
            // Set total entities
            if (content.fateProjects) {
              entitiesCount = content.fateProjects.length;
            }
          }
        } catch (apiError) {
          console.error('API error loading user data:', apiError);
          
          // Fallback to local data if API fails
          try {
            console.log('Falling back to local world data');
            const userId = localStorage.getItem('fateUserId') || 'local-user';
            worldsData = await fetchWorlds(userId);
            entitiesCount = 0;  // We don't have this info locally
          } catch (localError) {
            console.error('Local fallback also failed:', localError);
            throw new Error('Could not load worlds through API or local fallback');
          }
        }
        
        // Update state with whatever data we got
        setWorlds(worldsData);
        setTotalEntities(entitiesCount);
        
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: "Error loading data",
          description: "Failed to load your worlds. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate, toast]);
  
  // Handle world creation
  const handleCreateWorld = (name: string, worldId: string) => {
    // Add to local state for immediate feedback
    const newWorld = {
      id: worldId,
      name,
      createdAt: new Date().toISOString(),
    };
    
    setWorlds([...worlds, newWorld]);
    
    console.log('Added new world to state:', newWorld);
    
    toast({
      title: "World created",
      description: `${name} has been created successfully.`
    });
  };
  
  // Handle subscription management
  const handleSubscription = async () => {
    const token = localStorage.getItem('fateToken');
    
    if (!token) {
      toast({
        title: "Login required",
        description: "Please log in to manage your subscription.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      if (subscriptionPlan === 'pro') {
        // Open billing portal for existing subscribers
        const response = await fetch(`${API_BASE_URL}/billing-portal`, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to open billing portal');
        }
        
        const data = await response.json();
        
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No portal URL received');
        }
      } else {
        // Create checkout session for new subscribers
        const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to start checkout process');
        }
        
        const data = await response.json();
        
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL received');
        }
      }
    } catch (error) {
      console.error('Subscription action error:', error);
      toast({
        title: "Subscription error",
        description: "Unable to process your request. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Worlds */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">My Worlds</h1>
              <p className="text-muted-foreground">Create and manage your worldbuilding projects</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus size={16} className="mr-2" /> New World
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search worlds..."
              className="pl-10 bg-card border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-16 bg-card/50 rounded-lg border border-border/50 animate-pulse">
              <div className="space-y-3 text-center">
                <LayoutGrid size={32} className="mx-auto text-primary/50" />
                <p className="text-muted-foreground">Loading your worlds...</p>
              </div>
            </div>
          ) : filteredWorlds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredWorlds.map((world) => (
                <WorldCard
                  key={world.id}
                  id={world.id}
                  name={world.name}
                  createdAt={world.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-card/50 rounded-lg border border-border/50">
              {searchTerm ? (
                <div className="space-y-3 text-center">
                  <Search size={32} className="mx-auto text-muted-foreground/50" />
                  <p className="text-muted-foreground">No worlds found matching "<span className="font-medium">{searchTerm}</span>"</p>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <LayoutGrid size={32} className="mx-auto text-muted-foreground/50" />
                  <p className="text-muted-foreground">You haven't created any worlds yet</p>
                  <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                    <Plus size={16} className="mr-2" /> Create Your First World
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Column - Stats & Actions */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="bg-card/50 border border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-2" />
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Usage Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <LayoutGrid size={16} className="mr-2" /> Worlds
                  </span>
                  <span className="font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                    {worlds.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Users size={16} className="mr-2" /> Total Entities
                  </span>
                  <span className="font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                    {totalEntities}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subscription</span>
                  <span className={`font-medium capitalize px-2.5 py-0.5 rounded-full ${
                    subscriptionPlan === 'pro' 
                      ? 'bg-gradient-to-r from-[#00bbcc]/20 to-[#007788]/20 text-[#00bbcc]' 
                      : 'bg-muted/50 text-muted-foreground'
                  }`}>
                    {subscriptionPlan}
                  </span>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className={`w-full ${
                      subscriptionPlan === 'pro' 
                        ? 'border-[#00bbcc]/30 text-[#00bbcc] hover:border-[#00bbcc]/80 hover:bg-[#00bbcc]/10' 
                        : 'bg-gradient-to-r from-[#00bbcc] to-[#007788] hover:opacity-90 text-white border-none'
                    }`} 
                    variant={subscriptionPlan === 'pro' ? 'outline' : 'default'} 
                    onClick={handleSubscription}
                  >
                    {subscriptionPlan === 'pro' ? 'Manage Billing' : 'Upgrade to Pro'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent h-2" />
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Export Options</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-secondary/10 hover:border-secondary/50">
                  <FileText size={16} className="mr-2" /> Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-secondary/10 hover:border-secondary/50">
                  <Download size={16} className="mr-2" /> Export as Image
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent h-2" />
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Featured Templates</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Start with a pre-built world template
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-accent/10 hover:border-accent/50">
                  <Users size={16} className="mr-2" /> Fantasy Kingdom
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-accent/10 hover:border-accent/50">
                  <Users size={16} className="mr-2" /> Sci-Fi Colony
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <CreateWorldModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateWorld}
      />
    </Layout>
  );
};

export default Dashboard;
