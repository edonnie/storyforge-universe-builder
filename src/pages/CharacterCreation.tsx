import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import EditableField from '../components/EditableField';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  
  // Character state
  const [character, setCharacter] = useState({
    id: '',
    name: '',
    race: '',
    role: '',
    personality: '',
    appearance: '',
    background: '',
    goals: '',
    relationships: ''
  });
  
  useEffect(() => {
    // In a real implementation, we would fetch the character data if editing an existing character
    // For now, we'll use mock data
    setCharacter({
      id: `char_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Alaric Stormwind',
      race: 'Half-Elf',
      role: 'Ranger',
      personality: 'Stoic but compassionate, prefers solitude but fiercely loyal to allies.',
      appearance: 'Tall with slight elven features, emerald eyes, and dark hair with a silver streak.',
      background: 'Raised in the border forests by his human mother after his elven father disappeared on a dangerous mission.',
      goals: 'To discover what happened to his father and protect the ancient forests from corruption.',
      relationships: "Mentored by an old human ranger named Harlon. Rivalry with Thorne Ironheart, a dwarf who blames elves for his clan's misfortune."
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
  
  const handleSaveField = async (field: keyof typeof character, value: string): Promise<void> => {
    // Update local state immediately
    setCharacter({
      ...character,
      [field]: value
    });
    
    // In a real app, this would update the character in Supabase
    if (worldId && character.id) {
      try {
        await updateEntity(character.id, worldId, {
          details: {
            ...character,
            [field]: value
          }
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
      <CardTitle>Character Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">

      {/* Row 1: Name, Race, Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EditableField label="Name" initialValue={character.name} onSave={(v) => handleSaveField('name', v)} />
        <EditableField label="Race" initialValue={character.race} onSave={(v) => handleSaveField('race', v)} />
        <EditableField label="Jobs" initialValue={character.jobs} onSave={(v) => handleSaveField('jobs', v)} />
      </div>

      {/* Row 2: Role, Parents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField label="Role" initialValue={character.role} onSave={(v) => handleSaveField('role', v)} />
        <EditableField label="Parents" initialValue={character.parents} onSave={(v) => handleSaveField('parents', v)} />
      </div>

      {/* Personality Block */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Personality</label>
        <EditableField label="MBTI" initialValue={character.personality?.mbti} onSave={(v) => handleSaveField('personality.mbti', v)} />
        <EditableField label="Enneagram" initialValue={character.personality?.enneagram} onSave={(v) => handleSaveField('personality.enneagram', v)} />
        <EditableField label="Alignment" initialValue={character.personality?.alignment} onSave={(v) => handleSaveField('personality.alignment', v)} />
        <EditableField label="Traits" initialValue={character.personality?.traits} onSave={(v) => handleSaveField('personality.traits', v)} multiline />
      </div>

      {/* Bio */}
      <EditableField label="Bio" initialValue={character.bio} onSave={(v) => handleSaveField('bio', v)} multiline />

      {/* Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField label="Weapon" initialValue={character.weapon} onSave={(v) => handleSaveField('weapon', v)} />
        <EditableField label="Armor" initialValue={character.armor} onSave={(v) => handleSaveField('armor', v)} />
      </div>

      {/* Style */}
      <EditableField label="Style" initialValue={character.style} onSave={(v) => handleSaveField('style', v)} multiline />

      {/* Stats */}
      <div>
        <label className="text-sm font-medium">Stats</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {['hp','mp','physAttack','physDefense','agility','magicAttack','magicDefense','resist'].map((key) => (
            <EditableField
              key={key}
              label={key.toUpperCase()}
              initialValue={character.stats?.[key] || '0'}
              onSave={(v) => handleSaveField(`stats.${key}`, v)}
            />
          ))}
        </div>
      </div>

      {/* Abilities */}
      <EditableField label="Main Ability" initialValue={character.mainAbility} onSave={(v) => handleSaveField('mainAbility', v)} />
      <EditableField label="Signature Skills" initialValue={character.signatureSkills} onSave={(v) => handleSaveField('signatureSkills', v)} multiline />
      <EditableField label="Passives" initialValue={character.passives} onSave={(v) => handleSaveField('passives', v)} multiline />

      {/* Notes and Relationships */}
      <EditableField label="Notes" initialValue={character.notes} onSave={(v) => handleSaveField('notes', v)} multiline />
      <EditableField label="Relationships" initialValue={character.relationships} onSave={(v) => handleSaveField('relationships', v)} multiline />

      {/* Optional Story */}
      <EditableField label="Story" initialValue={character.story} onSave={(v) => handleSaveField('story', v)} multiline />
    </CardContent>
  </Card>
</div>
      </div>
    </Layout>
  );
};

export default CharacterCreation;
