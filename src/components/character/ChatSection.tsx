import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { parseStructuredOutput, detectOutputType } from "../../utils/parseUtils";
import { Character } from "../character/CharacterSheet";

// Define the API base URL
const API_BASE_URL = "https://fateengine-server.onrender.com";

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
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
}

const ChatSection = ({ 
  worldId, 
  chatMessages, 
  setChatMessages,
  onSaveCharacter,
  character,
  setCharacter
}: ChatSectionProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [chatMessages]);
  
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    
    // Add user message to chat
    const newMessages = [
      ...chatMessages, 
      { role: "user" as const, content: inputMessage }
    ];
    setChatMessages(newMessages);
    
    // Clear input
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Get the token
      const token = localStorage.getItem('fateToken');
      
      // Show typing indicator (defined in index.html)
      if (window.showTypingIndicator) {
        window.showTypingIndicator();
      }
      
      // Call the generate API
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ prompt: newMessages })
      });
      
      // Hide typing indicator
      if (window.removeTypingIndicator) {
        window.removeTypingIndicator();
      }
      
      if (!response.ok) {
        // Handle error
        const errorMessage = `Server error: ${response.status}`;
        setChatMessages([
          ...newMessages,
          { role: "assistant", content: `⚠️ Error: ${errorMessage}` }
        ]);
        return;
      }
      
      // Parse the response
      const data = await response.json();
      const botResponse = data.response;
      
      // Always add the full bot response to chat messages, with no summaries
      setChatMessages([...newMessages, { role: "assistant", content: botResponse }]);
      
      // If it's a character sheet, parse the data and update the character
      if (detectOutputType(botResponse) === "character") {
        const updatedCharacter = parseStructuredOutput(botResponse, character);
        setCharacter(updatedCharacter);
      }
      
    } catch (error) {
      console.error('Error calling generate API:', error);
      
      // Hide typing indicator
      if (window.removeTypingIndicator) {
        window.removeTypingIndicator();
      }
      
      // Show error message
      setChatMessages([
        ...newMessages,
        { role: "assistant", content: `⚠️ Error: Could not connect to the server. Please try again later.` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewChat = () => {
    // Set a new project ID in localStorage
    localStorage.setItem('currentProjectId', `project_${Date.now()}`);
    
    // Reset chat messages
    setChatMessages([{ 
      role: "assistant", 
      content: 'Hello! I can help you create a character. What kind of character would you like to create?' 
    }]);
    
    // Reset character data
    setCharacter({
      id: `char_${Math.random().toString(36).substr(2, 9)}`,
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
          disabled={isLoading}
        >
          <Plus size={16} /> New Chat
        </Button>
      </div>
      
      {/* Chat area - Scrollable */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 mb-4" ref={scrollAreaRef}>
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
          
          {/* Typing indicator would appear here dynamically */}
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
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
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
            disabled={isLoading}
          >
            Save Character
          </Button>
        </div>
      </div>
    </div>
  );
};

// Add global typing declarations for the functions defined in index.html
declare global {
  interface Window {
    showTypingIndicator?: () => void;
    removeTypingIndicator?: () => void;
  }
}

export default ChatSection;
