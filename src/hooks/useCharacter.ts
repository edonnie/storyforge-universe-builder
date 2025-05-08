
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Character } from '../components/character/CharacterSheet';
import { updateEntity } from '../utils/worldUtils';

// API base URL
const API_BASE_URL = "https://fateengine-server.onrender.com";

export const useCharacter = (worldId: string | undefined) => {
  const [character, setCharacter] = useState<Character>({
    id: '',
    name: '',
    race: '',
    jobs: '',
    role: '',
    parents: '',
    personality: {
      mbti: '',
      enneagram: '',
      alignment: '',
      traits: '',
    },
    bio: '',
    equipment: {
      weapon: '',
      armor: '',
    },
    style: '',
    stats: {
      hp: '',
      mp: '',
      physAttack: '',
      physDefense: '',
      agility: '',
      magicAttack: '',
      magicDefense: '',
      resist: '',
    },
    abilities: {
      mainAbility: '',
      signatureSkills: '',
      passives: '',
    },
    notes: '',
    relationships: '',
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Load character data from API or localStorage
    const loadCharacter = async () => {
      try {
        // Try to get the authentication token
        const token = localStorage.getItem('fateToken');
        const projectId = localStorage.getItem('currentProjectId');
        
        if (!token || !projectId) {
          // If no token or project ID, use initial empty character
          return;
        }
        
        // Get character data from the server
        const response = await fetch(`${API_BASE_URL}/load`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ projectId })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.characterData) {
            setCharacter(data.characterData);
          }
        }
      } catch (error) {
        console.error('Error loading character data:', error);
      }
    };
    
    loadCharacter();
  }, [worldId]);

  // Function to handle saving fields
  const handleSaveField = async (field: string, value: string): Promise<void> => {
    // Create a deep copy of the character object
    const updatedCharacter = JSON.parse(JSON.stringify(character));
    
    // Handle nested fields using dot notation (e.g., "personality.mbti")
    if (field.includes('.')) {
      const [section, subfield] = field.split('.');
      if (updatedCharacter[section] && typeof updatedCharacter[section] === 'object') {
        updatedCharacter[section][subfield] = value;
      }
    } else {
      updatedCharacter[field] = value;
    }
    
    // Update local state
    setCharacter(updatedCharacter);
    
    // In a real app, this would update the character in Supabase
    if (worldId && character.id) {
      try {
        await updateEntity(character.id, worldId, {
          details: updatedCharacter
        });
      } catch (error) {
        console.error(`Failed to update ${field}:`, error);
        throw error;
      }
    }
  };

  const handleSaveCharacter = async () => {
    try {
      // Get the authentication token and project ID
      const token = localStorage.getItem('fateToken');
      const projectId = localStorage.getItem('currentProjectId');
      
      if (!token || !projectId) {
        toast({
          title: "Authentication error",
          description: "Could not save character. Please log in again.",
          variant: "destructive"
        });
        return;
      }
      
      // Save character to the server
      const response = await fetch(`${API_BASE_URL}/save`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          projectId,
          characterData: character
        })
      });
      
      if (response.ok) {
        toast({
          title: "Character saved",
          description: "Your character has been saved successfully",
        });
      } else {
        toast({
          title: "Save failed",
          description: "Failed to save character. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving character:', error);
      toast({
        title: "Save error",
        description: "An error occurred while saving your character.",
        variant: "destructive"
      });
    }
  };

  return {
    character,
    handleSaveField,
    handleSaveCharacter,
    setCharacter
  };
};
