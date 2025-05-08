import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import EditableField from '../components/EditableField';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash, Save, Send, Download, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { updateEntity } from '../utils/worldUtils';
import { exportAsPDF, exportAsImage } from '../utils/exportUtils';

// Define the ChatMessage type to ensure proper typing
type ChatMessageRole = "user" | "assistant";

interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

// Define the Character interface with nested fields
interface Character {
  id: string;
  name: string;
  race: string;
  jobs: string;
  role: string;
  parents: string;
  personality: {
    mbti: string;
    enneagram: string;
    alignment: string;
    traits: string;
  };
  bio: string;
  equipment: {
    weapon: string;
    armor: string;
  };
  style: string;
  stats: {
    hp: string;
    mp: string;
    physAttack: string;
    physDefense: string;
    agility: string;
    magicAttack: string;
    magicDefense: string;
    resist: string;
  };
  abilities: {
    mainAbility: string;
    signatureSkills: string;
    passives: string;
  };
  notes: string;
  relationships: string;
}

const CharacterCreation = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: "assistant", 
      content: 'Hello! I can help you create a character. What kind of character would you like to create?' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();
  
  // Character state with nested structure
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
  
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const newMessages = [
      ...chatMessages, 
      { role: "user" as const, content: inputMessage }
    ];
    setChatMessages(newMessages);
    
    // Clear input
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages([
        ...newMessages,
        {
          role: "assistant" as const,
          content: `That's a great idea! Let me suggest some details for your character based on that.

How about a character named Alaric Stormwind, a half-elven ranger with a mysterious past? He's known for his exceptional tracking abilities and has a deep connection with nature.

Personality: Stoic but compassionate, prefers solitude but fiercely loyal to allies.
Appearance: Tall with slight elven features, emerald eyes, and dark hair with a silver streak.
Background: Raised in the border forests by his human mother after his elven father disappeared on a dangerous mission.

Would you like me to elaborate on any of these aspects?`
        }
      ]);
      
      // Update character details as if AI suggested them
      setCharacter({
        ...character,
        name: character.name || 'Alaric Stormwind',
        race: character.race || 'Half-Elf',
        role: character.role || 'Ranger',
        personality: character.personality || 'Stoic but compassionate, prefers solitude but fiercely loyal to allies.',
        appearance: character.appearance || 'Tall with slight elven features, emerald eyes, and dark hair with a silver streak.',
        background: character.background || 'Raised in the border forests by his human mother after his elven father disappeared on a dangerous mission.'
      });
    }, 1000);
  };
  
  // Updated handleSaveField to support nested fields
  const handleSaveField = async (field: string, value: string): Promise<void> => {
    // Create a deep copy of the character object
    const updatedCharacter = JSON.parse(JSON.stringify(character));
    
    // Handle nested fields using dot notation (e.g., "personality.mbti")
    if (field.includes('.')) {
      const [section, subfield] = field.split('.');
      updatedCharacter[section][subfield] = value;
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
  
  const handleExport = async (type: 'pdf' | 'image') => {
    try {
      if (type === 'pdf') {
        await exportAsPDF('character-sheet', `${character.name || 'character'}`);
      } else {
        await exportAsImage('character-sheet', `${character.name || 'character'}`);
      }
      
      toast({
        title: "Export successful",
        description: `Character exported as ${type.toUpperCase()}`,
      });
    } catch (error) {
      console.error(`Failed to export as ${type}:`, error);
      toast({
        title: "Export failed",
        description: `Could not export character as ${type}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = `/worlds/${worldId}`}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to World
        </Button>
        <h1 className="text-3xl font-bold">Create New Character</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Chat Assistant */}
        <div>
          <Card className="bg-card mb-4">
            <CardHeader>
              <CardTitle>AI Character Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-y-auto mb-4 pr-2 space-y-4">
                {chatMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {message.content.split('\n').map((paragraph, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleMessageSubmit} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask for character suggestions..."
                  className="flex-grow"
                />
                <Button type="submit">
                  <Send size={16} />
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={() => setChatMessages([{ 
                role: "assistant", 
                content: 'Hello! I can help you create a character. What kind of character would you like to create?' 
              }])}>
              <Trash size={16} className="mr-2" /> Clear Chat
            </Button>
            <Button className="w-full" onClick={handleSaveCharacter}>
              <Save size={16} className="mr-2" /> Save Character
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={() => handleExport('pdf')}>
              <FileText size={16} className="mr-2" /> Export as PDF
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleExport('image')}>
              <Download size={16} className="mr-2" /> Export as Image
            </Button>
          </div>
        </div>
        
        {/* Right Column - Character Details */}
        <div className="space-y-4">
          <Card id="character-sheet" className="bg-card">
            <CardHeader>
              <CardTitle>Character Sheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 1. Name, Race, Jobs (3-column grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <EditableField
                    initialValue={character.name}
                    onSave={(value) => handleSaveField('name', value)}
                    placeholder="Character name"
                    className="p-2 rounded hover:bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Race</label>
                  <EditableField
                    initialValue={character.race}
                    onSave={(value) => handleSaveField('race', value)}
                    placeholder="Race/Species"
                    className="p-2 rounded hover:bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jobs</label>
                  <EditableField
                    initialValue={character.jobs}
                    onSave={(value) => handleSaveField('jobs', value)}
                    placeholder="Character jobs"
                    className="p-2 rounded hover:bg-muted/50"
                  />
                </div>
              </div>
              
              {/* 2. Role, Parents (2-column grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <EditableField
                    initialValue={character.role}
                    onSave={(value) => handleSaveField('role', value)}
                    placeholder="Class/Occupation"
                    className="p-2 rounded hover:bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parents</label>
                  <EditableField
                    initialValue={character.parents}
                    onSave={(value) => handleSaveField('parents', value)}
                    placeholder="Character's parents"
                    className="p-2 rounded hover:bg-muted/50"
                  />
                </div>
              </div>
              
              {/* 3. Personality Block */}
              <div className="space-y-4 bg-muted/10 p-4 rounded-md">
                <h3 className="text-md font-semibold">Personality</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">MBTI</label>
                    <EditableField
                      initialValue={character.personality.mbti}
                      onSave={(value) => handleSaveField('personality.mbti', value)}
                      placeholder="MBTI Type"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Enneagram</label>
                    <EditableField
                      initialValue={character.personality.enneagram}
                      onSave={(value) => handleSaveField('personality.enneagram', value)}
                      placeholder="Enneagram Type"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Alignment</label>
                    <EditableField
                      initialValue={character.personality.alignment}
                      onSave={(value) => handleSaveField('personality.alignment', value)}
                      placeholder="Character Alignment"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-3">
                    <label className="text-sm font-medium">Traits</label>
                    <EditableField
                      initialValue={character.personality.traits}
                      onSave={(value) => handleSaveField('personality.traits', value)}
                      placeholder="Personality traits"
                      className="p-2 rounded hover:bg-muted/50"
                      multiline
                    />
                  </div>
                </div>
              </div>
              
              {/* 4. Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Biography</label>
                <EditableField
                  initialValue={character.bio}
                  onSave={(value) => handleSaveField('bio', value)}
                  placeholder="Character's background story"
                  className="p-2 rounded hover:bg-muted/50"
                  multiline
                />
              </div>
              
              {/* 5. Equipment */}
              <div className="space-y-4 bg-muted/10 p-4 rounded-md">
                <h3 className="text-md font-semibold">Equipment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Weapon</label>
                    <EditableField
                      initialValue={character.equipment.weapon}
                      onSave={(value) => handleSaveField('equipment.weapon', value)}
                      placeholder="Character's weapons"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Armor</label>
                    <EditableField
                      initialValue={character.equipment.armor}
                      onSave={(value) => handleSaveField('equipment.armor', value)}
                      placeholder="Character's armor"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                </div>
              </div>
              
              {/* 6. Style */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <EditableField
                  initialValue={character.style}
                  onSave={(value) => handleSaveField('style', value)}
                  placeholder="Character's appearance and style"
                  className="p-2 rounded hover:bg-muted/50"
                  multiline
                />
              </div>
              
              {/* 7. Stats */}
              <div className="space-y-4 bg-muted/10 p-4 rounded-md">
                <h3 className="text-md font-semibold">Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">HP</label>
                    <EditableField
                      initialValue={character.stats.hp}
                      onSave={(value) => handleSaveField('stats.hp', value)}
                      placeholder="Hit Points"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">MP</label>
                    <EditableField
                      initialValue={character.stats.mp}
                      onSave={(value) => handleSaveField('stats.mp', value)}
                      placeholder="Magic Points"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phys Attack</label>
                    <EditableField
                      initialValue={character.stats.physAttack}
                      onSave={(value) => handleSaveField('stats.physAttack', value)}
                      placeholder="Physical Attack"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phys Defense</label>
                    <EditableField
                      initialValue={character.stats.physDefense}
                      onSave={(value) => handleSaveField('stats.physDefense', value)}
                      placeholder="Physical Defense"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Agility</label>
                    <EditableField
                      initialValue={character.stats.agility}
                      onSave={(value) => handleSaveField('stats.agility', value)}
                      placeholder="Agility"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Magic Attack</label>
                    <EditableField
                      initialValue={character.stats.magicAttack}
                      onSave={(value) => handleSaveField('stats.magicAttack', value)}
                      placeholder="Magic Attack"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Magic Defense</label>
                    <EditableField
                      initialValue={character.stats.magicDefense}
                      onSave={(value) => handleSaveField('stats.magicDefense', value)}
                      placeholder="Magic Defense"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resist</label>
                    <EditableField
                      initialValue={character.stats.resist}
                      onSave={(value) => handleSaveField('stats.resist', value)}
                      placeholder="Resistance"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                </div>
              </div>
              
              {/* 8. Abilities */}
              <div className="space-y-4 bg-muted/10 p-4 rounded-md">
                <h3 className="text-md font-semibold">Abilities</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Main Ability</label>
                    <EditableField
                      initialValue={character.abilities.mainAbility}
                      onSave={(value) => handleSaveField('abilities.mainAbility', value)}
                      placeholder="Character's main ability"
                      className="p-2 rounded hover:bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Signature Skills</label>
                    <EditableField
                      initialValue={character.abilities.signatureSkills}
                      onSave={(value) => handleSaveField('abilities.signatureSkills', value)}
                      placeholder="Character's signature skills"
                      className="p-2 rounded hover:bg-muted/50"
                      multiline
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Passives</label>
                    <EditableField
                      initialValue={character.abilities.passives}
                      onSave={(value) => handleSaveField('abilities.passives', value)}
                      placeholder="Character's passive abilities"
                      className="p-2 rounded hover:bg-muted/50"
                      multiline
                    />
                  </div>
                </div>
              </div>
              
              {/* 9. Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <EditableField
                  initialValue={character.notes}
                  onSave={(value) => handleSaveField('notes', value)}
                  placeholder="Additional notes about the character"
                  className="p-2 rounded hover:bg-muted/50"
                  multiline
                />
              </div>
              
              {/* 10. Relationships */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Relationships</label>
                <EditableField
                  initialValue={character.relationships}
                  onSave={(value) => handleSaveField('relationships', value)}
                  placeholder="Character's relationships with other characters"
                  className="p-2 rounded hover:bg-muted/50"
                  multiline
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CharacterCreation;
