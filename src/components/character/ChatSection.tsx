
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { parseStructuredOutput, detectOutputType } from "../../utils/parseUtils";
import { Character } from "../character/CharacterSheet";
import TypingIndicator from './TypingIndicator';

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
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Scroll to the bottom when messages change or typing state changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // Store chat history in localStorage when it changes
  useEffect(() => {
    if (chatMessages.length > 1) {  // Only save if there's actual conversation
      localStorage.setItem('chatHistory', JSON.stringify(chatMessages));
      // Also save the current character state
      localStorage.setItem('currentCharacter', JSON.stringify(character));
    }
  }, [chatMessages, character]);
  
  // Load chat history on initial render
  useEffect(() => {
    const savedChatHistory = localStorage.getItem('chatHistory');
    const savedCharacter = localStorage.getItem('currentCharacter');
    
    if (savedChatHistory) {
      setChatMessages(JSON.parse(savedChatHistory));
    }
    
    if (savedCharacter) {
      setCharacter(JSON.parse(savedCharacter));
    }
  }, []);
  
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
    setIsTyping(true);
    
    try {
      // Get the token
      const token = localStorage.getItem('fateToken');
      
      // Call the generate API
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ prompt: newMessages })
      });
      
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
      
      // Always add the full response to the chat messages
      const updatedMessages = [...newMessages, { role: "assistant", content: botResponse }];
      setChatMessages(updatedMessages);
      
      // Check if it's a character sheet and update if so
      const isCharacterSheet = detectOutputType(botResponse);
      if (isCharacterSheet === "character") {
        console.log("Detected character sheet, updating character data");
        const updatedCharacter = parseStructuredOutput(botResponse, character);
        console.log("Updated character:", updatedCharacter);
        setCharacter(updatedCharacter);
      }
      
    } catch (error) {
      console.error('Error calling generate API:', error);
      
      // Show error message
      setChatMessages([
        ...newMessages,
        { role: "assistant", content: `⚠️ Error: Could not connect to the server. Please try again later.` }
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
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
    
    // Clear saved chat history
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('currentCharacter');
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
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
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
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
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

export default ChatSection;
