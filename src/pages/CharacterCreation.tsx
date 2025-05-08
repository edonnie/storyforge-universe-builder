
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash, Save, Send } from 'lucide-react';

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
  
  // Character state
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    role: '',
    personality: '',
    appearance: '',
    background: '',
    goals: '',
    relationships: ''
  });
  
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
  
  const handleInputChange = (field: keyof typeof character, value: string) => {
    setCharacter({
      ...character,
      [field]: value
    });
  };
  
  const handleSaveCharacter = () => {
    // This will be integrated with Supabase in the future
    alert('Character saved successfully!');
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
        </div>
        
        {/* Right Column - Character Details */}
        <div className="space-y-4">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Character Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={character.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Character name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Race</label>
                  <Input
                    value={character.race}
                    onChange={(e) => handleInputChange('race', e.target.value)}
                    placeholder="Race/Species"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    value={character.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    placeholder="Class/Occupation"
                  />
                </div>
              </div>
              
              {/* Character Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Personality</label>
                <Textarea
                  value={character.personality}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                  placeholder="Describe the character's personality traits"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Appearance</label>
                <Textarea
                  value={character.appearance}
                  onChange={(e) => handleInputChange('appearance', e.target.value)}
                  placeholder="Describe the character's appearance"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Background</label>
                <Textarea
                  value={character.background}
                  onChange={(e) => handleInputChange('background', e.target.value)}
                  placeholder="Describe the character's history and background"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Goals</label>
                <Textarea
                  value={character.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="What are the character's motivations and goals?"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Relationships</label>
                <Textarea
                  value={character.relationships}
                  onChange={(e) => handleInputChange('relationships', e.target.value)}
                  placeholder="Describe the character's relationships with other characters"
                  rows={3}
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
