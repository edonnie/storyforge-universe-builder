
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Character } from '../components/character/CharacterSheet';
import { updateEntity } from '../utils/worldUtils';

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
    // In a real implementation, we would fetch the character data if editing an existing character
    // For now, we'll use mock data
    setCharacter({
      id: `char_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Alaric Stormwind',
      race: 'Half-Elf',
      jobs: 'Scout, Hunter',
      role: 'Ranger',
      parents: 'Elara (Human), Thranduil (Elf)',
      personality: {
        mbti: 'ISTP',
        enneagram: '5w4',
        alignment: 'Neutral Good',
        traits: 'Stoic, Observant, Independent, Resourceful, Cautious',
      },
      bio: 'Raised in the border forests by his human mother after his elven father disappeared on a dangerous mission. Alaric learned to survive in the wilderness from an early age.',
      equipment: {
        weapon: 'Windwhisper Bow (Enchanted Longbow)',
        armor: 'Forest Warden Leathers',
      },
      style: 'Prefers earthy tones and practical clothing. His cloak is adorned with feathers from various birds he has encountered.',
      stats: {
        hp: '75',
        mp: '45',
        physAttack: '68',
        physDefense: '55',
        agility: '80',
        magicAttack: '40',
        magicDefense: '50',
        resist: '60',
      },
      abilities: {
        mainAbility: 'Nature\'s Sentinel',
        signatureSkills: 'Precise Shot, Shadow Step, Beast Speech, Trailblazing',
        passives: 'Keen Senses, Forest Affinity, Elven Grace',
      },
      notes: 'Carries a journal filled with sketches of plants and animals. Has a small scar above his right eyebrow from a childhood accident.',
      relationships: "Mentored by an old human ranger named Harlon. Rivalry with Thorne Ironheart, a dwarf who blames elves for his clan's misfortune.",
    });
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

  const handleSaveCharacter = () => {
    // This will be integrated with Supabase in the future
    toast({
      title: "Character saved",
      description: "Your character has been saved successfully",
    });
  };

  return {
    character,
    handleSaveField,
    handleSaveCharacter,
  };
};
