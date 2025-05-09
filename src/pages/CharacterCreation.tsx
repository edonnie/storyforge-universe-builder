
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from '../hooks/useCharacter';
import ChatSection, { ChatMessage } from '../components/character/ChatSection';
import CharacterSheet from '../components/character/CharacterSheet';

const CharacterCreation = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: "assistant", 
      content: 'Hello! I can help you create a character. What kind of character would you like to create?' 
    }
  ]);
  const { toast } = useToast();
  const { character, handleSaveField, handleSaveCharacter, setCharacter } = useCharacter(worldId);
  
  return (
    <Layout>
      {/* Main content with proper scrolling */}
      <div className="h-[calc(100vh-4rem)]"> {/* 4rem accounts for the header height */}
        <div className="flex h-full">
          {/* Left Column - Chat Area */}
          <ChatSection 
            worldId={worldId || ''} 
            chatMessages={chatMessages} 
            setChatMessages={setChatMessages}
            onSaveCharacter={handleSaveCharacter}
            character={character}
            setCharacter={setCharacter}
          />
          
          {/* Right Column - Character Details - Scrollable */}
          <CharacterSheet 
            character={character}
            onSaveField={handleSaveField}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CharacterCreation;
