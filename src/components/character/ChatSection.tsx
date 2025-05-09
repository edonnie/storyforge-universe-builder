
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { parseStructuredOutput, detectOutputType } from "../../utils/parseUtils";
import { Character } from "../character/CharacterSheet";
import TypingIndicator from './TypingIndicator';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
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
    const checkAuthentication = () => {
      const token = localStorage.getItem('fateToken');
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to use the chat feature.",
          variant: "destructive"
        });
        navigate('/');
        return false;
      }
      return true;
    };
    
    if (!checkAuthentication()) return;
    
    const savedChatHistory = localStorage.getItem('chatHistory');
    const savedCharacter = localStorage.getItem('currentCharacter');
    
    if (savedChatHistory) {
      setChatMessages(JSON.parse(savedChatHistory));
    }
    
    if (savedCharacter) {
      setCharacter(JSON.parse(savedCharacter));
    }
  }, [navigate, setChatMessages, setCharacter, toast]);
  
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    
    // Check authentication
    const token = localStorage.getItem('fateToken');
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to use the chat feature.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
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
      // Call the generate API
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ prompt: newMessages })
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('fateToken');
        localStorage.removeItem('fatePlan');
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        navigate('/');
        return;
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
      
      // Extract first line for display in chat
      const displayResponse = extractFirstLine(botResponse);
      
      // Add the assistant message with only the first line visible in chat
      const updatedMessages: ChatMessage[] = [
        ...newMessages, 
        { role: "assistant" as const, content: displayResponse }
      ];
      setChatMessages(updatedMessages);
      
      // Check if it's a character sheet and update if so
      const isCharacterSheet = detectOutputType(botResponse);
      if (isCharacterSheet === "character") {
        console.log("Detected character sheet, updating character data");
        const updatedCharacter = parseStructuredOutput(botResponse, character);
        console.log("Updated character:", updatedCharacter);
        setCharacter(updatedCharacter);
        
        // Store the full response in localStorage for reference
        localStorage.setItem('lastFullResponse', botResponse);
      }
      
    } catch (error) {
      console.error('Error calling generate API:', error);
      
      // Show error message
      setChatMessages([
        ...newMessages,
        { role: "assistant" as const, content: `⚠️ Error: Could not connect to the server. Please try again later.` }
      ]);
      
      toast({
        title: "Connection error",
        description: "Failed to connect to the AI engine. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Extract just the first line or short greeting from a bot response
  const extractFirstLine = (text: string): string => {
    // Try to find first line that's relatively short (likely a greeting)
    const lines = text.split('\n');
    
    // If first line is short (likely a greeting), just return that
    if (lines[0] && lines[0].length < 50 && !lines[0].includes(':')) {
      return lines[0];
    }
    
    // Default to a simple response if no good first line is found
    return "Here's your character!";
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
    localStorage.removeItem('lastFullResponse');
    
    toast({
      title: "New chat started",
      description: "Start creating a new character!"
    });
  };
  
  const handleSaveCharacter = async () => {
    // Check authentication
    const token = localStorage.getItem('fateToken');
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your character.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    // Get project ID or create one if it doesn't exist
    let projectId = localStorage.getItem('currentProjectId');
    if (!projectId) {
      projectId = `project_${Date.now()}`;
      localStorage.setItem('currentProjectId', projectId);
    }
    
    setIsLoading(true);
    
    try {
      // Call the save API
      const response = await fetch(`${API_BASE_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          projectId,
          characterData: character,
          messageHistory: chatMessages
        })
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('fateToken');
        localStorage.removeItem('fatePlan');
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      toast({
        title: "Character saved",
        description: character.name ? `${character.name} has been saved successfully.` : "Character saved successfully."
      });
      
      // Call the parent onSaveCharacter function if needed
      onSaveCharacter();
      
    } catch (error) {
      console.error('Error saving character:', error);
      toast({
        title: "Save failed",
        description: "Failed to save your character. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full lg:w-1/2 flex flex-col h-full overflow-hidden border-r border-border/30">
      {/* Back button and New Chat button */}
      <div className="p-4 bg-background flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/worlds/${worldId}`)}
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
            onClick={handleSaveCharacter}
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
