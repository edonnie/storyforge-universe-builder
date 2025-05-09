
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateWorldModal = ({ isOpen, onClose, onCreate }: CreateWorldModalProps) => {
  const [worldName, setWorldName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worldName.trim()) return;
    
    setIsLoading(true);
    
    // In the future, this will be integrated with Supabase
    setTimeout(() => {
      onCreate(worldName);
      setIsLoading(false);
      setWorldName('');
      onClose();
    }, 500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New World</DialogTitle>
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
