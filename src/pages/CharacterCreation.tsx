import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CharacterAbilities from '../components/character/CharacterAbilities';
import CharacterPersonality from '../components/character/CharacterPersonality';

// API Base URL
const API_BASE_URL = "https://fateengine-server.onrender.com";

interface Ability {
  name: string;
  description: string;
  cooldown?: string;
  cost?: string;
}

interface CharacterData {
  id: string;
  worldId: string;
  name: string;
  race: string;
  role: string;
  description: string;
  background: string;
  traits: {
    appearance: string;
    personality: string;
    ideals: string;
    bonds: string;
    flaws: string;
  };
  stats: Array<{
    name: string;
    value: number;
  }>;
  abilities: Ability[];
  image: string;
}

const CharacterCreation = () => {
  const { worldId, characterId } = useParams<{ worldId: string; characterId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basics');
  
  // Character data state
  const [character, setCharacter] = useState<CharacterData>({
    id: characterId || `char_${Date.now()}`,
    worldId: worldId || '',
    name: '',
    race: '',
    role: '',
    description: '',
    background: '',
    traits: {
      appearance: '',
      personality: '',
      ideals: '',
      bonds: '',
      flaws: ''
    },
    stats: [
      { name: 'HP', value: 20 },
      { name: 'MP', value: 10 },
      { name: 'Phys Atk', value: 5 },
      { name: 'Phys Def', value: 5 },
      { name: 'Agility', value: 5 },
      { name: 'Mag Atk', value: 5 },
      { name: 'Mag Def', value: 5 },
      { name: 'Resist', value: 5 }
    ],
    abilities: [],
    image: ''
  });
  
  // If we have a characterId, load existing character data
  useEffect(() => {
    const loadCharacter = async () => {
      if (!characterId) return; // Skip if creating new character
      
      try {
        setIsLoading(true);
        const token = localStorage.getItem('fateToken');
        
        if (!token) {
          navigate('/');
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
          headers: {
            'Authorization': token
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load character');
        }
        
        const data = await response.json();
        setCharacter(data);
      } catch (error) {
        console.error('Error loading character:', error);
        toast({
          title: 'Error',
          description: 'Failed to load character data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCharacter();
  }, [characterId, navigate, toast]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // For nested properties like traits.appearance
      const [parent, child] = name.split('.');
      setCharacter(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setCharacter(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setCharacter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle stat changes
  const handleStatChange = (index: number, value: number) => {
    const newStats = [...character.stats];
    newStats[index] = { ...newStats[index], value };
    setCharacter(prev => ({
      ...prev,
      stats: newStats
    }));
  };
  
  // Save character
  const handleSave = async () => {
    if (!character.name.trim()) {
      toast({
        title: 'Missing name',
        description: 'Please give your character a name',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSaving(true);
      const token = localStorage.getItem('fateToken');
      
      if (!token) {
        navigate('/');
        return;
      }
      
      // Determine if we're creating or updating
      const method = characterId ? 'PUT' : 'POST';
      const url = characterId 
        ? `${API_BASE_URL}/characters/${characterId}` 
        : `${API_BASE_URL}/worlds/${worldId}/characters`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(character)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save character');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Success',
        description: `Character ${characterId ? 'updated' : 'created'} successfully`
      });
      
      // Navigate to the character view page
      navigate(`/worlds/${worldId}/characters/${data.id || characterId}`);
    } catch (error) {
      console.error('Error saving character:', error);
      toast({
        title: 'Error',
        description: 'Failed to save character',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>Loading character data...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">
          {characterId ? 'Edit Character' : 'Create Character'}
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/worlds/${worldId}`)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Character'}
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Name & Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Character Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={character.name} 
                onChange={handleChange} 
                placeholder="Enter character name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="race">Race</Label>
              <Select 
                value={character.race} 
                onValueChange={(value) => handleSelectChange(value, 'race')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select race" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Human">Human</SelectItem>
                  <SelectItem value="Elf">Elf</SelectItem>
                  <SelectItem value="Dwarf">Dwarf</SelectItem>
                  <SelectItem value="Orc">Orc</SelectItem>
                  <SelectItem value="Halfling">Halfling</SelectItem>
                  <SelectItem value="Gnome">Gnome</SelectItem>
                  <SelectItem value="Dragonborn">Dragonborn</SelectItem>
                  <SelectItem value="Tiefling">Tiefling</SelectItem>
                  <SelectItem value="Half-elf">Half-elf</SelectItem>
                  <SelectItem value="Half-orc">Half-orc</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={character.role} 
                onValueChange={(value) => handleSelectChange(value, 'role')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Warrior">Warrior</SelectItem>
                  <SelectItem value="Mage">Mage</SelectItem>
                  <SelectItem value="Rogue">Rogue</SelectItem>
                  <SelectItem value="Cleric">Cleric</SelectItem>
                  <SelectItem value="Ranger">Ranger</SelectItem>
                  <SelectItem value="Paladin">Paladin</SelectItem>
                  <SelectItem value="Bard">Bard</SelectItem>
                  <SelectItem value="Druid">Druid</SelectItem>
                  <SelectItem value="Monk">Monk</SelectItem>
                  <SelectItem value="Warlock">Warlock</SelectItem>
                  <SelectItem value="Sorcerer">Sorcerer</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={character.description} 
              onChange={handleChange} 
              placeholder="Brief description of your character"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background">Background</Label>
            <Textarea 
              id="background" 
              name="background" 
              value={character.background} 
              onChange={handleChange} 
              placeholder="Character's history and background story"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
          <TabsTrigger value="personality" className="flex-1">Personality</TabsTrigger>
          <TabsTrigger value="abilities" className="flex-1">Abilities & Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Character Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {character.stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`stat-${index}`}>{stat.name}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`stat-${index}`}
                        type="number"
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, parseInt(e.target.value) || 0)}
                        min={0}
                        max={100}
                        className="w-16"
                      />
                      <input
                        type="range"
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, parseInt(e.target.value))}
                        min={0}
                        max={100}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="personality">
          <CharacterPersonality 
            traits={character.traits}
            onChange={(name, value) => {
              setCharacter(prev => ({
                ...prev,
                traits: {
                  ...prev.traits,
                  [name]: value
                }
              }));
            }}
            personality={{ mbti: '', enneagram: '', alignment: '', traits: '' }}
            onSaveField={async () => {}}
          />
        </TabsContent>
        
        <TabsContent value="abilities">
          <CharacterAbilities 
            abilities={character.abilities} 
            onChange={(abilities) => {
              setCharacter(prev => ({
                ...prev,
                abilities
              }));
            }}
          />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default CharacterCreation;
