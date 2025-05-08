
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import EditableField from '../components/EditableField';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Save, Send, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { updateEntity } from '../utils/worldUtils';

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

Would you like me to elaborate on any of these aspects?`
        }
      ]);
      
      // Update character details based on AI suggestion
      // No need to override existing values
      setCharacter(prev => ({
        ...prev,
        name: prev.name || 'Alaric Stormwind',
        race: prev.race || 'Half-Elf',
        role: prev.role || 'Ranger',
        bio: prev.bio || 'A half-elven ranger with exceptional tracking abilities and a deep connection to nature.'
      }));
    }, 1000);
  };
  
  // Updated handleSaveField to support nested fields
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
  
  const handleNewChat = () => {
    setChatMessages([{ 
      role: "assistant", 
      content: 'Hello! I can help you create a character. What kind of character would you like to create?' 
    }]);
  };
  
  return (
    <Layout>
      {/* Main content with fixed height */}
      <div className="fixed inset-0 pt-16 pb-0"> {/* pt-16 accounts for the header height */}
        <div className="flex h-full">
          {/* Left Column - Chat Area */}
          <div className="w-full lg:w-1/2 flex flex-col h-full overflow-hidden border-r border-border/30">
            {/* Back button */}
            <div className="p-4 bg-background">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = `/worlds/${worldId}`}
                className="mb-2"
              >
                <ArrowLeft size={16} className="mr-2" /> Back to World
              </Button>
            </div>
            
            {/* Chat area - Scrollable */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 mb-4">
                {chatMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-lg ${
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
            </ScrollArea>
            
            {/* New Chat button */}
            <div className="p-4 bg-background">
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={handleNewChat}
              >
                <Plus size={16} className="mr-2" /> New Chat
              </Button>
            </div>
            
            {/* Fixed input area */}
            <div className="p-4 bg-background">
              <form onSubmit={handleMessageSubmit} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Talk to the engine..."
                  className="flex-grow"
                />
                <Button type="submit" size="icon">
                  <Send size={16} />
                </Button>
              </form>
              
              <div className="flex justify-between mt-4">
                <Link to="/plans" className="text-muted-foreground hover:text-foreground transition-colors">
                  View Plans
                </Link>
                
                <Button 
                  variant="default"
                  onClick={handleSaveCharacter}
                  className="gap-2"
                >
                  <Save size={16} /> Save Character
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Character Details - Scrollable */}
          <div className="hidden lg:block w-1/2 h-full overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                <Card id="character-sheet" className="bg-card border-none shadow-none">
                  <CardContent className="space-y-8 p-0">
                    {/* 1. Name, Race, Jobs (3-column grid) */}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Name</h2>
                      <EditableField
                        initialValue={character.name}
                        onSave={(value) => handleSaveField('name', value)}
                        placeholder="Character name"
                        className="p-2 rounded hover:bg-muted/50 border border-border/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Race</h2>
                      <EditableField
                        initialValue={character.race}
                        onSave={(value) => handleSaveField('race', value)}
                        placeholder="Race/Species"
                        className="p-2 rounded hover:bg-muted/50 border border-border/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Jobs</h2>
                      <EditableField
                        initialValue={character.jobs}
                        onSave={(value) => handleSaveField('jobs', value)}
                        placeholder="Character jobs"
                        className="p-2 rounded hover:bg-muted/50 border border-border/50"
                      />
                    </div>
                    
                    {/* 2. Role, Parents (2-column grid) */}
                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Role</h2>
                        <EditableField
                          initialValue={character.role}
                          onSave={(value) => handleSaveField('role', value)}
                          placeholder="Class/Occupation"
                          className="p-2 rounded hover:bg-muted/50 border border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Parents</h2>
                        <EditableField
                          initialValue={character.parents}
                          onSave={(value) => handleSaveField('parents', value)}
                          placeholder="Character's parents"
                          className="p-2 rounded hover:bg-muted/50 border border-border/50"
                        />
                      </div>
                    </div>
                    
                    {/* 3. Personality Block */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">Personality</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-lg font-medium">MBTI</label>
                          <EditableField
                            initialValue={character.personality.mbti}
                            onSave={(value) => handleSaveField('personality.mbti', value)}
                            placeholder="MBTI Type"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Enneagram</label>
                          <EditableField
                            initialValue={character.personality.enneagram}
                            onSave={(value) => handleSaveField('personality.enneagram', value)}
                            placeholder="Enneagram Type"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Alignment</label>
                          <EditableField
                            initialValue={character.personality.alignment}
                            onSave={(value) => handleSaveField('personality.alignment', value)}
                            placeholder="Character Alignment"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Traits</label>
                          <EditableField
                            initialValue={character.personality.traits}
                            onSave={(value) => handleSaveField('personality.traits', value)}
                            placeholder="Personality traits"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                            multiline
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* 4. Bio */}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Biography</h2>
                      <EditableField
                        initialValue={character.bio}
                        onSave={(value) => handleSaveField('bio', value)}
                        placeholder="Character's background story"
                        className="p-2 rounded hover:bg-muted/50 border border-border/50"
                        multiline
                      />
                    </div>
                    
                    {/* 5. Equipment */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">Equipment</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Weapon</label>
                          <EditableField
                            initialValue={character.equipment.weapon}
                            onSave={(value) => handleSaveField('equipment.weapon', value)}
                            placeholder="Character's weapons"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Armor</label>
                          <EditableField
                            initialValue={character.equipment.armor}
                            onSave={(value) => handleSaveField('equipment.armor', value)}
                            placeholder="Character's armor"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* 6. Style */}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Style</h2>
                      <EditableField
                        initialValue={character.style}
                        onSave={(value) => handleSaveField('style', value)}
                        placeholder="Character's appearance and style"
                        className="p-2 rounded hover:bg-muted/50 border border-border/50"
                        multiline
                      />
                    </div>
                    
                    {/* 7. Stats */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">Stats</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-lg font-medium">HP</label>
                          <EditableField
                            initialValue={character.stats.hp}
                            onSave={(value) => handleSaveField('stats.hp', value)}
                            placeholder="Hit Points"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">MP</label>
                          <EditableField
                            initialValue={character.stats.mp}
                            onSave={(value) => handleSaveField('stats.mp', value)}
                            placeholder="Magic Points"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Phys Attack</label>
                          <EditableField
                            initialValue={character.stats.physAttack}
                            onSave={(value) => handleSaveField('stats.physAttack', value)}
                            placeholder="Physical Attack"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Phys Defense</label>
                          <EditableField
                            initialValue={character.stats.physDefense}
                            onSave={(value) => handleSaveField('stats.physDefense', value)}
                            placeholder="Physical Defense"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Agility</label>
                          <EditableField
                            initialValue={character.stats.agility}
                            onSave={(value) => handleSaveField('stats.agility', value)}
                            placeholder="Agility"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Magic Attack</label>
                          <EditableField
                            initialValue={character.stats.magicAttack}
                            onSave={(value) => handleSaveField('stats.magicAttack', value)}
                            placeholder="Magic Attack"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Magic Defense</label>
                          <EditableField
                            initialValue={character.stats.magicDefense}
                            onSave={(value) => handleSaveField('stats.magicDefense', value)}
                            placeholder="Magic Defense"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Resist</label>
                          <EditableField
                            initialValue={character.stats.resist}
                            onSave={(value) => handleSaveField('stats.resist', value)}
                            placeholder="Resistance"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* 8. Abilities */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">Abilities</h2>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Main Ability</label>
                          <EditableField
                            initialValue={character.abilities.mainAbility}
                            onSave={(value) => handleSaveField('abilities.mainAbility', value)}
                            placeholder="Character's main ability"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Signature Skills</label>
                          <EditableField
                            initialValue={character.abilities.signatureSkills}
                            onSave={(value) => handleSaveField('abilities.signatureSkills', value)}
                            placeholder="Character's signature skills"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                            multiline
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-lg font-medium">Passives</label>
                          <EditableField
                            initialValue={character.abilities.passives}
                            onSave={(value) => handleSaveField('abilities.passives', value)}
                            placeholder="Character's passive abilities"
                            className="p-2 rounded hover:bg-muted/50 border border-border/50"
                            multiline
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* 9. Notes */}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Notes</h2>
                      <EditableField
                        initialValue={character.notes}
                        onSave={(value) => handleSaveField('notes', value)}
                        placeholder="Additional notes about the character"
                        className="p-2 rounded hover:bg-muted/50 border border-border/50"
                        multiline
                      />
                    </div>
                    
                    {/* 10. Relationships */}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Relationships</h2>
                      <EditableField
                        initialValue={character.relationships}
                        onSave={(value) => handleSaveField('relationships', value)}
                        placeholder="Character's relationships with other characters"
                        className="p-2 rounded hover:bg-muted/50 border border-border/50"
                        multiline
                      />
                    </div>
                    
                    {/* Add extra padding at the bottom for better scrolling experience */}
                    <div className="h-8"></div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
            
            {/* Preview & Export Button (Bottom Right) */}
            <div className="absolute bottom-4 right-4">
              <Button variant="default" className="gap-2">
                Preview & Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CharacterCreation;
