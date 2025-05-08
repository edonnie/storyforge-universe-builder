
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { exportAsPDF, exportAsImage } from '../utils/exportUtils';
import { useToast } from "@/hooks/use-toast";

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

const CharacterPreview = () => {
  const { worldId, characterId } = useParams<{ worldId: string; characterId: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch character data based on characterId
    // For now, just simulate loading
    setLoading(true);
    
    // Mock data for demonstration
    setTimeout(() => {
      setCharacter({
        id: characterId || 'char_default',
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
      setLoading(false);
    }, 1000);
  }, [characterId]);

  const handleExport = async (type: 'pdf' | 'image') => {
    try {
      if (type === 'pdf') {
        await exportAsPDF('character-sheet-preview', `${character?.name || 'character'}`);
      } else {
        await exportAsImage('character-sheet-preview', `${character?.name || 'character'}`);
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Character Preview</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileText size={16} className="mr-2" /> Export as PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('image')}>
              <Download size={16} className="mr-2" /> Export as Image
            </Button>
            {worldId && characterId && (
              <Button>
                <Link to={`/worlds/${worldId}/characters/${characterId}/edit`}>
                  Edit Character
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading character data...</p>
        </div>
      ) : character ? (
        <div id="character-sheet-preview">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 1. Name, Race, Jobs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="mt-1">{character.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Race</p>
                  <p className="mt-1">{character.race}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jobs</p>
                  <p className="mt-1">{character.jobs}</p>
                </div>
              </div>
              
              {/* 2. Role, Parents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="mt-1">{character.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parents</p>
                  <p className="mt-1">{character.parents}</p>
                </div>
              </div>
              
              {/* 3. Personality Block */}
              <div className="bg-muted/10 p-4 rounded-md">
                <h3 className="text-md font-semibold mb-3">Personality</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">MBTI</p>
                    <p className="mt-1">{character.personality.mbti}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enneagram</p>
                    <p className="mt-1">{character.personality.enneagram}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Alignment</p>
                    <p className="mt-1">{character.personality.alignment}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Traits</p>
                  <p className="mt-1">{character.personality.traits}</p>
                </div>
              </div>
              
              {/* 4. Bio */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Biography</p>
                <p className="mt-1 whitespace-pre-line">{character.bio}</p>
              </div>
              
              {/* 5. Equipment */}
              <div className="bg-muted/10 p-4 rounded-md">
                <h3 className="text-md font-semibold mb-3">Equipment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weapon</p>
                    <p className="mt-1">{character.equipment.weapon}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Armor</p>
                    <p className="mt-1">{character.equipment.armor}</p>
                  </div>
                </div>
              </div>
              
              {/* 6. Style */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Style</p>
                <p className="mt-1 whitespace-pre-line">{character.style}</p>
              </div>
              
              {/* 7. Stats */}
              <div className="bg-muted/10 p-4 rounded-md">
                <h3 className="text-md font-semibold mb-3">Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">HP</p>
                    <p className="mt-1">{character.stats.hp}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">MP</p>
                    <p className="mt-1">{character.stats.mp}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phys Attack</p>
                    <p className="mt-1">{character.stats.physAttack}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phys Defense</p>
                    <p className="mt-1">{character.stats.physDefense}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Agility</p>
                    <p className="mt-1">{character.stats.agility}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Magic Attack</p>
                    <p className="mt-1">{character.stats.magicAttack}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Magic Defense</p>
                    <p className="mt-1">{character.stats.magicDefense}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resist</p>
                    <p className="mt-1">{character.stats.resist}</p>
                  </div>
                </div>
              </div>
              
              {/* 8. Abilities */}
              <div className="bg-muted/10 p-4 rounded-md">
                <h3 className="text-md font-semibold mb-3">Abilities</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Main Ability</p>
                    <p className="mt-1">{character.abilities.mainAbility}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Signature Skills</p>
                    <p className="mt-1 whitespace-pre-line">{character.abilities.signatureSkills}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Passives</p>
                    <p className="mt-1 whitespace-pre-line">{character.abilities.passives}</p>
                  </div>
                </div>
              </div>
              
              {/* 9. Notes */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-line">{character.notes}</p>
              </div>
              
              {/* 10. Relationships */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Relationships</p>
                <p className="mt-1 whitespace-pre-line">{character.relationships}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p>Character not found</p>
        </div>
      )}
    </Layout>
  );
};

export default CharacterPreview;
