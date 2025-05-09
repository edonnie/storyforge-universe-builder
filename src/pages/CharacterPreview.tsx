import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Upload } from 'lucide-react';
import { exportAsPDF, exportAsImage } from '../utils/exportUtils';
import { useToast } from "@/hooks/use-toast";
import { Character } from '../components/character/CharacterSheet';
import { Progress } from '@/components/ui/progress';

const CharacterPreview = () => {
  const { worldId, characterId } = useParams<{ worldId: string; characterId: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Try to load character data from localStorage
    const storedCharacter = localStorage.getItem('previewCharacter');
    
    if (storedCharacter) {
      setCharacter(JSON.parse(storedCharacter));
      setLoading(false);
      // We no longer remove this from localStorage so we can return to it
      return;
    }
    
    // If no stored character, try to load from API or use default
    // For now, we'll just simulate loading with a placeholder
    setLoading(true);
    
    setTimeout(() => {
      // Use stored character from API or create default if needed
      const defaultCharacter: Character = {
        id: characterId || 'char_default',
        name: 'New Character',
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
        bio: 'This character has no biography yet.',
        equipment: {
          weapon: '',
          armor: '',
        },
        style: '',
        stats: {
          hp: '0',
          mp: '0',
          physAttack: '0',
          physDefense: '0',
          agility: '0',
          magicAttack: '0',
          magicDefense: '0',
          resist: '0',
        },
        abilities: {
          mainAbility: '',
          signatureSkills: '',
          passives: '',
        },
        notes: '',
        relationships: '',
      };
      
      setCharacter(defaultCharacter);
      setLoading(false);
    }, 500);
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

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCharacterImage(result);
    };
    reader.readAsDataURL(file);
    
    toast({
      title: "Image uploaded",
      description: "Character image has been updated",
    });
  };
  
  // Custom back function to properly return to character creation
  const handleBack = () => {
    if (worldId) {
      navigate(`/worlds/${worldId}/characters/create`);
    } else {
      window.history.back();
    }
  };

  // Convert stat value to percentage for Progress component - updated to use max value
  const getStatPercentage = (value: string): number => {
    const num = parseInt(value, 10);
    // For visualization purposes, normalize to 0-100 range
    return Math.min(Math.max(num, 0), 100);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
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
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div id="character-sheet-preview" className="bg-[#0a0a0a] text-white rounded-lg overflow-hidden">
            <div className="p-6 pb-0">
              <div className="flex justify-between items-center">
                <div className="text-blue-400">FateEngine</div>
                <div>Character Profile</div>
              </div>
              <h1 className="mt-6 text-4xl font-bold uppercase">{character.name}</h1>
              <div className="flex gap-6 mt-2 pb-4">
                <div><span className="text-gray-400">Race:</span> {character.race}</div>
                <div><span className="text-gray-400">Jobs:</span> {character.jobs}</div>
                <div><span className="text-gray-400">Role:</span> {character.role}</div>
              </div>
              <hr className="border-t border-gray-800" />
            </div>
            
            <div className="p-6">
              <div className="flex gap-8">
                {/* Character Image */}
                <label className="w-56 h-64 bg-gray-800 flex items-center justify-center cursor-pointer relative">
                  {characterImage ? (
                    <img 
                      src={characterImage} 
                      alt="Character" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Upload size={24} className="mb-2" />
                      [Character Image]
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </label>
                
                {/* Stats */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold uppercase mb-4">STATS</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="w-16 whitespace-nowrap">HP</span>
                      <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${getStatPercentage(character.stats.hp)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{character.stats.hp}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-16 whitespace-nowrap">MP</span>
                      <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${getStatPercentage(character.stats.mp)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{character.stats.mp}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-16 whitespace-nowrap">Phys Atk</span>
                      <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${getStatPercentage(character.stats.physAttack)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{character.stats.physAttack}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-16 whitespace-nowrap">Phys Def</span>
                      <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${getStatPercentage(character.stats.physDefense)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{character.stats.physDefense}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-16 whitespace-nowrap">Agility</span>
                      <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${getStatPercentage(character.stats.agility)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{character.stats.agility}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-16 whitespace-nowrap">Mag Atk</span>
                      <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${getStatPercentage(character.stats.magicAttack)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{character.stats.magicAttack}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-16 whitespace-nowrap">Mag Def</span>
                      <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${getStatPercentage(character.stats.magicDefense)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{character.stats.magicDefense}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-16 whitespace-nowrap">Resist</span>
                      <div className="w-full h-1 bg-gray-700 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${getStatPercentage(character.stats.resist)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{character.stats.resist}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <hr className="border-t border-gray-800 my-8" />
              
              {/* Personality */}
              <div className="py-6">
                <h2 className="text-xl font-semibold uppercase mb-4">PERSONALITY</h2>
                <div className="space-y-2">
                  <div><span className="text-gray-400">MBTI:</span> {character.personality.mbti}</div>
                  <div><span className="text-gray-400">Enneagram:</span> {character.personality.enneagram}</div>
                  <div><span className="text-gray-400">Alignment:</span> {character.personality.alignment}</div>
                  <div><span className="text-gray-400">Traits:</span> {character.personality.traits}</div>
                </div>
              </div>
              
              <hr className="border-t border-gray-800 my-8" />
              
              {/* Biography */}
              <div className="py-6">
                <h2 className="text-xl font-semibold uppercase mb-4">BIOGRAPHY</h2>
                <div className="space-y-4">
                  <div><span className="text-gray-400">Parents:</span> {character.parents}</div>
                  <div className="text-base leading-relaxed">{character.bio}</div>
                </div>
              </div>
              
              <hr className="border-t border-gray-800 my-8" />
              
              {/* Abilities */}
              <div className="py-6">
                <h2 className="text-xl font-semibold uppercase mb-4">ABILITIES</h2>
                <div className="space-y-4">
                  <div><span className="text-gray-400">Main Ability:</span> {character.abilities.mainAbility}</div>
                  <div>
                    <div className="text-gray-400">Signature Skills:</div>
                    <div className="pl-4 text-base leading-relaxed">
                      {character.abilities.signatureSkills.split(',').map((skill, i) => (
                        <div key={i}>• {skill.trim()}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Passives:</div>
                    <div className="pl-4 text-base leading-relaxed">
                      {character.abilities.passives.split(',').map((passive, i) => (
                        <div key={i}>• {passive.trim()}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <hr className="border-t border-gray-800 my-8" />
              
              {/* Equipment & Style */}
              <div className="py-6">
                <h2 className="text-xl font-semibold uppercase mb-4">EQUIPMENT & STYLE</h2>
                <div className="space-y-2">
                  <div><span className="text-gray-400">Weapon:</span> {character.equipment.weapon}</div>
                  <div><span className="text-gray-400">Armor:</span> {character.equipment.armor}</div>
                  <div><span className="text-gray-400">Style:</span> {character.style}</div>
                </div>
              </div>
              
              <hr className="border-t border-gray-800 my-8" />
              
              {/* Notes */}
              <div className="py-6">
                <h2 className="text-xl font-semibold uppercase mb-4">NOTES</h2>
                <div className="pl-4 text-base leading-relaxed">
                  {character.notes.split('\n').map((note, i) => (
                    <div key={i}>{note}</div>
                  ))}
                </div>
              </div>
              
              <hr className="border-t border-gray-800 my-8" />
              
              {/* Relationships */}
              <div className="py-6">
                <h2 className="text-xl font-semibold uppercase mb-4">RELATIONSHIPS</h2>
                <div className="pl-4 text-base leading-relaxed">
                  {character.relationships.split('\n').map((rel, i) => (
                    <div key={i}>{rel}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
