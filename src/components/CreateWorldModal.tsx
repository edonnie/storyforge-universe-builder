
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worldName.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('fateToken');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Create a new world through the API
      const response = await fetch(`${API_BASE_URL}/worlds`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: worldName })
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      const worldId = data.id;
      
      // Call the onCreate callback (which will update the UI)
      onCreate(worldName);
      
      // Close the modal
      setIsLoading(false);
      setWorldName('');
      onClose();
      
      // Navigate to the newly created world detail page
      navigate(`/worlds/${worldId}`);
    } catch (error) {
      console.error('Error creating world:', error);
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
            <Button type="submit" disabled={isLoading || !worldName.trim()} loading={isLoading}>
              {isLoading ? 'Creating...' : 'Create World'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorldModal;
