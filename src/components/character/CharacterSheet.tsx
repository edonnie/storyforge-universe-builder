
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import EditableField from '../EditableField';
import CharacterStatBlock from './CharacterStatBlock';
import CharacterPersonality from './CharacterPersonality';
import CharacterAbilities from './CharacterAbilities';
import { exportAsImage, exportAsPDF } from "@/utils/exportUtils";

// Define the Character interface with nested fields
export interface Character {
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

export const exportCharacterSheet = async (format: 'image' | 'pdf') => {
  const elementId = 'character-sheet';
  const fileName = 'character-sheet';
  
  try {
    if (format === 'image') {
      await exportAsImage(elementId, fileName);
    } else {
      await exportAsPDF(elementId, fileName);
    }
  } catch (error) {
    console.error(`Failed to export as ${format}:`, error);
  }
};

interface CharacterSheetProps {
  character: Character;
  onSaveField: (field: string, value: string) => Promise<void>;
}

const CharacterSheet = ({ character, onSaveField }: CharacterSheetProps) => {
  const navigate = useNavigate();

  const handlePreviewExport = () => {
    // Ensure the character has an ID
    if (!character || !character.id) {
      console.error("Cannot navigate to preview: character ID is missing");
      return;
    }
    
    // Extract worldId from URL or use a default
    const pathParts = window.location.pathname.split('/');
    const worldIdIndex = pathParts.indexOf('worlds') + 1;
    const worldId = worldIdIndex > 0 && worldIdIndex < pathParts.length 
      ? pathParts[worldIdIndex] 
      : '1'; // Default to '1' if not found
    
    // Navigate to the preview page with proper URL construction
    navigate(`/worlds/${worldId}/characters/${character.id}`);
  };

  return (
    <div className="hidden lg:block w-1/2 h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6">
          <Card id="character-sheet" className="bg-card border-none shadow-none">
            <CardHeader>
              <CardTitle>Character Sheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* 1. Name, Race, Jobs (3-column grid) */}
              <div className="grid grid-cols-3 gap-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Name</h2>
                  <EditableField
                    initialValue={character.name}
                    onSave={(value) => onSaveField('name', value)}
                    placeholder="Character name"
                    className="p-2 rounded hover:bg-muted/50 border border-border/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Race</h2>
                  <EditableField
                    initialValue={character.race}
                    onSave={(value) => onSaveField('race', value)}
                    placeholder="Race/Species"
                    className="p-2 rounded hover:bg-muted/50 border border-border/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Jobs</h2>
                  <EditableField
                    initialValue={character.jobs}
                    onSave={(value) => onSaveField('jobs', value)}
                    placeholder="Character jobs"
                    className="p-2 rounded hover:bg-muted/50 border border-border/50"
                  />
                </div>
              </div>
              
              {/* 2. Role, Parents (2-column grid) */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Role</h2>
                  <EditableField
                    initialValue={character.role}
                    onSave={(value) => onSaveField('role', value)}
                    placeholder="Class/Occupation"
                    className="p-2 rounded hover:bg-muted/50 border border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Parents</h2>
                  <EditableField
                    initialValue={character.parents}
                    onSave={(value) => onSaveField('parents', value)}
                    placeholder="Character's parents"
                    className="p-2 rounded hover:bg-muted/50 border border-border/50"
                  />
                </div>
              </div>
              
              {/* 3. Personality Block */}
              <CharacterPersonality 
                personality={character.personality}
                onSaveField={onSaveField}
              />
              
              {/* 4. Bio */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Biography</h2>
                <EditableField
                  initialValue={character.bio}
                  onSave={(value) => onSaveField('bio', value)}
                  placeholder="Character's background story"
                  className="p-2 rounded hover:bg-muted/50 border border-border/50"
                  multiline
                />
              </div>
              
              {/* 5. Equipment */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Equipment</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-lg font-medium">Weapon</label>
                    <EditableField
                      initialValue={character.equipment.weapon}
                      onSave={(value) => onSaveField('equipment.weapon', value)}
                      placeholder="Character's weapons"
                      className="p-2 rounded hover:bg-muted/50 border border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-lg font-medium">Armor</label>
                    <EditableField
                      initialValue={character.equipment.armor}
                      onSave={(value) => onSaveField('equipment.armor', value)}
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
                  onSave={(value) => onSaveField('style', value)}
                  placeholder="Character's appearance and style"
                  className="p-2 rounded hover:bg-muted/50 border border-border/50"
                  multiline
                />
              </div>
              
              {/* 7. Stats */}
              <CharacterStatBlock 
                stats={character.stats}
                onSaveField={onSaveField}
              />
              
              {/* 8. Abilities */}
              <CharacterAbilities 
                abilities={character.abilities}
                onSaveField={onSaveField}
              />
              
              {/* 9. Notes */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Notes</h2>
                <EditableField
                  initialValue={character.notes}
                  onSave={(value) => onSaveField('notes', value)}
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
                  onSave={(value) => onSaveField('relationships', value)}
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
        <Button variant="default" className="gap-2" onClick={handlePreviewExport}>
          Preview & Export
        </Button>
      </div>
    </div>
  );
};

export default CharacterSheet;
