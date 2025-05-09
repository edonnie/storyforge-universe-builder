
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WorldCard from '../components/WorldCard';
import CreateWorldModal from '../components/CreateWorldModal';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, FileText, Users } from 'lucide-react';

// Mock data for worlds - will be replaced with Supabase data
const initialWorlds = [
  { id: '1', name: 'Eldoria', createdAt: '2023-05-15T12:00:00Z' },
  { id: '2', name: 'Mysthaven', createdAt: '2023-06-22T09:30:00Z' },
  { id: '3', name: 'Astralheim', createdAt: '2023-07-10T15:45:00Z' },
];

const Dashboard = () => {
  const [worlds, setWorlds] = useState(initialWorlds);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPro, setIsPro] = useState(false);
  
  // Check login and subscription status
  useEffect(() => {
    const hasSession = localStorage.getItem('fateengine_session') === 'true';
    const userIsPro = localStorage.getItem('fateengine_pro') === 'true';
    
    setIsLoggedIn(hasSession);
    setIsPro(userIsPro);
  }, []);
  
  // Filter worlds based on search term
  const filteredWorlds = worlds.filter(world => 
    world.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle world creation
  const handleCreateWorld = (name: string) => {
    const newWorld = {
      id: `${worlds.length + 1}`,
      name,
      createdAt: new Date().toISOString(),
    };
    setWorlds([...worlds, newWorld]);
  };
  
  // Mock stats - will be replaced with actual data from Supabase
  const stats = {
    totalWorlds: worlds.length,
    totalEntities: 24,
    subscriptionType: isPro ? 'Pro' : 'Free',
  };
  
  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Worlds */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Worlds</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={16} className="mr-2" /> New World
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search worlds..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {filteredWorlds.length > 0 ? (
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
            <div className="text-center py-12 bg-card rounded-lg">
              {searchTerm ? (
                <p className="text-muted-foreground">No worlds found matching "{searchTerm}"</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">You haven't created any worlds yet</p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={16} className="mr-2" /> Create Your First World
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Column - Stats & Actions */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="bg-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Usage Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Worlds</span>
                  <span className="font-medium">{stats.totalWorlds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Entities</span>
                  <span className="font-medium">{stats.totalEntities}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subscription</span>
                  <span className="font-medium">{stats.subscriptionType}</span>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full" variant="outline">
                    {isLoggedIn && isPro ? "Manage Billing" : "Upgrade to Pro"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Export Options</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" /> Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download size={16} className="mr-2" /> Export as Image
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Featured Templates</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Start with a pre-built world template
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users size={16} className="mr-2" /> Fantasy Kingdom
                </Button>
                <Button variant="outline" className="w-full justify-start">
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
