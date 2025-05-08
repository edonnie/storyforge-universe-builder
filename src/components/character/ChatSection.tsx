
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define the ChatMessage type to ensure proper typing
export type ChatMessageRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

interface ChatSectionProps {
  worldId: string;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onSaveCharacter: () => void;
}

const ChatSection = ({ 
  worldId, 
  chatMessages, 
  setChatMessages,
  onSaveCharacter
}: ChatSectionProps) => {
  const [inputMessage, setInputMessage] = useState('');
  
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
    }, 1000);
  };
  
  const handleNewChat = () => {
    setChatMessages([{ 
      role: "assistant", 
      content: 'Hello! I can help you create a character. What kind of character would you like to create?' 
    }]);
  };
  
  return (
    <div className="w-full lg:w-1/2 flex flex-col h-full overflow-hidden border-r border-border/30">
      {/* Back button and New Chat button */}
      <div className="p-4 bg-background flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = `/worlds/${worldId}`}
        >
          <ArrowLeft size={16} className="mr-2" /> Back to World
        </Button>
        
        <Button
          variant="outline"
          onClick={handleNewChat}
          className="gap-2"
        >
          <Plus size={16} /> New Chat
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
            onClick={onSaveCharacter}
            className="gap-2"
          >
            Save Character
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
