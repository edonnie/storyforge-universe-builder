
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createWorld } from "@/utils/worldUtils";

// API Base URL
const API_BASE_URL = "https://fateengine-server.onrender.com";

interface CreateWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, worldId: string) => void;
}

const CreateWorldModal = ({ isOpen, onClose, onCreate }: CreateWorldModalProps) => {
  const [worldName, setWorldName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worldName.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('fateToken');
      if (!token) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a world.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      let worldId = '';
      let success = false;
      
      try {
        // Try to create a new world through the API first
        console.log('Attempting to create world via API...');
        const response = await fetch(`${API_BASE_URL}/worlds`, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: worldName })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server returned ${response.status}`);
        }
        
        const data = await response.json();
        worldId = data.id;
        success = true;
        console.log('World created via API with ID:', worldId);
      } catch (apiError) {
        console.error('API error creating world:', apiError);
        
        // Fallback to local implementation
        try {
          console.log('Falling back to local world creation');
          const userId = localStorage.getItem('fateUserId') || 'local-user';
          const newWorld = await createWorld(userId, worldName);
          worldId = newWorld.id;
          // Save the world to localStorage for persistence
          const existingWorlds = JSON.parse(localStorage.getItem('fateWorlds') || '[]');
          existingWorlds.push(newWorld);
          localStorage.setItem('fateWorlds', JSON.stringify(existingWorlds));
          success = true;
          console.log('World created locally with ID:', worldId);
        } catch (localError) {
          console.error('Local fallback also failed:', localError);
          throw new Error('Could not create world through API or local fallback');
        }
      }
      
      if (success && worldId) {
        // Call the onCreate callback with both the name AND id (this was missing before)
        onCreate(worldName, worldId);
        
        toast({
          title: "World created",
          description: `"${worldName}" has been created successfully.`
        });
        
        // Close the modal
        setIsLoading(false);
        setWorldName('');
        onClose();
        
        // Save the world ID to ensure it's available for the WorldDetail page
        localStorage.setItem('lastCreatedWorldId', worldId);
        
        // Navigate to the newly created world detail page
        console.log('Navigating to world detail page with ID:', worldId);
        navigate(`/worlds/${worldId}`);
      } else {
        throw new Error('World creation succeeded but no ID was returned');
      }
    } catch (error) {
      console.error('Error creating world:', error);
      toast({
        title: "Failed to create world",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New World</DialogTitle>
          <DialogDescription>Give your world a name. You can add more details later.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="world-name">World Name</Label>
            <Input
              id="world-name"
              value={worldName}
              onChange={(e) => setWorldName(e.target.value)}
              placeholder="Enter a name for your world"
              className="bg-muted"
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !worldName.trim()}>
              {isLoading ? 'Creating...' : 'Create World'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorldModal;
