
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
  onCreate: (name: string) => void;
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
      } catch (apiError) {
        console.error('API error creating world:', apiError);
        
        // Fallback to local implementation
        try {
          console.log('Falling back to local world creation');
          const userId = 'local-user';
          const newWorld = await createWorld(userId, worldName);
          worldId = newWorld.id;
          success = true;
        } catch (localError) {
          console.error('Local fallback also failed:', localError);
          throw new Error('Could not create world through API or local fallback');
        }
      }
      
      if (success) {
        // Call the onCreate callback (which will update the UI)
        onCreate(worldName);
        
        toast({
          title: "World created",
          description: `"${worldName}" has been created successfully.`
        });
        
        // Close the modal
        setIsLoading(false);
        setWorldName('');
        onClose();
        
        // Navigate to the newly created world detail page
        navigate(`/worlds/${worldId}`);
      }
    } catch (error) {
      console.error('Error creating world:', error);
      toast({
        title: "Failed to create world",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
      setIsLoading(false);
      // Note: We don't close the modal on error so user can try again
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
