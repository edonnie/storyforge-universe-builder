
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { exportAsPDF, exportAsImage } from '../utils/exportUtils';
import { useToast } from "@/hooks/use-toast";
import { Character } from '../components/character/CharacterSheet';

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
        name: 'Kaelen Thorne',
        race: 'Human',
        jobs: 'Warrior, Scout',
        role: 'Tank / DPS',
        parents: 'Eamon Thorne and Lila Thorne',
        personality: {
          mbti: 'ESTJ',
          enneagram: '8w7',
          alignment: 'Neutral Good',
          traits: 'Brave, Resilient, Tactical, Stubborn, Honorable',
        },
        bio: 'Raised in a border village, Kaelen trained from a young age to defend his home. He has fought in numerous skirmishes and seeks to prove his strength through honorable combat.',
        equipment: {
          weapon: 'Dual-handed broadsword with intricate runes along the blade',
          armor: 'Heavy plate armor with reinforced leather padding and a crimson crest',
        },
        style: 'Short, messy brown hair; sharp green eyes; practical steel-gray armor with red accents, leather boots, and a tactical cape',
        stats: {
          hp: '46',
          mp: '10',
          physAttack: '45',
          physDefense: '44',
          agility: '28',
          magicAttack: '12',
          magicDefense: '15',
          resist: '17',
        },
        abilities: {
          mainAbility: 'Banner of Valor',
          signatureSkills: 'Power Strike, Shield Bash, Rallying Cry',
          passives: 'Hardiness, Combat Reflexes, Armor Mastery',
        },
        notes: '• Known for his leadership on the battlefield\n• Has a rivalry with a rival warrior, Morgan\n• Dreams of uniting the scattered clans of the region',
        relationships: '• Eamon Thorne — Father, retired blacksmith and veteran fighter\n• Lila Thorne — Mother, healer and village healer\n• Morgan — Rival warrior, often competes in tournaments',
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

  // Convert stat value to percentage for Progress component
  const getStatPercentage = (value: string): number => {
    const num = parseInt(value, 10);
    return Math.min(Math.max(num, 0), 100);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Character Preview</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileText size={16} className="mr-2" /> Download PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('image')}>
              <Download size={16} className="mr-2" /> Download Image
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
        <div id="character-sheet-preview" className="container mx-auto pb-12">
          <Card className="bg-[#0a0a0a] text-white mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="text-blue-400">FateEngine</div>
                <div>Character Profile</div>
              </div>
              <CardTitle className="mt-6 text-4xl font-bold">{character.name}</CardTitle>
              <div className="flex gap-6 mt-2">
                <div><span className="text-gray-400">Race:</span> {character.race}</div>
                <div><span className="text-gray-400">Jobs:</span> {character.jobs}</div>
                <div><span className="text-gray-400">Role:</span> {character.role}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex gap-8">
                {/* Character Image */}
                <div className="w-64 h-64 bg-gray-800 flex items-center justify-center">
                  [Character Image]
                </div>
                
                {/* Stats */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">STATS</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-24">HP</span>
                      <Progress value={getStatPercentage(character.stats.hp)} className="flex-1 h-2" />
                      <span className="w-8 text-right">{character.stats.hp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24">MP</span>
                      <Progress value={getStatPercentage(character.stats.mp)} className="flex-1 h-2" />
                      <span className="w-8 text-right">{character.stats.mp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24">Phys Atk</span>
                      <Progress value={getStatPercentage(character.stats.physAttack)} className="flex-1 h-2" />
                      <span className="w-8 text-right">{character.stats.physAttack}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24">Phys Def</span>
                      <Progress value={getStatPercentage(character.stats.physDefense)} className="flex-1 h-2" />
                      <span className="w-8 text-right">{character.stats.physDefense}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24">Agility</span>
                      <Progress value={getStatPercentage(character.stats.agility)} className="flex-1 h-2" />
                      <span className="w-8 text-right">{character.stats.agility}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24">Mag Atk</span>
                      <Progress value={getStatPercentage(character.stats.magicAttack)} className="flex-1 h-2" />
                      <span className="w-8 text-right">{character.stats.magicAttack}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24">Mag Def</span>
                      <Progress value={getStatPercentage(character.stats.magicDefense)} className="flex-1 h-2" />
                      <span className="w-8 text-right">{character.stats.magicDefense}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24">Resist</span>
                      <Progress value={getStatPercentage(character.stats.resist)} className="flex-1 h-2" />
                      <span className="w-8 text-right">{character.stats.resist}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Personality */}
              <div>
                <h2 className="text-xl font-bold mb-4">PERSONALITY</h2>
                <div className="space-y-3">
                  <div><span className="text-gray-400">MBTI:</span> {character.personality.mbti}</div>
                  <div><span className="text-gray-400">Enneagram:</span> {character.personality.enneagram}</div>
                  <div><span className="text-gray-400">Alignment:</span> {character.personality.alignment}</div>
                  <div><span className="text-gray-400">Traits:</span> {character.personality.traits}</div>
                </div>
              </div>
              
              {/* Biography */}
              <div>
                <h2 className="text-xl font-bold mb-4">BIOGRAPHY</h2>
                <div className="space-y-3">
                  <div><span className="text-gray-400">Parents:</span> {character.parents}</div>
                  <div className="whitespace-pre-line">{character.bio}</div>
                </div>
              </div>
              
              {/* Abilities */}
              <div>
                <h2 className="text-xl font-bold mb-4">ABILITIES</h2>
                <div className="space-y-3">
                  <div><span className="text-gray-400">Main Ability:</span> {character.abilities.mainAbility}</div>
                  <div>
                    <div className="text-gray-400 mb-1">Signature Skills:</div>
                    <div className="whitespace-pre-line ml-4">
                      {character.abilities.signatureSkills.split(',').map((skill, i) => (
                        <div key={i}>• {skill.trim()}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Passives:</div>
                    <div className="whitespace-pre-line ml-4">
                      {character.abilities.passives.split(',').map((passive, i) => (
                        <div key={i}>• {passive.trim()}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Equipment & Style */}
              <div>
                <h2 className="text-xl font-bold mb-4">EQUIPMENT & STYLE</h2>
                <div className="space-y-3">
                  <div><span className="text-gray-400">Weapon:</span> {character.equipment.weapon}</div>
                  <div><span className="text-gray-400">Armor:</span> {character.equipment.armor}</div>
                  <div><span className="text-gray-400">Style:</span> {character.style}</div>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <h2 className="text-xl font-bold mb-4">NOTES</h2>
                <div className="whitespace-pre-line">{character.notes}</div>
              </div>
              
              {/* Relationships */}
              <div>
                <h2 className="text-xl font-bold mb-4">RELATIONSHIPS</h2>
                <div className="whitespace-pre-line">{character.relationships}</div>
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
