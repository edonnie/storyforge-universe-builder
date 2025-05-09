
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Trash } from 'lucide-react';

interface WorldCardActionsProps {
  id: string;
  name: string;
  onDelete: () => void;
}

const WorldCardActions = ({ id, name, onDelete }: WorldCardActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      // Try to delete from API first
      const token = localStorage.getItem('fateToken');
      if (token) {
        try {
          const response = await fetch(`https://fateengine-server.onrender.com/worlds/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': token
            }
          });
          
          if (!response.ok) {
            console.log('API delete failed, falling back to local delete');
          }
        } catch (error) {
          console.error('API delete error:', error);
        }
      }
      
      // Local deletion as fallback
      const existingWorlds = JSON.parse(localStorage.getItem('fateWorlds') || '[]');
      const updatedWorlds = existingWorlds.filter((world: any) => world.id !== id);
      localStorage.setItem('fateWorlds', JSON.stringify(updatedWorlds));
      
      toast({
        title: "World deleted",
        description: `"${name}" has been deleted successfully.`
      });
      
      onDelete();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting world:', error);
      toast({
        title: "Failed to delete world",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
    
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="More options">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover border border-border">
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete World
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the world
              &quot;{name}&quot; and all of its associated content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WorldCardActions;
